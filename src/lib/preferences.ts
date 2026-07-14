import { GoogleGenAI, Type } from '@google/genai';
import { sql } from '@/lib/db';
import { embedText, toVectorLiteral } from '@/lib/embeddings';

const apiKey = process.env.GEMINI_API_KEY;

export type PreferenceCategory = 'dietary' | 'health' | 'taste' | 'pantry' | 'other';

export interface ExtractedPreference {
  statement: string;
  category: PreferenceCategory;
}

const EXTRACT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    preferences: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          statement: { type: Type.STRING },
          category: { type: Type.STRING },
        },
        required: ['statement', 'category'],
      },
    },
  },
  required: ['preferences'],
};

/**
 * 사용자 메시지에서 앞으로도 계속 참고할 만한 '취향/식습관/건강상태/보유재료' 문장을 뽑아낸다.
 * 예: "매운 거 못 먹어" -> dietary, "다이어트 중이야" -> health,
 *     "냉장고에 두부가 있어" -> pantry, "삼겹살보다 목살을 좋아해" -> taste
 * 단순 질문("부추 요리 뭐 있어?")이나 일회성 요청에서는 아무것도 추출하지 않는다.
 * 실패하거나 추출할 게 없으면 빈 배열을 반환한다 — 이 기능이 실패해도 대화 자체는 막히지 않아야 한다.
 */
export async function extractPreferences(message: string): Promise<ExtractedPreference[]> {
  if (!apiKey || !message.trim()) return [];

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `다음은 요리 챗봇과 대화하는 사용자의 메시지입니다. 이 메시지에서 앞으로도 계속 참고해야 할
'취향/식습관/건강상태/현재 보유 재료' 관련 문장이 있다면 뽑아서 짧고 명확한 한 문장으로 다시 쓰세요.
없으면 빈 배열을 반환하세요. 단순 질문이나 이번 한 번만 유효한 요청은 추출하지 마세요.

카테고리:
- dietary: 못 먹는 음식, 알레르기, 채식 등 식이 제약
- health: 다이어트, 건강 상태, 복용 중인 것 등
- taste: 좋아하거나 싫어하는 맛/스타일 (일시적이지 않은 지속적 취향)
- pantry: 지금 집/냉장고에 있다고 언급한 재료
- other: 그 외 계속 참고할 만한 것

사용자 메시지: "${message.slice(0, 500)}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: EXTRACT_SCHEMA,
        maxOutputTokens: 500,
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const list = Array.isArray(parsed.preferences) ? parsed.preferences : [];
    const validCategories = new Set(['dietary', 'health', 'taste', 'pantry', 'other']);

    return list
      .filter(
        (p: unknown): p is ExtractedPreference =>
          typeof p === 'object' &&
          p !== null &&
          typeof (p as ExtractedPreference).statement === 'string' &&
          (p as ExtractedPreference).statement.trim().length > 0
      )
      .map((p: ExtractedPreference) => ({
        statement: p.statement.trim().slice(0, 200),
        category: validCategories.has(p.category) ? p.category : 'other',
      }));
  } catch (error) {
    console.error('extractPreferences error:', error);
    return [];
  }
}

/** 이미 저장된 것과 의미가 거의 같으면 중복 저장하지 않는다 (코사인 유사도 기준). */
async function isDuplicate(userId: number, embeddingLiteral: string): Promise<boolean> {
  try {
    const rows = await sql`
      SELECT 1 - (embedding <=> ${embeddingLiteral}::vector) AS similarity
      FROM user_preferences
      WHERE user_id = ${userId}
      ORDER BY embedding <=> ${embeddingLiteral}::vector
      LIMIT 1
    `;
    if (rows.length === 0) return false;
    return Number(rows[0].similarity) >= 0.93;
  } catch (error) {
    console.error('isDuplicate check error:', error);
    return false;
  }
}

/** 추출된 선호 문장 하나를 임베딩해서 저장한다. 이미 있는 의미면 건너뛴다. */
export async function savePreference(userId: number, pref: ExtractedPreference): Promise<void> {
  const embedding = await embedText(pref.statement);
  if (!embedding) return;

  const embeddingLiteral = toVectorLiteral(embedding);
  if (await isDuplicate(userId, embeddingLiteral)) return;

  try {
    await sql`
      INSERT INTO user_preferences (user_id, statement, category, embedding)
      VALUES (${userId}, ${pref.statement}, ${pref.category}, ${embeddingLiteral}::vector)
    `;
  } catch (error) {
    console.error('savePreference insert error:', error);
  }
}

/**
 * 메시지에서 선호를 추출하고 저장까지 한 번에 처리한다.
 * 절대 예외를 밖으로 던지지 않는다 — 호출부에서 await 없이 fire-and-forget으로 불러도 안전하다.
 */
export async function extractAndSavePreferences(userId: number, message: string): Promise<void> {
  try {
    const preferences = await extractPreferences(message);
    for (const pref of preferences) {
      await savePreference(userId, pref);
    }
  } catch (error) {
    console.error('extractAndSavePreferences error:', error);
  }
}

/** 지금 질문과 의미상 관련 있는 과거 선호 정보 top-K 문장을 가져온다 (코사인 유사도 기반). */
export async function getRelevantPreferences(
  userId: number,
  queryText: string,
  topK = 3
): Promise<string[]> {
  const embedding = await embedText(queryText);
  if (!embedding) return [];

  try {
    const embeddingLiteral = toVectorLiteral(embedding);
    const rows = await sql`
      SELECT statement, 1 - (embedding <=> ${embeddingLiteral}::vector) AS similarity
      FROM user_preferences
      WHERE user_id = ${userId}
      ORDER BY embedding <=> ${embeddingLiteral}::vector
      LIMIT ${topK}
    `;
    // 유사도가 너무 낮은(관련 없는) 것까지 억지로 끌어오지 않도록 최소 기준을 둔다.
    return rows
      .filter((row) => Number(row.similarity) >= 0.5)
      .map((row) => row.statement as string);
  } catch (error) {
    console.error('getRelevantPreferences error:', error);
    return [];
  }
}

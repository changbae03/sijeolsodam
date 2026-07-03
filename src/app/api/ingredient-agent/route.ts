import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { searchRecipes, getRecipesByIngredient } from '@/data/recipes';
import { SODAMI_TEXT_PERSONA_PROMPT } from '@/lib/persona';

const apiKey = process.env.GEMINI_API_KEY;

interface AgentDish {
  name: string;
  reason: string;
}

interface AgentPayload {
  reply: string;
  dishes: AgentDish[];
}

/** 불용어 — 재료/요리명 키워드 매칭 시 제외할 조사·일반 단어 */
const STOPWORDS = new Set([
  '요리', '레시피', '만들기', '음식', '반찬', '한그릇', '한상', '스타일',
]);

/**
 * AI가 제안한 요리 이름으로 사이트에 실제로 있는 레시피를 찾는다.
 * 1) 전체 이름으로 먼저 검색 → 2) 안 되면 이름을 단어로 쪼개 각 키워드로 검색.
 */
function findMatchingRecipe(dishName: string) {
  const direct = searchRecipes(dishName);
  if (direct.length > 0) return direct[0];

  const keywords = dishName
    .split(/[\s·,/()]+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w));

  for (const kw of keywords) {
    const byIngredient = getRecipesByIngredient(kw);
    if (byIngredient.length > 0) return byIngredient[0];
    const bySearch = searchRecipes(kw);
    if (bySearch.length > 0) return bySearch[0];
  }
  return undefined;
}

function parseAgentJson(raw: string): AgentPayload | null {
  const cleaned = raw.replace(/```json|```/g, '').trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (
      typeof parsed.reply === 'string' &&
      Array.isArray(parsed.dishes) &&
      parsed.dishes.every(
        (d: unknown): d is AgentDish =>
          typeof d === 'object' &&
          d !== null &&
          typeof (d as AgentDish).name === 'string' &&
          typeof (d as AgentDish).reason === 'string'
      )
    ) {
      return parsed as AgentPayload;
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  if (!apiKey) {
    return NextResponse.json(
      { error: '소담이가 아직 준비되지 않았어요. (GEMINI_API_KEY 미설정)' },
      { status: 503 }
    );
  }

  try {
    const { message } = (await request.json()) as { message: string };
    const trimmed = (message ?? '').trim();
    if (!trimmed) {
      return NextResponse.json({ error: '무엇이 궁금하신지 알려주세요.' }, { status: 400 });
    }

    const systemInstruction = `${SODAMI_TEXT_PERSONA_PROMPT}

지금 사용자는 시절소담 홈 화면의 검색창 자리에 있는 대화형 입력창에 메시지를 입력했습니다. 사용자는 냉장고에 있는 재료, 오늘 기분, 상황(손님 초대, 다이어트, 자취생 한 끼 등) 등 무엇이든 자유롭게 입력할 수 있습니다.

당신의 역할:
1. 사용자의 메시지를 읽고, 실제로 집에서 만들 수 있는 구체적인 요리를 2~4개 자유롭게 제안하세요. 사이트에 있는 레시피로 한정하지 말고, 소담이의 지식으로 가장 적절하다고 생각하는 요리를 자신 있게 제안하세요.
2. 각 요리 제안에는 왜 지금 이 요리가 좋은지 1문장 이내의 다정한 이유를 붙이세요 (예: 재료 활용, 계절감, 조리 난이도, 기분 등).
3. 요리 이름은 검색에 쓰일 수 있으므로 재료명을 포함한 명확한 한글 이름으로 쓰세요 (예: "애호박 두부 된장찌개"처럼). 브랜드명이나 지나치게 창작적인 이름은 피하세요.

반드시 아래 JSON 형식으로만 응답하세요. 다른 설명, 마크다운, 코드블록 표시 없이 순수 JSON 텍스트만 출력하세요:
{
  "reply": "사용자에게 건네는 다정한 한두 문장 (예: 애호박이랑 두부만 있어도 든든한 한 끼 만들 수 있어요!)",
  "dishes": [
    { "name": "요리 이름", "reason": "이 요리를 제안하는 짧은 이유" }
  ]
}`;

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: trimmed }] }],
      config: {
        systemInstruction,
        maxOutputTokens: 800,
        temperature: 0.7,
      },
    });

    const rawText = response.text || '';
    const payload = parseAgentJson(rawText);

    if (!payload) {
      return NextResponse.json(
        { error: '소담이가 답변을 정리하지 못했어요. 다시 한 번 물어봐주세요.' },
        { status: 502 }
      );
    }

    const dishesWithLinks = payload.dishes.slice(0, 4).map((dish) => {
      const matched = findMatchingRecipe(dish.name);
      return {
        name: dish.name,
        reason: dish.reason,
        recipe: matched
          ? {
              id: matched.id,
              title: matched.title,
              heroImage: matched.heroImage,
              month: matched.month,
              difficulty: matched.difficulty,
            }
          : null,
      };
    });

    return NextResponse.json({ reply: payload.reply, dishes: dishesWithLinks });
  } catch (error) {
    console.error('Ingredient agent error:', error);
    return NextResponse.json(
      { error: '소담이가 잠시 답변하기 어려워요. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { searchRecipes, getRecipesByIngredient } from '@/data/recipes';
import { searchIngredientsAcrossMonths, findIngredientByName } from '@/data/months';
import { SODAMI_TEXT_PERSONA_PROMPT } from '@/lib/persona';
import { getUserFromRequest } from '@/lib/auth';
import { sql } from '@/lib/db';
import { getUserTopIngredient } from '@/lib/personalization';

const apiKey = process.env.GEMINI_API_KEY;

interface AgentDish {
  name: string;
  reason: string;
}

interface AgentIngredient {
  name: string;
  reason: string;
}

interface AgentPayload {
  reply: string;
  dishes: AgentDish[];
  ingredients: AgentIngredient[];
  /** 조리법 답변일 때, 재료 목록을 "이름 수량" 문자열로 담는 구조화된 필드.
   * reply 본문 텍스트에서 재료 줄을 파싱해 추측하는 대신, 이 필드가 있으면
   * 프런트엔드가 그대로 칩(chip) 목록으로 렌더링해 항상 일관된 모양이 나오게 한다. */
  ingredientList?: string[];
}

interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

/** 불용어 — 재료/요리명 키워드 매칭 시 제외할 조사·일반 단어 */
const STOPWORDS = new Set([
  '요리', '레시피', '만들기', '음식', '반찬', '한그릇', '한상', '스타일',
]);

/** Gemini에 강제할 응답 스키마 — 이 스키마가 있으면 모델이 형식을 벗어난 텍스트를 낼 수 없음 */
const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    reply: { type: Type.STRING },
    dishes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ['name', 'reason'],
      },
    },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ['name', 'reason'],
      },
    },
    ingredientList: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ['reply', 'dishes', 'ingredients'],
};

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

/**
 * AI가 제안한 재료 이름으로 사이트의 제철 재료 페이지를 찾는다.
 * 정확히 일치하면 바로, 아니면 부분일치 검색으로 가장 가까운 것을 사용.
 */
function findMatchingIngredient(ingredientName: string) {
  const exact = findIngredientByName(ingredientName);
  if (exact) return exact.ingredient;

  const fuzzy = searchIngredientsAcrossMonths(ingredientName);
  if (fuzzy.length > 0) return fuzzy[0];

  const keywords = ingredientName
    .split(/[\s·,/()]+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 2);
  for (const kw of keywords) {
    const match = searchIngredientsAcrossMonths(kw);
    if (match.length > 0) return match[0];
  }
  return undefined;
}

/**
 * JSON.parse가 전부 실패했을 때(주로 maxOutputTokens 한도로 응답이 중간에 잘린 경우)
 * 최후의 수단으로 "reply":"..." 부분의 문자열만이라도 살려서 꺼낸다.
 * 절대 원본 JSON 텍스트를 그대로 사용자에게 보여주지 않기 위한 안전장치.
 */
function salvageReplyText(raw: string): string | null {
  const match = raw.match(/"reply"\s*:\s*"((?:\\.|[^"\\])*)"?/);
  if (!match) return null;
  let text = match[1];
  // 응답이 문자열 중간에서 잘렸다면 마지막 이스케이프 문자가 불완전할 수 있으니 정리
  text = text
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .trim();
  return text.length > 0 ? text : null;
}

/**
 * JSON 파싱을 최대한 관대하게 시도한다.
 * 1) 그대로 파싱 → 2) 코드블록/잡텍스트 제거 후 파싱 → 3) 첫 '{'~마지막 '}' 구간만 추출해 파싱.
 */
function parseAgentJson(raw: string): AgentPayload | null {
  const candidates: string[] = [];
  const trimmed = raw.trim();
  candidates.push(trimmed);
  candidates.push(trimmed.replace(/```json|```/g, '').trim());
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    candidates.push(trimmed.slice(firstBrace, lastBrace + 1));
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      const dishes = Array.isArray(parsed.dishes) ? parsed.dishes : [];
      const ingredients = Array.isArray(parsed.ingredients) ? parsed.ingredients : [];
      const validDishes = dishes.every(
        (d: unknown): d is AgentDish =>
          typeof d === 'object' &&
          d !== null &&
          typeof (d as AgentDish).name === 'string' &&
          typeof (d as AgentDish).reason === 'string'
      );
      const validIngredients = ingredients.every(
        (d: unknown): d is AgentIngredient =>
          typeof d === 'object' &&
          d !== null &&
          typeof (d as AgentIngredient).name === 'string' &&
          typeof (d as AgentIngredient).reason === 'string'
      );
      if (typeof parsed.reply === 'string' && validDishes && validIngredients) {
        const ingredientList = Array.isArray(parsed.ingredientList)
          ? parsed.ingredientList.filter((s: unknown): s is string => typeof s === 'string')
          : undefined;
        return { reply: parsed.reply, dishes, ingredients, ingredientList };
      }
    } catch {
      continue;
    }
  }

  // 완전한 JSON으로는 파싱이 안 됐지만(응답이 잘렸을 가능성), reply 필드 문자열만이라도 구제한다.
  const salvaged = salvageReplyText(trimmed);
  if (salvaged) {
    return { reply: salvaged, dishes: [], ingredients: [] };
  }

  return null;
}

export async function POST(request: NextRequest) {
  if (!apiKey) {
    return NextResponse.json(
      { error: '소담이가 아직 준비되지 않았어요. (GEMINI_API_KEY 미설정)' },
      { status: 503 }
    );
  }

  try {
    const { message, history } = (await request.json()) as {
      message: string;
      history?: ChatTurn[];
    };
    const trimmed = (message ?? '').trim();
    if (!trimmed) {
      return NextResponse.json({ error: '무엇이 궁금하신지 알려주세요.' }, { status: 400 });
    }

    const isFirstTurn = !history || history.length === 0;
    const user = getUserFromRequest(request);
    const userTopIngredient = user ? await getUserTopIngredient(user.userId) : null;

    const systemInstruction = `${SODAMI_TEXT_PERSONA_PROMPT}

당신은 대한민국 최고의 셰프이자 요리 전문가이자 요리 강사인 '소담이'입니다. 어떤 요리를 묻더라도 자신 있고 정확하게, 실제로 따라할 수 있는 수준으로 답합니다. 사이트에 없는 낯설거나 외국 요리를 물어봐도 절대 모른다고 하거나 답을 회피하지 말고, 셰프로서의 지식으로 성실하게 설명하세요.

당신은 이 사용자를 계속 챙겨주는 개인 요리 트레이너이기도 합니다. 한 번 답하고 끝나는 것이 아니라, 이 사람이 요리를 더 잘하게 되도록 곁에서 꾸준히 도와준다는 마음으로 대하세요.
${userTopIngredient ? `이 사용자는 최근 '${userTopIngredient}' 재료에 관심이 많았어요(즐겨찾기·조회 기록 기반). 자연스러운 순간에만 살짝 참고하고, 매번 억지로 언급하지는 마세요.` : ''}

지금 사용자는 시절소담 홈 화면 맨 위, 구글 검색창처럼 크게 자리한 대화형 입력창에서 소담이와 대화하고 있습니다. 사용자는 냉장고에 있는 재료, 오늘 기분, 상황(손님 초대, 다이어트, 자취생 한 끼 등), 또는 특정 요리의 조리법을 무엇이든 자유롭게 입력할 수 있고, 대화는 여러 턴 이어질 수 있습니다.

당신의 역할 — 대화가 끝까지 이어지도록 안내하세요:
1. 첫 메시지가 막연하면(예: "저녁 뭐 먹지") 재료나 인원, 기분 등을 1가지만 짧게 되물어 좁혀도 됩니다. 이 경우 dishes와 ingredients는 빈 배열로 두어도 괜찮습니다.
2. 구체적인 정보가 있으면(재료, 상황, 이전 대화 맥락 등) 실제로 집에서 만들 수 있는 요리를 2~4개 자유롭게 제안하세요. 사이트에 있는 레시피로 한정하지 말고, 소담이의 지식으로 가장 적절하다고 생각하는 요리를 자신 있게 제안하세요.
3. 사용자가 재료 자체에 대해 묻거나(예: "제철 재료 추천해줘", "지금 뭐가 맛있어?") 요리와 별개로 특정 식재료를 짚어주면 좋은 상황이면 ingredients에 식재료명을 제안하세요.
4. 사용자가 특정 요리의 조리법을 직접 물으면(예: "제육볶음 어떻게 만들어?", "~ 레시피 알려줘", "더 자세히 알려줘") 실제로 따라 만들 수 있도록 답하세요. 이때 아래 세 부분을 반드시 분리해서 채우세요.
   - reply: 재료 목록은 절대 reply 안에 넣지 마세요. reply에는 오직 (a) 짧은 소개 문장 1~2개와 (b) "1. ...", "2. ...", "3. ..." 형태의 번호 매긴 조리 단계만 담으세요. 각 단계는 반드시 줄바꿈(\n)으로 구분해 한 줄에 하나씩 쓰고, 절대 여러 단계를 한 문단에 이어붙이지 마세요. 핵심 과정은 4~7단계로 간결하게 설명하세요.
   - ingredientList: 재료 목록은 오직 이 배열에만 담으세요. 각 항목은 "이름 수량" 형태의 짧은 문자열 하나로 씁니다(예: "돼지고기 다짐육 300g", "두부 1/4모"). 소스나 양념 재료도 모두 이 배열 안에 개별 항목으로 넣으세요. 배열이 아닌 문장으로 풀어 쓰지 마세요.
   - dishes: 해당 요리 이름을 하나 넣어, 사이트에 더 자세한 사진과 팁이 있는 레시피가 있는지 함께 찾아볼 수 있게 하세요.
   조리법을 묻는 게 아닌 일반적인 대화(추천, 잡담 등)에서는 ingredientList를 비워두세요.
   - 계량은 "적당히", "약간" 같은 애매한 표현 대신 항상 구체적인 수치로 쓰세요. 예: "간장 약간"이 아니라 "간장 1큰술", "고춧가루 조금"이 아니라 "고춧가루 1.5큰술", "물 적당량"이 아니라 "물 2컵". 숟가락 단위는 큰술/작은술로, 그 외엔 g, ml, 컵, 개 등 실제 요리할 때 계량할 수 있는 단위를 쓰세요.
   - 타이밍도 구체적으로 짚으세요. "볶는다"로 끝내지 말고 "중불에서 2분간 볶는다", "고기 겉면이 갈색이 되면 양파를 넣는다"처럼 몇 분인지, 무엇이 어떤 상태가 됐을 때 다음 재료를 넣는지, 불 세기는 어느 정도인지까지 알려주세요. 재료를 넣는 순서가 맛을 좌우하는 경우(예: 마늘을 먼저 볶아 향을 낸 뒤 고기를 넣는다) 그 이유도 짧게 덧붙이세요.
5. 각 요리/재료 제안에는 왜 지금 좋은지 1문장 이내의 다정한 이유를 붙이세요.
6. 요리 이름은 검색에 쓰이므로 재료명을 포함한 명확한 한글 이름으로 쓰세요 (예: "애호박 두부 된장찌개"). 재료 이름도 일반적인 한글 명칭으로 쓰세요 (예: "애호박", "표고버섯"). 브랜드명이나 지나치게 창작적인 이름은 피하세요.
7. 대화의 이전 맥락을 항상 기억하고 자연스럽게 이어가세요. 같은 제안을 반복하지 마세요.
${isFirstTurn ? `8. 지금이 이 대화의 첫 메시지입니다. reply의 맨 끝에 한 문장으로 "저는 제철 식재료를 중심으로 다양한 요리를 알려드리는 것을 목표로 하고 있어요" 같은 취지를 자연스럽게, 딱딱하지 않게 덧붙이세요. 답변 자체를 방해하지 않을 만큼 짧게만 넣으세요.` : ''}

반드시 유효한 JSON으로만 응답하세요. dishes나 ingredients가 없으면 빈 배열 []로 두세요.`;

    const historyContents = (history ?? []).slice(-12).map((turn) => ({
      role: turn.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: turn.content }],
    }));

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [...historyContents, { role: 'user', parts: [{ text: trimmed }] }],
      config: {
        systemInstruction,
        maxOutputTokens: 3000,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const rawText = response.text || '';
    const payload = parseAgentJson(rawText);

    // JSON 파싱에 실패해도 사용자에게 원본 JSON 텍스트를 그대로 보여주지 않는다.
    // parseAgentJson이 이미 reply 필드만 구제하는 시도까지 마쳤으므로,
    // 그래도 실패했다면(완전히 형식을 벗어난 응답) 안내 문구로 대체한다.
    const finalReply =
      payload?.reply?.trim() ||
      '지금은 답변을 정리하는 데 시간이 좀 걸리네요. 조금만 더 구체적으로 다시 물어봐주실 수 있을까요?';
    const finalDishes = payload?.dishes ?? [];
    const finalIngredients = payload?.ingredients ?? [];

    const dishesWithLinks = finalDishes.slice(0, 4).map((dish) => {
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

    const ingredientsWithLinks = finalIngredients.slice(0, 4).map((item) => {
      const matched = findMatchingIngredient(item.name);
      return {
        name: item.name,
        reason: item.reason,
        ingredient: matched
          ? {
              name: matched.name,
              emoji: matched.emoji,
              imageUrl: matched.imageUrl,
            }
          : null,
      };
    });

    // 로그인한 유저라면 이 대화를 기록해서, 다음에 홈 화면/AI 답변이 이 사람에게 더 맞게 조정되도록 한다.
    if (user) {
      // 매칭된 요리의 주재료(레시피 mainIngredient) 또는 매칭된 재료명을 우선순위로 사용
      const matchedRecipe = finalDishes.map((d) => findMatchingRecipe(d.name)).find(Boolean);
      const matchedIngredientName =
        matchedRecipe?.mainIngredient ??
        finalIngredients.map((i) => findMatchingIngredient(i.name)).find(Boolean)?.name ??
        null;

      sql`
        INSERT INTO agent_queries (user_id, message, reply, matched_ingredient)
        VALUES (${user.userId}, ${trimmed.slice(0, 500)}, ${finalReply.slice(0, 3000)}, ${matchedIngredientName})
      `.catch((err) => console.error('Log agent query error:', err));
    }

    return NextResponse.json({
      reply: finalReply,
      dishes: dishesWithLinks,
      ingredients: ingredientsWithLinks,
      ingredientList: payload?.ingredientList ?? [],
    });
  } catch (error) {
    console.error('Ingredient agent error:', error);
    return NextResponse.json(
      { error: '소담이가 잠시 답변하기 어려워요. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}

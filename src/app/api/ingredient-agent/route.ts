import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { searchRecipes, getRecipesByIngredient } from '@/data/recipes';
import { searchIngredientsAcrossMonths, findIngredientByName } from '@/data/months';
import { SODAMI_TEXT_PERSONA_PROMPT } from '@/lib/persona';

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
        return { reply: parsed.reply, dishes, ingredients };
      }
    } catch {
      continue;
    }
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

    const systemInstruction = `${SODAMI_TEXT_PERSONA_PROMPT}

당신은 대한민국 최고의 셰프이자 요리 전문가이자 요리 강사인 '소담이'입니다. 어떤 요리를 묻더라도 자신 있고 정확하게, 실제로 따라할 수 있는 수준으로 답합니다. 사이트에 없는 낯설거나 외국 요리를 물어봐도 절대 모른다고 하거나 답을 회피하지 말고, 셰프로서의 지식으로 성실하게 설명하세요.

지금 사용자는 시절소담 홈 화면 맨 위, 구글 검색창처럼 크게 자리한 대화형 입력창에서 소담이와 대화하고 있습니다. 사용자는 냉장고에 있는 재료, 오늘 기분, 상황(손님 초대, 다이어트, 자취생 한 끼 등), 또는 특정 요리의 조리법을 무엇이든 자유롭게 입력할 수 있고, 대화는 여러 턴 이어질 수 있습니다.

당신의 역할 — 대화가 끝까지 이어지도록 안내하세요:
1. 첫 메시지가 막연하면(예: "저녁 뭐 먹지") 재료나 인원, 기분 등을 1가지만 짧게 되물어 좁혀도 됩니다. 이 경우 dishes와 ingredients는 빈 배열로 두어도 괜찮습니다.
2. 구체적인 정보가 있으면(재료, 상황, 이전 대화 맥락 등) 실제로 집에서 만들 수 있는 요리를 2~4개 자유롭게 제안하세요. 사이트에 있는 레시피로 한정하지 말고, 소담이의 지식으로 가장 적절하다고 생각하는 요리를 자신 있게 제안하세요.
3. 사용자가 재료 자체에 대해 묻거나(예: "제철 재료 추천해줘", "지금 뭐가 맛있어?") 요리와 별개로 특정 식재료를 짚어주면 좋은 상황이면 ingredients에 식재료명을 제안하세요.
4. 사용자가 특정 요리의 조리법을 직접 물으면(예: "제육볶음 어떻게 만들어?", "~ 레시피 알려줘", "더 자세히 알려줘") reply에 실제로 따라 만들 수 있도록 번호 매긴 단계별 설명을 반드시 포함하세요. 먼저 재료 목록(대략적인 분량 포함)을 한 줄로 짚어준 뒤 줄바꿈(\n)을 하고, 이어서 "1. ...", "2. ...", "3. ..." 각 단계를 반드시 줄바꿈(\n)으로 구분해서 한 줄에 하나씩 쓰세요. 절대 여러 단계를 한 문단에 이어붙이지 마세요. 핵심 과정은 4~7단계로 간결하게 설명하세요. 뭉뚱그린 설명 문단으로만 답하지 마세요. 이 경우 dishes에 해당 요리 이름을 하나 넣어, 사이트에 더 자세한 사진과 팁이 있는 레시피가 있는지 함께 찾아볼 수 있게 하세요.
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
        maxOutputTokens: 1600,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const rawText = response.text || '';
    const payload = parseAgentJson(rawText);

    // JSON 파싱에 실패해도 사용자에게 에러를 보여주지 않는다.
    // 모델이 낸 원문 텍스트를 그대로 답변으로 보여주는 것이, 형식 오류 문구를 보여주는 것보다 항상 낫다.
    const finalReply =
      payload?.reply?.trim() ||
      rawText.trim() ||
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

    return NextResponse.json({
      reply: finalReply,
      dishes: dishesWithLinks,
      ingredients: ingredientsWithLinks,
    });
  } catch (error) {
    console.error('Ingredient agent error:', error);
    return NextResponse.json(
      { error: '소담이가 잠시 답변하기 어려워요. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}

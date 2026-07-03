import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
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

  // 역방향: 재료명이 더 길 수 있으니(예: "애호박"이 "호박"을 포함) 짧은 키워드로도 시도
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

function parseAgentJson(raw: string): AgentPayload | null {
  const cleaned = raw.replace(/```json|```/g, '').trim();
  try {
    const parsed = JSON.parse(cleaned);
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
    const { message, history } = (await request.json()) as {
      message: string;
      history?: ChatTurn[];
    };
    const trimmed = (message ?? '').trim();
    if (!trimmed) {
      return NextResponse.json({ error: '무엇이 궁금하신지 알려주세요.' }, { status: 400 });
    }

    const systemInstruction = `${SODAMI_TEXT_PERSONA_PROMPT}

지금 사용자는 시절소담 홈 화면 맨 위, 구글 검색창처럼 크게 자리한 대화형 입력창에서 소담이와 대화하고 있습니다. 사용자는 냉장고에 있는 재료, 오늘 기분, 상황(손님 초대, 다이어트, 자취생 한 끼 등) 등 무엇이든 자유롭게 입력할 수 있고, 대화는 여러 턴 이어질 수 있습니다.

당신의 역할 — 대화가 끝까지 이어지도록 안내하세요:
1. 첫 메시지가 막연하면(예: "저녁 뭐 먹지") 재료나 인원, 기분 등을 1가지만 짧게 되물어 좁혀도 됩니다. 이 경우 dishes와 ingredients는 빈 배열로 두어도 괜찮습니다.
2. 구체적인 정보가 있으면(재료, 상황, 이전 대화 맥락 등) 실제로 집에서 만들 수 있는 요리를 2~4개 자유롭게 제안하세요. 사이트에 있는 레시피로 한정하지 말고, 소담이의 지식으로 가장 적절하다고 생각하는 요리를 자신 있게 제안하세요.
3. 사용자가 재료 자체에 대해 묻거나(예: "제철 재료 추천해줘", "지금 뭐가 맛있어?") 요리와 별개로 특정 식재료를 짚어주면 좋은 상황이면 ingredients에 식재료명을 제안하세요.
4. 사용자가 특정 요리를 고르거나 "그걸로 할래", "그거 어떻게 만들어?" 등으로 반응하면, 그 요리에 대해 조금 더 설명하거나 손질·조리 팁을 한두 가지 다정하게 짚어주고, 레시피 페이지로 넘어가 자세히 보라고 자연스럽게 안내하세요.
5. 각 요리/재료 제안에는 왜 지금 좋은지 1문장 이내의 다정한 이유를 붙이세요.
6. 요리 이름은 검색에 쓰이므로 재료명을 포함한 명확한 한글 이름으로 쓰세요 (예: "애호박 두부 된장찌개"). 재료 이름도 일반적인 한글 명칭으로 쓰세요 (예: "애호박", "표고버섯"). 브랜드명이나 지나치게 창작적인 이름은 피하세요.
7. 대화의 이전 맥락을 항상 기억하고 자연스럽게 이어가세요. 같은 제안을 반복하지 마세요.

반드시 아래 JSON 형식으로만 응답하세요. 다른 설명, 마크다운, 코드블록 표시 없이 순수 JSON 텍스트만 출력하세요:
{
  "reply": "사용자에게 건네는 다정한 답변 (질문에 대한 답, 되묻는 질문, 또는 요리 소개 등)",
  "dishes": [
    { "name": "요리 이름", "reason": "이 요리를 제안하는 짧은 이유" }
  ],
  "ingredients": [
    { "name": "재료 이름", "reason": "이 재료를 제안하는 짧은 이유" }
  ]
}
dishes나 ingredients가 없으면 빈 배열 []로 두세요.`;

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
        maxOutputTokens: 900,
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

    const ingredientsWithLinks = payload.ingredients.slice(0, 4).map((item) => {
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
      reply: payload.reply,
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

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getRecipeById } from '@/data/recipes';
import { SODAMI_TEXT_PERSONA_PROMPT } from '@/lib/persona';

const apiKey = process.env.GEMINI_API_KEY;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI 코치가 아직 준비되지 않았어요. (GEMINI_API_KEY 미설정)' },
      { status: 503 }
    );
  }

  try {
    const { recipeId, currentStepIndex, servings, messages } = (await request.json()) as {
      recipeId: string;
      currentStepIndex: number;
      servings?: number;
      messages: ChatMessage[];
    };

    const recipe = getRecipeById(recipeId);
    if (!recipe) {
      return NextResponse.json({ error: '레시피를 찾을 수 없어요.' }, { status: 404 });
    }

    const stepsText = recipe.steps
      .map(
        (s, i) =>
          `${i + 1}단계. ${s.title}: ${s.description}${s.tip ? ` (tip: ${s.tip})` : ''}`
      )
      .join('\n');

    const ingredientsText = recipe.ingredients
      .map((ing) => `- ${ing.name}: ${ing.amount}`)
      .join('\n');

    const currentStepLabel =
      typeof currentStepIndex === 'number' && recipe.steps[currentStepIndex]
        ? `${currentStepIndex + 1}단계 (${recipe.steps[currentStepIndex].title})`
        : '알 수 없음';

    const effectiveServings = servings || recipe.servings;
    const scaleNote =
      effectiveServings !== recipe.servings
        ? `사용자는 기본 ${recipe.servings}인분 레시피를 ${effectiveServings}인분으로 조절해서 보고 있습니다. 재료 양을 언급할 때는 ${effectiveServings}인분 기준으로 환산해서 답하세요 (기본 인분 대비 ${(effectiveServings / recipe.servings).toFixed(2)}배).`
        : '';

    const systemInstruction = `${SODAMI_TEXT_PERSONA_PROMPT}

지금 사용자가 요리 중이며, 손에 양념이 묻어 화면을 보기 힘든 상황일 수 있습니다. 그러니 답변은 항상 짧고 명확하게, 입으로 듣기 편한 1~3문장으로 해주세요.

지금 사용자가 만들고 있는 레시피 정보:

제목: ${recipe.title}
기본 인분: ${recipe.servings}인분
난이도: ${recipe.difficulty}

재료:
${ingredientsText}

조리 단계:
${stepsText}

사용자가 현재 보고 있는 단계: ${currentStepLabel}
${scaleNote}

규칙:
- 이 레시피와 무관한 질문(다른 요리, 일반 상식 등)이 와도 친절하게 답하되, 가능하면 이 레시피의 맥락으로 자연스럽게 연결하세요.
- "다음 단계 알려줘" 같은 질문에는 사용자가 보고 있는 단계의 다음 단계 내용을 알려주세요.
- "이 단계 자세히 알려줘"처럼 단계 전체를 물으면, 레시피에 적힌 설명을 그대로 반복하지 말고 실제로 손을 움직이는 사람에게 도움이 되도록 풀어서 설명하세요: 정확히 몇 분/몇 초인지, 불 세기는 어느 정도인지, 무엇이 어떤 색/질감/상태가 됐을 때 다음으로 넘어가는지, 이 단계에서 사람들이 흔히 실수하는 부분은 무엇인지까지 짚어주세요.
- 정확한 재료 양, 시간, 온도는 위 레시피 정보를 근거로만 답하고, 모르는 정보는 추측해서 단정적으로 말하지 마세요.
- 계량이나 타이밍을 물으면("소금 얼마나 넣어?", "언제 넣어?", "얼마나 볶아?") 절대 "적당히", "알아서" 식으로 얼버무리지 말고, 레시피에 있는 정확한 수치(큰술/작은술/g/ml/분)와 "무엇이 어떤 상태가 됐을 때"까지 구체적으로 답하세요. 레시피에 정확한 수치가 없는 세부 질문이면, 비슷한 요리에서 일반적으로 쓰이는 수치를 자신 있게 제안하되 "레시피에는 없지만" 이라고 짧게 밝히세요.
- "에어프라이어 대신 프라이팬으로 하려면?", "오븐 없는데 어떻게 해?" 같은 조리도구 대체 질문에는, 이 레시피의 조리 원리(굽기/찌기/끓이기 등)를 유지하면서 일반적으로 알려진 대체 방법을 안내하세요. 다만 정확한 대체 시간·온도는 "비슷하게 익었는지 확인하며 조절하세요" 정도로 안내하고, 존재하지 않는 정밀한 수치를 단정적으로 만들어내지 마세요.
- 여러 단계나 순서를 안내해야 할 때는 "1. ...", "2. ..." 처럼 번호를 매기고 각 단계를 줄바꿈(\n)으로 구분하세요. 한 문단에 여러 단계를 이어붙이지 마세요.
- 존댓말을 쓰되 다정하고 짧게, 마치 옆에서 봐주는 사람처럼 답하세요.
- 답변은 항상 끝까지 완결된 문장으로 마무리하세요. 문장을 중간에 끊지 마세요.`;

    const ai = new GoogleGenAI({ apiKey });

    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        maxOutputTokens: 1000,
        temperature: 0.6,
      },
    });

    const text = response.text || '죄송해요, 답변을 만들지 못했어요. 다시 한 번 물어봐주세요.';

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: '소담이가 잠시 답변하기 어려워요. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}

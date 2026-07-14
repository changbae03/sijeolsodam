import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

/**
 * 주어진 텍스트를 768차원 임베딩 벡터로 변환한다.
 * 실패하거나 API 키가 없으면 null을 반환한다 — 임베딩은 초개인화를 위한
 * 부가 기능이므로, 실패했다고 해서 대화 자체가 막히면 안 된다.
 */
export async function embedText(text: string): Promise<number[] | null> {
  const trimmed = text.trim();
  if (!apiKey || !trimmed) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: trimmed,
    });
    const values = response.embeddings?.[0]?.values;
    return values && values.length > 0 ? values : null;
  } catch (error) {
    console.error('embedText error:', error);
    return null;
  }
}

/** pgvector에 넘길 수 있는 '[0.1,0.2,...]' 형태의 리터럴 문자열로 변환 */
export function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(',')}]`;
}

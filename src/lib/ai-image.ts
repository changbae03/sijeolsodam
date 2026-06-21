import { GoogleGenAI } from '@google/genai';
import { put } from '@vercel/blob';

const apiKey = process.env.GEMINI_API_KEY;

/**
 * 텍스트 프롬프트로 이미지를 생성해 base64 PNG 버퍼로 반환합니다.
 * 실패 시(모델이 이미지를 반환하지 않은 경우 등) null을 반환합니다.
 */
export async function generateImage(prompt: string): Promise<Buffer | null> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: prompt,
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      return Buffer.from(part.inlineData.data, 'base64');
    }
  }

  return null;
}

/**
 * 생성된 이미지를 Vercel Blob에 업로드하고 공개 URL을 반환합니다.
 */
export async function uploadImageToBlob(
  buffer: Buffer,
  pathname: string
): Promise<string> {
  const blob = await put(pathname, buffer, {
    access: 'public',
    contentType: 'image/png',
    addRandomSuffix: false,
  });
  return blob.url;
}

/**
 * 프롬프트로 이미지를 생성하고 즉시 Blob에 업로드까지 처리하는 헬퍼.
 */
export async function generateAndUploadImage(
  prompt: string,
  pathname: string
): Promise<string | null> {
  const buffer = await generateImage(prompt);
  if (!buffer) return null;
  return uploadImageToBlob(buffer, pathname);
}

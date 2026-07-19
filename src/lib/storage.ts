/**
 * 사용자 업로드 이미지 저장소.
 *
 * 레시피·식재료 사진은 빌드 시점에 확정되므로 레포 정적 파일로 서빙하지만,
 * 커뮤니티 사진처럼 런타임에 생기는 파일은 외부 저장소가 필요하다.
 *
 * 우선순위:
 *  1) Cloudflare R2 (S3 호환) — R2_* 환경변수가 모두 있으면 사용.
 *     무료 티어에서 저장 10GB, 전송 무료, 쓰기 월 100만 회라 Hobby Blob(월 2,000회,
 *     한도 초과 시 스토어 정지)보다 이 용도에 훨씬 안전하다.
 *  2) Vercel Blob — R2 설정이 없을 때의 폴백.
 *
 * 필요한 환경변수 (R2 사용 시):
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_BASE_URL
 *   (R2_PUBLIC_BASE_URL은 버킷의 공개 URL. 예: https://pub-xxxx.r2.dev)
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { put } from '@vercel/blob';

const R2 = {
  accountId: process.env.R2_ACCOUNT_ID,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  bucket: process.env.R2_BUCKET,
  publicBaseUrl: process.env.R2_PUBLIC_BASE_URL,
};

export function isR2Configured(): boolean {
  return Boolean(
    R2.accountId && R2.accessKeyId && R2.secretAccessKey && R2.bucket && R2.publicBaseUrl
  );
}

let client: S3Client | null = null;
function getClient(): S3Client {
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${R2.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2.accessKeyId!,
        secretAccessKey: R2.secretAccessKey!,
      },
    });
  }
  return client;
}

/**
 * 공개 이미지를 업로드하고 접근 가능한 URL을 돌려준다.
 * 저장소 선택은 환경변수로 결정되며 호출부는 알 필요가 없다.
 */
export async function uploadPublicImage(
  file: File,
  pathname: string
): Promise<{ url: string; provider: 'r2' | 'blob' }> {
  if (isR2Configured()) {
    const buffer = Buffer.from(await file.arrayBuffer());
    await getClient().send(
      new PutObjectCommand({
        Bucket: R2.bucket!,
        Key: pathname,
        Body: buffer,
        ContentType: file.type,
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );
    const base = R2.publicBaseUrl!.replace(/\/$/, '');
    return { url: `${base}/${pathname}`, provider: 'r2' };
  }

  const blob = await put(pathname, file, {
    access: 'public',
    contentType: file.type,
    addRandomSuffix: true,
  });
  return { url: blob.url, provider: 'blob' };
}

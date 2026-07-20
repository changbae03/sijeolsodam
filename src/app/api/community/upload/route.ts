import { NextRequest, NextResponse } from 'next/server';
import { uploadPublicImage } from '@/lib/storage';
import { getUserFromRequest } from '@/lib/auth';

const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
// 숏폼 동영상 — 폰이 기본으로 뱉는 포맷들
const ALLOWED_VIDEO_TYPES = new Set(['video/mp4', 'video/quicktime', 'video/webm']);
const MAX_VIDEO_BYTES = 60 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: '사진 파일을 찾을 수 없어요.' }, { status: 400 });
    }
    const isVideo = ALLOWED_VIDEO_TYPES.has(file.type);
    if (!ALLOWED_IMAGE_TYPES.has(file.type) && !isVideo) {
      return NextResponse.json(
        { error: '사진(jpg·png·webp·gif) 또는 동영상(mp4·mov·webm)만 올릴 수 있어요.' },
        { status: 400 }
      );
    }
    if (file.size > (isVideo ? MAX_VIDEO_BYTES : MAX_SIZE_BYTES)) {
      return NextResponse.json(
        { error: isVideo ? '동영상은 60MB 이내로 올려주세요.' : '사진 용량은 8MB 이내로 올려주세요.' },
        { status: 400 }
      );
    }

    const ext = file.type.split('/')[1];
    // 파일명 충돌 방지 (R2는 addRandomSuffix가 없으므로 직접 난수를 붙인다)
    const rand = Math.random().toString(36).slice(2, 8);
    const pathname = `community/${user.userId}-${Date.now()}-${rand}.${ext}`;

    const { url } = await uploadPublicImage(file, pathname);
    return NextResponse.json({ url, mediaType: isVideo ? 'video' : 'image' });
  } catch (error) {
    console.error('Community upload error:', error);
    return NextResponse.json({ error: '사진을 올리지 못했어요. 잠시 후 다시 시도해주세요.' }, { status: 500 });
  }
}

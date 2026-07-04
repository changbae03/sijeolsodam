import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getUserFromRequest } from '@/lib/auth';

const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

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
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'jpg, png, webp, gif 파일만 올릴 수 있어요.' }, { status: 400 });
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: '사진 용량은 8MB 이내로 올려주세요.' }, { status: 400 });
    }

    const ext = file.type.split('/')[1];
    const pathname = `community/${user.userId}-${Date.now()}.${ext}`;

    const blob = await put(pathname, file, {
      access: 'public',
      contentType: file.type,
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Community upload error:', error);
    return NextResponse.json({ error: '사진을 올리지 못했어요. 잠시 후 다시 시도해주세요.' }, { status: 500 });
  }
}

import { neon } from '@neondatabase/serverless';

// Vercel/Neon 환경 변수: DATABASE_URL
// 로컬 개발 시 .env.local 파일에 DATABASE_URL을 설정해주세요.
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn(
    '[sijeolsodam] DATABASE_URL 환경변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.'
  );
}

export const sql = neon(databaseUrl || 'postgresql://placeholder:placeholder@localhost/placeholder');

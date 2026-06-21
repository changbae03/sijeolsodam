# 시절소담 (Sijeol Sodam)

절기를 따라 가장 맛있는 때의 식재료로 차리는 집밥 레시피 웹앱입니다.

## 기술 스택
- Next.js (App Router, TypeScript, Tailwind CSS)
- Neon PostgreSQL (사용자 인증, 즐겨찾기 저장)
- Vercel (배포)

## 로컬에서 실행하기

```bash
npm install
npm run dev
```

`.env.local` 파일에 아래 값을 채워야 로그인/즐겨찾기 기능이 동작합니다 (`.env.example` 참고).

```
DATABASE_URL=
JWT_SECRET=
GEMINI_API_KEY=
KAMIS_CERT_KEY=
KAMIS_CERT_ID=
```

## 제철 가격 소식 (KAMIS) 품목코드 확인

`src/lib/kamis-mapping.ts`에 있는 `itemCategoryCode`, `itemCode`, `kindCode` 값은 KAMIS Open-API 명세서의 품목코드 표를 보고 실제 값으로 확인/수정해야 합니다. (KAMIS 고객센터 > Open-API > Open-API 이용안내 페이지에서 확인 가능)

## AI 셰프 노트(체크포인트) 생성 (선택, 1회 실행)

각 조리 단계 밑에 "이 정도면 잘 되고 있는 거예요" 같은 짧은 체크포인트 문구를 AI로 미리 생성해 넣을 수 있습니다. 매번 사용자가 볼 때 AI를 부르는 게 아니라, 한 번 생성해서 데이터 파일에 저장하는 방식이라 비용이 거의 들지 않습니다.

```bash
npm install -D tsx
GEMINI_API_KEY=발급받은키 npx tsx scripts/generate-checkpoints.ts
```

실행 후 `git diff`로 `src/data/recipes-q1.ts` 등의 변경 내용을 꼭 확인하세요. 이미 체크포인트가 있는 단계는 건너뛰므로 여러 번 실행해도 안전합니다.

## AI 레시피 이미지 생성 (선택)

레시피 완성샷과 단계별 사진을 AI(Gemini 이미지 생성)로 만들어 Vercel Blob에 저장할 수 있습니다.

**먼저 Vercel에서 Blob 저장소를 만들어야 합니다.** 프로젝트 > Storage > Connect Store > Blob 선택 후 프로젝트에 연결하면 `BLOB_READ_WRITE_TOKEN`이 자동으로 환경변수에 채워집니다. 이 토큰 값을 복사해서 로컬에서도 사용하세요.

```bash
npm install -D tsx

# 안전을 위해 먼저 레시피 1개만 테스트 (완성샷만)
GEMINI_API_KEY=키 BLOB_READ_WRITE_TOKEN=토큰 npx tsx scripts/generate-images.ts --recipe=1-1 --hero-only

# 결과가 마음에 들면, 같은 레시피로 단계별 이미지까지
GEMINI_API_KEY=키 BLOB_READ_WRITE_TOKEN=토큰 npx tsx scripts/generate-images.ts --recipe=1-1

# 전체 60개 레시피 실행 (시간이 오래 걸리고 비용이 발생하니 1개 테스트 후 진행하세요)
GEMINI_API_KEY=키 BLOB_READ_WRITE_TOKEN=토큰 npx tsx scripts/generate-images.ts --all
```

이미 Blob에 업로드된 이미지가 있는 항목은 건너뛰므로 중간에 끊겨도 다시 실행하면 이어서 처리됩니다. 실행 후 `git diff`로 결과를 확인하세요.

## 제철 식재료 상세 정보 생성 (선택)

홈 화면에서 식재료 카드를 누르면 나오는 상세 정보(영양, 고르는 법, 손질·보관 팁, 어울리는 조리법)를 AI로 생성할 수 있습니다.

```bash
GEMINI_API_KEY=키 npx tsx scripts/generate-ingredient-details.ts
```

84개(12개월 × 7개) 식재료를 순서대로 처리합니다. 이미 정보가 채워진 식재료는 건너뜁니다. 실행 후 `git diff src/data/months.ts`로 결과를 확인하세요.

## 데이터베이스 테이블 생성

Neon SQL Editor에서 `src/lib/schema.sql` 파일의 내용을 한 번 실행해주세요. `users`, `favorites` 두 테이블이 생성됩니다.

## 배포 (Vercel)

1. 이 저장소를 GitHub에 올립니다.
2. Vercel에서 새 프로젝트로 가져옵니다 (Import).
3. Storage 탭에서 Neon Postgres를 연결하면 `DATABASE_URL`이 자동으로 설정됩니다.
4. Settings → Environment Variables에서 `JWT_SECRET`을 직접 추가합니다 (임의의 긴 문자열).
5. Deploy를 누르면 끝입니다.

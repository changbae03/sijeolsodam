# /shop — 현재 비활성화

커뮤니티 성장에 집중하기 위해 커머스(장보기) 페이지를 노출하지 않습니다.

- 구현은 `page.disabled.tsx`에 그대로 보존되어 있습니다. (파일명이 `page.tsx`가
  아니므로 Next.js가 라우트로 인식하지 않아 `/shop` 접근 시 404)
- 되살리는 법:
  1. `page.disabled.tsx` -> `page.tsx` 로 이름 변경
  2. `src/app/ingredient/[name]/page.tsx` 하단의 주석 처리된 고정 CTA 블록 복구

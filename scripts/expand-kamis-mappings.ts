/**
 * KAMIS 매핑 확장 스크립트 — 후보 품목코드를 실제 API로 검증해 자동 등록.
 *
 * 원칙: 잘못된 코드는 엉뚱한 품목의 시세를 진짜처럼 보여주는 최악의 버그가 되므로,
 * (1) 최근 30일 데이터가 실제로 오고 (2) 응답의 itemname이 기대 품목명을 포함할 때만
 * src/lib/kamis-mapping.ts에 추가한다. 품종(kind) 코드는 후보를 여러 개 두고 순서대로 시도.
 *
 * 사용법 (로컬, KAMIS 인증키 필요):
 *   KAMIS_CERT_KEY=키 KAMIS_CERT_ID=아이디 npx tsx scripts/expand-kamis-mappings.ts           (검증만, 파일 수정 없음)
 *   KAMIS_CERT_KEY=키 KAMIS_CERT_ID=아이디 npx tsx scripts/expand-kamis-mappings.ts --write   (검증 통과분을 매핑 파일에 추가)
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MAPPING_PATH = join(__dirname, '..', 'src', 'lib', 'kamis-mapping.ts');

const certKey = process.env.KAMIS_CERT_KEY;
const certId = process.env.KAMIS_CERT_ID;
if (!certKey || !certId) {
  console.error('KAMIS_CERT_KEY / KAMIS_CERT_ID 환경변수가 필요합니다.');
  process.exit(1);
}
const doWrite = process.argv.includes('--write');

interface Candidate {
  /** 우리 데이터의 식재료 이름 (매핑 displayName으로 사용) */
  displayName: string;
  /** 응답 itemname에 반드시 포함되어야 하는 문자열 (오코드 방어) */
  expect: string;
  itemCategoryCode: string;
  itemCode: string;
  /** 순서대로 시도할 품종 코드 후보 */
  kindCodes: string[];
  relatedMonths: number[];
  aliases?: string[];
}

// 코드값은 KAMIS 공식 코드표 기준 후보 — 전부 아래 검증을 통과해야만 등록됨.
const CANDIDATES: Candidate[] = [
  // ── 채소 (200) ──
  { displayName: '시금치', expect: '시금치', itemCategoryCode: '200', itemCode: '213', kindCodes: ['00', '01'], relatedMonths: [1, 2, 12] },
  { displayName: '상추', expect: '상추', itemCategoryCode: '200', itemCode: '214', kindCodes: ['00', '01', '02'], relatedMonths: [5] },
  { displayName: '수박', expect: '수박', itemCategoryCode: '200', itemCode: '221', kindCodes: ['00', '01'], relatedMonths: [7] },
  { displayName: '참외', expect: '참외', itemCategoryCode: '200', itemCode: '222', kindCodes: ['00', '01'], relatedMonths: [6] },
  { displayName: '애호박', expect: '호박', itemCategoryCode: '200', itemCode: '224', kindCodes: ['01', '00', '02'], relatedMonths: [7] },
  { displayName: '토마토', expect: '토마토', itemCategoryCode: '200', itemCode: '225', kindCodes: ['00', '01'], relatedMonths: [6], aliases: ['완숙토마토'] },
  { displayName: '당근', expect: '당근', itemCategoryCode: '200', itemCode: '232', kindCodes: ['00', '01'], relatedMonths: [10] },
  { displayName: '열무', expect: '열무', itemCategoryCode: '200', itemCode: '233', kindCodes: ['00', '01'], relatedMonths: [7] },
  { displayName: '풋고추', expect: '고추', itemCategoryCode: '200', itemCode: '243', kindCodes: ['00', '01', '02'], relatedMonths: [7] },
  { displayName: '양파', expect: '양파', itemCategoryCode: '200', itemCode: '245', kindCodes: ['00', '01'], relatedMonths: [6] },
  { displayName: '대파', expect: '파', itemCategoryCode: '200', itemCode: '246', kindCodes: ['00', '01'], relatedMonths: [1, 12] },
  { displayName: '깻잎', expect: '깻잎', itemCategoryCode: '200', itemCode: '253', kindCodes: ['00', '01'], relatedMonths: [6] },
  { displayName: '부추', expect: '부추', itemCategoryCode: '200', itemCode: '254', kindCodes: ['00', '01'], relatedMonths: [6] },
  { displayName: '미나리', expect: '미나리', itemCategoryCode: '200', itemCode: '249', kindCodes: ['00', '01'], relatedMonths: [3] },
  { displayName: '가지', expect: '가지', itemCategoryCode: '200', itemCode: '255', kindCodes: ['00', '01'], relatedMonths: [7] },
  { displayName: '느타리버섯', expect: '느타리', itemCategoryCode: '200', itemCode: '256', kindCodes: ['00', '01'], relatedMonths: [3] },
  { displayName: '팽이버섯', expect: '팽이', itemCategoryCode: '200', itemCode: '257', kindCodes: ['00', '01'], relatedMonths: [1] },
  { displayName: '깐마늘', expect: '마늘', itemCategoryCode: '200', itemCode: '258', kindCodes: ['00', '01'], relatedMonths: [6], aliases: ['햇마늘', '마늘'] },
  // ── 식량작물 (100) ──
  { displayName: '쌀', expect: '쌀', itemCategoryCode: '100', itemCode: '111', kindCodes: ['00', '01'], relatedMonths: [10], aliases: ['햅쌀'] },
  { displayName: '콩', expect: '콩', itemCategoryCode: '100', itemCode: '141', kindCodes: ['00', '01'], relatedMonths: [11], aliases: ['메주콩'] },
  { displayName: '팥', expect: '팥', itemCategoryCode: '100', itemCode: '142', kindCodes: ['00', '01'], relatedMonths: [11] },
  { displayName: '녹두', expect: '녹두', itemCategoryCode: '100', itemCode: '143', kindCodes: ['00', '01'], relatedMonths: [9] },
  // ── 과일 (400) ──
  { displayName: '복숭아', expect: '복숭아', itemCategoryCode: '400', itemCode: '413', kindCodes: ['00', '01', '02'], relatedMonths: [8] },
  { displayName: '포도', expect: '포도', itemCategoryCode: '400', itemCode: '414', kindCodes: ['00', '01', '02'], relatedMonths: [8] },
  { displayName: '감귤', expect: '감귤', itemCategoryCode: '400', itemCode: '415', kindCodes: ['00', '01'], relatedMonths: [1, 12], aliases: ['귤'] },
  { displayName: '단감', expect: '단감', itemCategoryCode: '400', itemCode: '416', kindCodes: ['00', '01'], relatedMonths: [11] },
  { displayName: '참다래', expect: '참다래', itemCategoryCode: '400', itemCode: '419', kindCodes: ['00', '01'], relatedMonths: [3], aliases: ['키위'] },
  // ── 수산물 (600) ──
  { displayName: '고등어', expect: '고등어', itemCategoryCode: '600', itemCode: '611', kindCodes: ['00', '01', '02'], relatedMonths: [10] },
  { displayName: '갈치', expect: '갈치', itemCategoryCode: '600', itemCode: '613', kindCodes: ['00', '01', '02'], relatedMonths: [7, 10] },
  { displayName: '명태', expect: '명태', itemCategoryCode: '600', itemCode: '615', kindCodes: ['00', '01', '02'], relatedMonths: [12] },
  { displayName: '물오징어', expect: '오징어', itemCategoryCode: '600', itemCode: '616', kindCodes: ['00', '01'], relatedMonths: [9], aliases: ['오징어'] },
  { displayName: '건멸치', expect: '멸치', itemCategoryCode: '600', itemCode: '617', kindCodes: ['00', '01'], relatedMonths: [7], aliases: ['멸치'] },
  { displayName: '김', expect: '김', itemCategoryCode: '600', itemCode: '619', kindCodes: ['00', '01'], relatedMonths: [1] },
  { displayName: '건미역', expect: '미역', itemCategoryCode: '600', itemCode: '621', kindCodes: ['00', '01'], relatedMonths: [3], aliases: ['물미역', '미역'] },
  { displayName: '굴', expect: '굴', itemCategoryCode: '600', itemCode: '626', kindCodes: ['00', '01'], relatedMonths: [11, 12], aliases: ['생굴'] },
  { displayName: '전복', expect: '전복', itemCategoryCode: '600', itemCode: '629', kindCodes: ['00', '01'], relatedMonths: [8] },
  { displayName: '새우', expect: '새우', itemCategoryCode: '600', itemCode: '630', kindCodes: ['00', '01'], relatedMonths: [11], aliases: ['대하', '흰다리새우'] },
];

const KAMIS_BASE_URL = 'http://www.kamis.or.kr/service/price/xml.do';

function toKamisDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

interface VerifyResult {
  ok: boolean;
  kindCode?: string;
  itemname?: string;
  latestPrice?: number;
}

async function verify(c: Candidate): Promise<VerifyResult & { debug?: string }> {
  let lastDebug = '';
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);

  for (const kindCode of c.kindCodes) {
    const qs = new URLSearchParams({
      action: 'periodProductList',
      p_productclscode: '01', // 소매
      p_startday: toKamisDate(start),
      p_endday: toKamisDate(end),
      p_itemcategorycode: c.itemCategoryCode,
      p_itemcode: c.itemCode,
      p_kindcode: kindCode,
      p_productrankcode: '04',
      p_convert_kg_yn: 'Y',
      p_countycode: '1101',
      p_cert_key: certKey!,
      p_cert_id: certId!,
      p_returntype: 'json',
    });
    try {
      const res = await fetch(`${KAMIS_BASE_URL}?${qs.toString()}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh) sijeolsodam-price-check' },
      });
      if (!res.ok) {
        lastDebug = `HTTP ${res.status}`;
        continue;
      }
      const raw = await res.text();
      lastDebug = raw.slice(0, 400);
      let json: {
        data?: { item?: { itemname?: string | string[]; price: string }[]; error_code?: string };
      };
      try {
        json = JSON.parse(raw) as typeof json;
      } catch {
        continue; // JSON이 아니면 (에러 페이지 등) 디버그에 원문 남김
      }
      const rows = json?.data?.item;
      if (!Array.isArray(rows) || rows.length === 0) continue;

      const priced = rows.filter((r) => r.price && r.price !== '-' && !Number.isNaN(Number(r.price.replace(/,/g, ''))));
      if (priced.length === 0) continue;

      const rawName = rows.find((r) => r.itemname)?.itemname;
      const itemname = Array.isArray(rawName) ? rawName[0] : rawName;
      // 이름 가드: 응답 품목명이 기대와 다르면 오코드 -> 절대 등록 금지
      if (!itemname || !itemname.includes(c.expect)) {
        return { ok: false, kindCode, itemname };
      }
      const latest = priced[priced.length - 1];
      return { ok: true, kindCode, itemname, latestPrice: Number(latest.price.replace(/,/g, '')) };
    } catch {
      continue;
    }
    // eslint 방지용 — 도달 안 함
  }
  return { ok: false, debug: lastDebug };
}

function appendMappings(verified: { c: Candidate; kindCode: string }[]) {
  let content = readFileSync(MAPPING_PATH, 'utf-8');
  const existing = new Set(Array.from(content.matchAll(/displayName: '([^']+)'/g)).map((m) => m[1]));

  const blocks = verified
    .filter(({ c }) => !existing.has(c.displayName))
    .map(({ c, kindCode }) => {
      const aliases = c.aliases ? `\n    aliases: [${c.aliases.map((a) => `'${a}'`).join(', ')}],` : '';
      return `  {
    displayName: '${c.displayName}',
    itemCategoryCode: '${c.itemCategoryCode}',
    itemCode: '${c.itemCode}',
    kindCode: '${kindCode}', // expand-kamis-mappings.ts 라이브 검증 (${new Date().toISOString().slice(0, 10)})
    relatedMonths: [${c.relatedMonths.join(', ')}],${aliases}
  },`;
    });

  if (blocks.length === 0) return 0;
  // 배열 닫는 `];` 앞에 삽입
  content = content.replace(/\n\];/, `\n${blocks.join('\n')}\n];`);
  writeFileSync(MAPPING_PATH, content, 'utf-8');
  return blocks.length;
}

async function main() {
  // 사전 점검: 이미 검증돼 서비스 중인 감자(100/152/01)로 API 자체가 살아있는지 확인.
  // 이것도 실패하면 후보 코드 문제가 아니라 인증키/차단/API 변경 문제다.
  const sanity = await verify({
    displayName: '감자(사전점검)', expect: '감자',
    itemCategoryCode: '100', itemCode: '152', kindCodes: ['01'], relatedMonths: [6],
  });
  if (!sanity.ok) {
    console.error('사전 점검 실패 — 검증된 기존 매핑(감자)조차 데이터가 오지 않습니다.');
    console.error('원본 응답 (앞 400자):');
    console.error(sanity.debug || '(응답 없음)');
    console.error('\n-> 인증키 오류(error_code), 차단, 혹은 API 스펙 변경 여부를 위 응답에서 확인하세요.');
    process.exit(1);
  }
  console.log(`사전 점검 통과: 감자 — "${sanity.itemname}", 최근가 ${sanity.latestPrice?.toLocaleString()}원\n`);

  console.log(`후보 ${CANDIDATES.length}개 검증 시작 (최근 30일 · 서울 소매가 · 품목명 일치 확인)\n`);
  const verified: { c: Candidate; kindCode: string }[] = [];

  for (const c of CANDIDATES) {
    const r = await verify(c);
    if (r.ok) {
      verified.push({ c, kindCode: r.kindCode! });
      console.log(`✓ ${c.displayName} — kind ${r.kindCode}, 응답 품목명 "${r.itemname}", 최근가 ${r.latestPrice?.toLocaleString()}원`);
    } else if (r.itemname) {
      console.log(`✗ ${c.displayName} — 코드는 응답하지만 품목명 불일치("${r.itemname}") -> 등록 안 함`);
    } else {
      const hint = r.debug && /error|인증|해당/i.test(r.debug) ? ` [응답: ${r.debug.slice(0, 80)}]` : '';
      console.log(`✗ ${c.displayName} — 데이터 없음${hint}`);
    }
    await new Promise((res) => setTimeout(res, 400));
  }

  console.log(`\n검증 통과: ${verified.length}/${CANDIDATES.length}`);
  if (doWrite) {
    const added = appendMappings(verified);
    console.log(`매핑 파일에 ${added}개 추가 완료 (이미 있던 항목 제외). git diff 확인 후 커밋하세요.`);
  } else {
    console.log('--write 플래그를 붙이면 통과분을 kamis-mapping.ts에 자동 추가합니다.');
  }
}

main();

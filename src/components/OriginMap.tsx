'use client';

/**
 * 산지 지도 — 식재료의 대표 산지를 한반도(남한) 약식 지도 위에 표시한다.
 *
 * 좌표는 실제 위경도를 단순 선형 투영한 값이라 정확한 측량 지도는 아니고,
 * "어디쯤에서 오는 재료인지" 감을 주기 위한 비주얼 요소다.
 */

// 투영 범위 (남한 + 제주)
const LON_MIN = 125.6;
const LON_MAX = 129.8;
const LAT_MIN = 32.9;
const LAT_MAX = 38.7;
const W = 300;
const H = 400;

function project(lat: number, lon: number): [number, number] {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * W;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H;
  return [Number(x.toFixed(1)), Number(y.toFixed(1))];
}

/** 남한 해안선 약식 좌표 (북 → 동해안 → 남해안 → 서해안 → 휴전선) */
const MAINLAND: [number, number][] = [
  [38.4, 128.47], [38.2, 128.6], [37.75, 128.95], [37.45, 129.17], [36.99, 129.42],
  [36.4, 129.42], [36.05, 129.42], [35.55, 129.36], [35.15, 129.1], [35.05, 128.85],
  [34.85, 128.65], [34.83, 128.42], [34.78, 127.95], [34.72, 127.72], [34.5, 127.48],
  [34.55, 127.05], [34.32, 126.75], [34.28, 126.55], [34.6, 126.35], [34.8, 126.32],
  [35.28, 126.4], [35.7, 126.6], [35.98, 126.68], [36.35, 126.48], [36.75, 126.28],
  [36.95, 126.75], [37.45, 126.62], [37.75, 126.45], [37.9, 126.68], [38.0, 127.1],
  [38.3, 127.6], [38.35, 128.1],
];

/** 제주도 약식 (타원) */
const JEJU = { lat: 33.38, lon: 126.55, rx: 22, ry: 12 };

/**
 * 산지 문자열 -> 좌표.
 * "충남 태안·서천"처럼 여러 곳이 붙어 있으면 첫 지명을 대표로 쓴다.
 * 시·군 이름을 먼저 찾고, 없으면 도 단위 중심점으로 떨어뜨린다.
 */
const CITY_COORDS: Record<string, [number, number]> = {
  // 강원
  강릉: [37.75, 128.88], 평창: [37.37, 128.39], 정선: [37.38, 128.66], 고성: [38.38, 128.47],
  홍천: [37.7, 127.89],
  // 경기
  김포: [37.62, 126.72], 남양주: [37.64, 127.22], 여주: [37.3, 127.64], 이천: [37.28, 127.44],
  평택: [36.99, 127.11],
  // 충남·충북
  태안: [36.75, 126.3], 서천: [36.08, 126.69], 홍성: [36.6, 126.66], 보령: [36.35, 126.6],
  부여: [36.28, 126.91], 논산: [36.19, 127.1], 서산: [36.78, 126.45], 천안: [36.81, 127.15],
  군산: [35.97, 126.74], 충주: [36.99, 127.93], 보은: [36.49, 127.73], 안동: [36.57, 128.73],
  // 전남·전북
  보성: [34.77, 127.08], 벌교: [34.84, 127.34], 신안: [34.83, 126.11], 무안: [34.99, 126.48],
  여수: [34.76, 127.66], 해남: [34.57, 126.6], 완도: [34.31, 126.75], 고흥: [34.61, 127.28],
  광양: [34.94, 127.7], 영암: [34.8, 126.7], 장흥: [34.68, 126.91], 나주: [35.02, 126.71],
  함평: [35.07, 126.52], 고창: [35.43, 126.7], 정읍: [35.57, 126.86], 담양: [35.32, 126.99],
  // 경남·경북
  거제: [34.88, 128.62], 통영: [34.85, 128.43], 남해: [34.84, 127.89], 기장: [35.24, 129.22],
  창원: [35.23, 128.68], 진주: [35.18, 128.11], 밀양: [35.5, 128.75], 거창: [35.69, 127.91],
  함양: [35.52, 127.73], 의성: [36.35, 128.7], 김천: [36.14, 128.11], 상주: [36.41, 128.16],
  성주: [35.92, 128.28], 영덕: [36.42, 129.37], 울진: [36.99, 129.4], 청도: [35.65, 128.74],
  청송: [36.44, 129.06], 포항: [36.02, 129.34], 영천: [35.97, 128.94], 울릉: [37.5, 130.87],
  // 제주
  제주: [33.45, 126.55],
};

const PROVINCE_COORDS: Record<string, [number, number]> = {
  강원: [37.8, 128.3], 경기: [37.4, 127.2], 충남: [36.5, 126.8], 충북: [36.8, 127.7],
  전남: [34.9, 126.9], 전북: [35.7, 127.1], 경남: [35.2, 128.4], 경북: [36.3, 128.7],
  제주: [33.45, 126.55], 서울: [37.57, 126.98], 부산: [35.18, 129.08], 인천: [37.46, 126.7],
};

export function resolveOriginCoord(origin: string): { lat: number; lon: number; label: string } | null {
  // "경북 포항(구룡포)" -> 괄호 제거, "충남 태안·서천" -> 첫 지명
  const cleaned = origin.replace(/\(.*?\)/g, '').trim();
  const primary = cleaned.split('·')[0].trim();
  const tokens = primary.split(/\s+/);

  for (let i = tokens.length - 1; i >= 0; i--) {
    const city = CITY_COORDS[tokens[i]];
    if (city) return { lat: city[0], lon: city[1], label: primary };
  }
  const prov = PROVINCE_COORDS[tokens[0]];
  if (prov) return { lat: prov[0], lon: prov[1], label: primary };
  return null;
}

export default function OriginMap({ origin, name }: { origin: string; name: string }) {
  const coord = resolveOriginCoord(origin);
  if (!coord) return null;

  const path = MAINLAND.map(([lat, lon], i) => {
    const [x, y] = project(lat, lon);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ') + ' Z';

  const [jx, jy] = project(JEJU.lat, JEJU.lon);
  const [mx, my] = project(coord.lat, coord.lon);
  // 울릉도처럼 투영 범위를 벗어나는 산지는 가장자리로 클램프
  const cx = Math.max(8, Math.min(W - 8, mx));
  const cy = Math.max(8, Math.min(H - 8, my));

  return (
    <section className="mb-8">
      <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-ink mb-3">어디서 오나요</h2>
      <div className="rounded-2xl border border-border-soft bg-paper px-4 py-4">
        <div className="flex items-center gap-4">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-[190px] w-auto shrink-0"
            role="img"
            aria-label={`${name}의 대표 산지 ${origin}를 표시한 지도`}
          >
            <path d={path} fill="var(--color-cream-warm, #F3EFE7)" stroke="var(--color-border-soft, #E5DFD3)" strokeWidth="1.5" strokeLinejoin="round" />
            <ellipse cx={jx} cy={jy} rx={JEJU.rx} ry={JEJU.ry} fill="var(--color-cream-warm, #F3EFE7)" stroke="var(--color-border-soft, #E5DFD3)" strokeWidth="1.5" />
            {/* 산지 표시 — 은은한 후광 + 점 */}
            <circle cx={cx} cy={cy} r="14" fill="var(--color-terracotta, #C4633F)" opacity="0.16" />
            <circle cx={cx} cy={cy} r="6" fill="var(--color-terracotta, #C4633F)" />
            <circle cx={cx} cy={cy} r="2.2" fill="#fff" opacity="0.9" />
          </svg>

          <div className="min-w-0">
            <p className="text-[12px] tracking-[0.08em] text-sage font-semibold mb-1">대표 산지</p>
            <p className="text-[17px] font-bold tracking-[-0.01em] text-ink leading-snug">{origin}</p>
            <p className="text-[12.5px] text-ink-soft/70 mt-2 leading-relaxed">
              같은 {name}라도 산지에 따라 맛과 크기가 조금씩 달라요.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 24절기 데이터 — 홈 절기 히어로의 뼈대.
 *
 * 각 절기는 이름·한자·대표 날짜·한 줄 서사와 함께 "시즌 컬러 테마"를 가진다.
 * 테마는 히어로 배경 그라디언트(deep/mid)와 포인트 컬러(warm)로 쓰이며,
 * 절기가 바뀔 때마다 앱 첫 화면의 무드가 계절을 따라 흐르게 하는 장치다.
 *
 * 날짜는 해마다 ±1일 오차가 있는 통상 기준일을 쓴다.
 * (라이프스타일 앱 용도로는 충분하고, 정밀 천문 계산은 오버엔지니어링)
 */

export interface SolarTermTheme {
  /** 히어로 배경의 가장 짙은 색 */
  deep: string;
  /** 히어로 배경의 중간 색 (그라디언트 시작) */
  mid: string;
  /** 포인트 컬러 — D-day 강조, 진행 바, 볕/서리 같은 계절 광원 */
  warm: string;
}

export interface SolarTerm {
  /** 0(입춘) ~ 23(대한) — 전통 관례대로 입춘이 절기 해(歲)의 시작 */
  index: number;
  name: string;
  hanja: string;
  /** 통상 기준일 */
  month: number;
  day: number;
  /** 히어로에 들어가는 한 줄 서사 */
  tagline: string;
  theme: SolarTermTheme;
}

export const SOLAR_TERMS: SolarTerm[] = [
  { index: 0,  name: '입춘', hanja: '立春', month: 2,  day: 4,  tagline: '봄이 문 앞에 서는 때', theme: { deep: '#24403B', mid: '#3A6157', warm: '#D9C27A' } },
  { index: 1,  name: '우수', hanja: '雨水', month: 2,  day: 19, tagline: '눈이 녹아 비가 되는 때', theme: { deep: '#223E44', mid: '#38626A', warm: '#C9D28B' } },
  { index: 2,  name: '경칩', hanja: '驚蟄', month: 3,  day: 6,  tagline: '겨울잠 든 것들이 깨어나는 때', theme: { deep: '#24422C', mid: '#3B6B48', warm: '#C7D06B' } },
  { index: 3,  name: '춘분', hanja: '春分', month: 3,  day: 21, tagline: '낮과 밤의 길이가 같아지는 때', theme: { deep: '#2A4A2E', mid: '#45744C', warm: '#E8C2CE' } },
  { index: 4,  name: '청명', hanja: '淸明', month: 4,  day: 5,  tagline: '하늘이 맑고 밝아지는 때', theme: { deep: '#2E5237', mid: '#4C7D55', warm: '#F2CDD6' } },
  { index: 5,  name: '곡우', hanja: '穀雨', month: 4,  day: 20, tagline: '곡식을 깨우는 봄비가 내리는 때', theme: { deep: '#2A4E33', mid: '#46774E', warm: '#B7CF8F' } },
  { index: 6,  name: '입하', hanja: '立夏', month: 5,  day: 6,  tagline: '여름이 문 앞에 서는 때', theme: { deep: '#1F4A33', mid: '#35704C', warm: '#E0D06A' } },
  { index: 7,  name: '소만', hanja: '小滿', month: 5,  day: 21, tagline: '만물이 자라 가득 차기 시작하는 때', theme: { deep: '#1D482F', mid: '#326E47', warm: '#EBD35E' } },
  { index: 8, name: '망종', hanja: '芒種', month: 6,  day: 6,  tagline: '보리를 거두고 모를 심는 때', theme: { deep: '#20452B', mid: '#386A42', warm: '#E7C355' } },
  { index: 9, name: '하지', hanja: '夏至', month: 6,  day: 21, tagline: '일 년 중 낮이 가장 긴 때', theme: { deep: '#1E4630', mid: '#305F41', warm: '#F0BE4B' } },
  { index: 10, name: '소서', hanja: '小暑', month: 7,  day: 7,  tagline: '작은 더위가 문을 여는 때', theme: { deep: '#1E4632', mid: '#2E6B45', warm: '#E9B84E' } },
  { index: 11, name: '대서', hanja: '大暑', month: 7,  day: 23, tagline: '일 년 중 가장 더운 때', theme: { deep: '#173D2B', mid: '#27603F', warm: '#F0A93C' } },
  { index: 12, name: '입추', hanja: '立秋', month: 8,  day: 8,  tagline: '더위 속에 가을이 문 앞에 서는 때', theme: { deep: '#2C4A2C', mid: '#4A6E3F', warm: '#E2B04C' } },
  { index: 13, name: '처서', hanja: '處暑', month: 8,  day: 23, tagline: '더위가 그치고 바람이 선선해지는 때', theme: { deep: '#3A4A2D', mid: '#5C7040', warm: '#E0A94F' } },
  { index: 14, name: '백로', hanja: '白露', month: 9,  day: 8,  tagline: '풀잎에 흰 이슬이 맺히는 때', theme: { deep: '#4A452A', mid: '#6E663C', warm: '#E3B45C' } },
  { index: 15, name: '추분', hanja: '秋分', month: 9,  day: 23, tagline: '낮과 밤의 길이가 다시 같아지는 때', theme: { deep: '#4E3E26', mid: '#75603A', warm: '#E8A852' } },
  { index: 16, name: '한로', hanja: '寒露', month: 10, day: 8,  tagline: '찬 이슬이 맺히기 시작하는 때', theme: { deep: '#4A3222', mid: '#6E4C32', warm: '#E88D4A' } },
  { index: 17, name: '상강', hanja: '霜降', month: 10, day: 23, tagline: '첫서리가 내리는 때', theme: { deep: '#42291E', mid: '#64402C', warm: '#E07B3D' } },
  { index: 18, name: '입동', hanja: '立冬', month: 11, day: 7,  tagline: '겨울이 문 앞에 서는 때', theme: { deep: '#2E2A26', mid: '#4A443C', warm: '#D9A25F' } },
  { index: 19, name: '소설', hanja: '小雪', month: 11, day: 22, tagline: '첫눈이 내리기 시작하는 때', theme: { deep: '#262B33', mid: '#3E4A59', warm: '#CBD5DF' } },
  { index: 20, name: '대설', hanja: '大雪', month: 12, day: 7,  tagline: '큰 눈이 내리는 때', theme: { deep: '#1E2530', mid: '#33445A', warm: '#DCE4EC' } },
  { index: 21, name: '동지', hanja: '冬至', month: 12, day: 22, tagline: '일 년 중 밤이 가장 긴 때', theme: { deep: '#1A2029', mid: '#2E3C50', warm: '#D9A379' } },
  { index: 22,  name: '소한', hanja: '小寒', month: 1,  day: 5,  tagline: '한 해 가장 매서운 추위가 오는 때', theme: { deep: '#1D2B3A', mid: '#2F4A63', warm: '#E3C08F' } },
  { index: 23,  name: '대한', hanja: '大寒', month: 1,  day: 20, tagline: '큰 추위 끝에 봄이 숨을 고르는 때', theme: { deep: '#16222E', mid: '#29405A', warm: '#DDB77F' } },
];

export interface CurrentSolarTerm {
  current: SolarTerm;
  next: SolarTerm;
  /** 다음 절기까지 남은 일수 (당일이면 0) */
  daysToNext: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** 해당 연도 기준의 절기 날짜(로컬 자정) */
function termDate(term: SolarTerm, year: number): Date {
  return new Date(year, term.month - 1, term.day);
}

/**
 * 오늘이 속한 절기와 다음 절기, D-day를 계산한다.
 * 연말·연초 경계(동지 → 다음 해 소한)를 처리하기 위해
 * 전년~내년 3개 연도의 절기 날짜를 펼쳐서 탐색한다.
 */
export function getCurrentSolarTerm(now: Date = new Date()): CurrentSolarTerm {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const year = today.getFullYear();

  const timeline = [year - 1, year, year + 1].flatMap((y) =>
    SOLAR_TERMS.map((t) => ({ term: t, date: termDate(t, y) }))
  );
  // 연도 순서대로 만들어져 이미 정렬 상태지만, 방어적으로 한 번 더 정렬
  timeline.sort((a, b) => a.date.getTime() - b.date.getTime());

  // 오늘보다 늦은 첫 절기 = 다음 절기, 그 직전 = 현재 절기
  const nextIdx = timeline.findIndex((e) => e.date.getTime() > today.getTime());
  const currentEntry = timeline[nextIdx - 1];
  const nextEntry = timeline[nextIdx];

  const daysToNext = Math.round((nextEntry.date.getTime() - today.getTime()) / MS_PER_DAY);

  return { current: currentEntry.term, next: nextEntry.term, daysToNext };
}

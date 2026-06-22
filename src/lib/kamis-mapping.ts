// KAMIS(농산물유통정보) 품목코드 매핑
// 아래 값은 실제 KAMIS Open-API(periodProductList)를 호출해서 하나씩 검증한 코드입니다
// (2026-06 기준 실제 키로 호출하여 가격이 실제로 반환되는지 직접 확인함).
//
// 딸기는 KAMIS 채소류/과일류/특용작물(200/400/300) 항목 코드를 폭넓게 스캔했지만
// 매칭되는 itemCode를 찾지 못해 제외했습니다. 해산물(갑오징어, 도다리, 농어, 전갱이,
// 멸치 등)도 600번대를 넓게 스캔했지만 삼치 외에는 거의 데이터가 없어 제외했습니다.
// 더 정확한 코드가 필요하면 KAMIS 사이트에 로그인해서 받는 공식 코드표를 참고해야 합니다.

export interface KamisItemMapping {
  /** 우리 레시피 데이터의 mainIngredient와 매칭되는 표시용 이름 */
  displayName: string;
  itemCategoryCode: string;
  itemCode: string;
  kindCode: string;
  /** 도매(1) / 소매(2) 등 productClsCode 구분이 필요하면 추가 */
  productRankCode?: string;
  /** 어느 월에 제철로 다루는 식재료인지 (months.ts와 매칭, 참고용) */
  relatedMonths: number[];
}

export const kamisItemMappings: KamisItemMapping[] = [
  {
    displayName: '감자(햇감자)',
    itemCategoryCode: '100',
    itemCode: '152',
    kindCode: '01', // 수미(노지)
    relatedMonths: [6],
  },
  {
    displayName: '배추',
    itemCategoryCode: '200',
    itemCode: '211',
    kindCode: '01', // 봄
    relatedMonths: [11],
  },
  {
    displayName: '무',
    itemCategoryCode: '200',
    itemCode: '231',
    kindCode: '01', // 봄
    relatedMonths: [1, 9, 12],
  },
  {
    displayName: '사과',
    itemCategoryCode: '400',
    itemCode: '411',
    kindCode: '05', // 후지
    relatedMonths: [10],
  },
  {
    displayName: '배',
    itemCategoryCode: '400',
    itemCode: '412',
    kindCode: '01', // 신고
    relatedMonths: [9],
  },
  {
    displayName: '방울토마토',
    itemCategoryCode: '400',
    itemCode: '422',
    kindCode: '01',
    relatedMonths: [6],
  },
  {
    displayName: '고구마',
    itemCategoryCode: '100',
    itemCode: '151',
    kindCode: '00', // 밤
    relatedMonths: [10],
  },
];

export function getKamisMappingForMonth(month: number): KamisItemMapping[] {
  return kamisItemMappings.filter((m) => m.relatedMonths.includes(month));
}

/**
 * 레시피/식재료의 이름(예: "감자", "햇감자")으로 KAMIS 매핑을 찾음.
 * 양방향 부분일치로 검사 (표시명에 입력명이 포함되거나, 입력명에 표시명의 핵심 단어가 포함).
 * 못 찾으면 undefined.
 */
export function getKamisMappingByName(name: string): KamisItemMapping | undefined {
  const normalized = name.trim();
  return kamisItemMappings.find(
    (m) => m.displayName.includes(normalized) || normalized.includes(m.displayName.replace(/\(.*\)/, ''))
  );
}

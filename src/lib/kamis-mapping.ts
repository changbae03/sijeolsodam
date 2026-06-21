// KAMIS(농산물유통정보) 품목코드 매핑
// 주의: itemCategoryCode, itemCode, kindCode는 KAMIS "Open-API 이용안내" 페이지의
// 품목코드 표를 보고 정확한 값으로 교체해야 합니다. 아래 값은 임시 placeholder입니다.
//
// KAMIS는 수산물(갈치, 전복, 굴, 새우 등)은 다루지 않고 농산물/축산물 위주이므로,
// 해산물 식재료는 가격 추적 대상에서 제외하고 농산물만 우선 연결합니다.

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
    kindCode: '00',
    relatedMonths: [6],
  },
  {
    displayName: '배추',
    itemCategoryCode: '200',
    itemCode: '211',
    kindCode: '00',
    relatedMonths: [11],
  },
  {
    displayName: '무',
    itemCategoryCode: '200',
    itemCode: '231',
    kindCode: '00',
    relatedMonths: [1, 9, 12],
  },
  {
    displayName: '사과',
    itemCategoryCode: '400',
    itemCode: '411',
    kindCode: '05',
    relatedMonths: [10],
  },
  {
    displayName: '배',
    itemCategoryCode: '400',
    itemCode: '412',
    kindCode: '01',
    relatedMonths: [9],
  },
  {
    displayName: '딸기',
    itemCategoryCode: '400',
    itemCode: '418',
    kindCode: '00',
    relatedMonths: [4],
  },
  {
    displayName: '토마토',
    itemCategoryCode: '200',
    itemCode: '226',
    kindCode: '00',
    relatedMonths: [6],
  },
  {
    displayName: '고구마',
    itemCategoryCode: '100',
    itemCode: '141',
    kindCode: '00',
    relatedMonths: [10],
  },
];

export function getKamisMappingForMonth(month: number): KamisItemMapping[] {
  return kamisItemMappings.filter((m) => m.relatedMonths.includes(month));
}

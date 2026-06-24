// KAMIS(농산물유통정보) 품목코드 매핑
// 아래 값은 KAMIS 공식 "농축수산물 품목 및 등급 코드표"와 실제 API 호출로 모두 검증한 코드입니다.
//
// 방울토마토는 공식 코드표상 채소류(200)로 분류되어 있지만, 실제 API 호출 시
// 과일류(400)에서만 데이터가 반환되는 것을 확인하여 라이브 검증값을 그대로 사용합니다.
//
// 해산물(갑오징어, 도다리, 농어, 전갱이, 생멸치 등)은 공식 코드표의 수산물 분류
// (고등어, 갈치, 명태, 굴, 새우 등 23개 품목)에 아예 포함되어 있지 않아 제외했습니다.

import { monthsData } from '@/data/months';
import { SeasonalIngredient } from '@/data/types';

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
  {
    displayName: '딸기',
    itemCategoryCode: '200',
    itemCode: '226',
    kindCode: '00',
    relatedMonths: [4],
  },
  {
    displayName: '오이',
    itemCategoryCode: '200',
    itemCode: '223',
    kindCode: '01', // 가시계통
    relatedMonths: [6, 7],
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

/**
 * KAMIS에 매핑된 표시명("감자(햇감자)")으로 실제 식재료 데이터(이미지, 이모지)를 찾아
 * { mapping, ingredient } 쌍의 목록을 만듦. /shop, 홈 등 여러 화면에서 공용으로 사용.
 */
export function getShoppableIngredients(): { mapping: KamisItemMapping; ingredient: SeasonalIngredient }[] {
  return kamisItemMappings
    .map((m) => {
      const bare = m.displayName.replace(/\(.*\)/, '');
      let found: SeasonalIngredient | undefined;
      for (const month of monthsData) {
        const match = month.ingredients.find(
          (i) => m.displayName.includes(i.name) || i.name.includes(bare)
        );
        if (match) {
          found = match;
          break;
        }
      }
      return { mapping: m, ingredient: found };
    })
    .filter(
      (x): x is { mapping: KamisItemMapping; ingredient: SeasonalIngredient } => Boolean(x.ingredient)
    );
}

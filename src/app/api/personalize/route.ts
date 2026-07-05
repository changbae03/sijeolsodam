import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { getRecipeById, getRecipesByIngredient } from '@/data/recipes';
import { getCurrentMonthData } from '@/lib/season';
import { getKamisMappingByName } from '@/lib/kamis-mapping';
import { fetchKamisPriceAnalysis } from '@/lib/kamis';

function pickTodaySeasonalIngredient() {
  const monthData = getCurrentMonthData();
  if (!monthData || monthData.ingredients.length === 0) return null;
  // 서버가 어느 시간대에서 돌아가든 한국 날짜 기준으로 인덱스를 정해야
  // 자정 근처에 재료가 서버 시간대 때문에 하루 일찍/늦게 바뀌지 않는다.
  const koreaDateStr = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    day: 'numeric',
  }).format(new Date());
  const dayIndex = Number(koreaDateStr) % monthData.ingredients.length;
  return monthData.ingredients[dayIndex];
}

/** 서버가 어느 시간대에서 돌아가든(대개 UTC) 항상 한국 시간 기준으로 계산한다 */
function getKoreaHour(): number {
  const hourStr = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    hour: 'numeric',
    hour12: false,
  }).format(new Date());
  return Number(hourStr) % 24;
}

/** 식사 여부를 묻는 사적인 인사말 대신, 시간대에 따라 톤만 살짝 바뀌는 담백한 인사 */
function greetingByHour() {
  const hour = getKoreaHour();
  if (hour < 6) return '고요한 새벽이네요';
  if (hour < 11) return '좋은 아침이에요';
  if (hour < 17) return '안녕하세요';
  if (hour < 21) return '저녁 시간이 다가와요';
  return '하루를 마무리하는 시간이네요';
}

/** Open-Meteo WMO 날씨 코드를 대략적인 성격으로 분류 (API 키 불필요, 무료 공개 API) */
const RAIN_CODES = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]);
const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86]);

async function fetchWeatherNote(lat: number, lon: number): Promise<string | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code&timezone=Asia%2FSeoul`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    const data = await res.json();
    const temp = data?.current?.temperature_2m as number | undefined;
    const precipitation = data?.current?.precipitation as number | undefined;
    const code = data?.current?.weather_code as number | undefined;
    if (temp === undefined || code === undefined) return null;

    if ((precipitation && precipitation > 0) || RAIN_CODES.has(code)) {
      return '비 오는 날엔 부침개나 뜨끈한 국물 요리가 떠오르는 날씨예요.';
    }
    if (SNOW_CODES.has(code)) {
      return '눈 오는 날엔 얼큰한 찌개나 뜨끈한 전골이 생각나는 날씨예요.';
    }
    if (temp >= 29) {
      return '무더운 날씨예요. 시원한 냉국수나 물회는 어떠세요.';
    }
    if (temp <= 3) {
      return '쌀쌀한 날씨예요. 몸을 데워줄 뜨끈한 국물이 생각나는 날이에요.';
    }
    return null;
  } catch {
    return null;
  }
}

/** 실제 KAMIS 시세 데이터를 근거로 "지금 사기 좋은 때인지"를 짧게 코멘트한다 */
async function fetchPriceNote(ingredientName: string): Promise<string | null> {
  const mapping = getKamisMappingByName(ingredientName);
  if (!mapping) return null;

  try {
    const analysis = await Promise.race([
      fetchKamisPriceAnalysis(mapping, 30),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
    ]);
    if (!analysis || analysis.latestPrice === null || analysis.avgPrice === null) return null;

    const { displayName, latestPrice, avgPrice, isAtLowestInPeriod } = analysis;
    const ratio = latestPrice / avgPrice;

    if (isAtLowestInPeriod) {
      return `${displayName}, 최근 한 달 중 가장 저렴해요. 지금이 사기 딱 좋은 때예요 📉`;
    }
    if (ratio <= 0.92) {
      return `${displayName} 값이 평소보다 내려가고 있어요. 장 보기 좋은 타이밍이에요.`;
    }
    if (ratio >= 1.15) {
      return `${displayName} 값이 요즘 조금 오르고 있어요. 급하지 않다면 잠시 기다려도 좋아요.`;
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const todayIngredient = pickTodaySeasonalIngredient();
  const user = getUserFromRequest(request);

  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get('lat'));
  const lon = Number(searchParams.get('lon'));
  const hasLocation = Number.isFinite(lat) && Number.isFinite(lon) && (lat !== 0 || lon !== 0);

  const [weatherNote, priceNote] = await Promise.all([
    hasLocation ? fetchWeatherNote(lat, lon) : Promise.resolve(null),
    todayIngredient ? fetchPriceNote(todayIngredient.name) : Promise.resolve(null),
  ]);

  if (!user) {
    return NextResponse.json({
      loggedIn: false,
      greeting: greetingByHour(),
      todayIngredient,
      topIngredient: null,
      recommendedRecipe: null,
      weatherNote,
      priceNote,
    });
  }

  try {
    // 즐겨찾기 + 최근 조회 기록을 합쳐서 이 유저가 어떤 재료에 관심이 많은지 추정
    const favoriteRows = await sql`
      SELECT recipe_id FROM favorites WHERE user_id = ${user.userId}
    `;
    const viewRows = await sql`
      SELECT main_ingredient FROM recipe_views
      WHERE user_id = ${user.userId} AND main_ingredient IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 30
    `;

    const ingredientCounts = new Map<string, number>();
    for (const row of favoriteRows) {
      const recipe = getRecipeById(row.recipe_id as string);
      if (recipe) {
        ingredientCounts.set(
          recipe.mainIngredient,
          (ingredientCounts.get(recipe.mainIngredient) ?? 0) + 2 // 즐겨찾기는 더 강한 신호로 가중치 2배
        );
      }
    }
    for (const row of viewRows) {
      const ingredient = row.main_ingredient as string;
      ingredientCounts.set(ingredient, (ingredientCounts.get(ingredient) ?? 0) + 1);
    }

    let topIngredient: string | null = null;
    let topCount = 0;
    for (const [ingredient, count] of ingredientCounts) {
      if (count > topCount) {
        topIngredient = ingredient;
        topCount = count;
      }
    }

    const favoritedIds = new Set(favoriteRows.map((r) => r.recipe_id as string));
    let recommendedRecipe = null;
    if (topIngredient) {
      const candidates = getRecipesByIngredient(topIngredient).filter((r) => !favoritedIds.has(r.id));
      if (candidates.length > 0) {
        const recipe = candidates[Math.floor(Math.random() * candidates.length)];
        recommendedRecipe = { id: recipe.id, title: recipe.title, heroImage: recipe.heroImage };
      }
    }

    return NextResponse.json({
      loggedIn: true,
      greeting: greetingByHour(),
      todayIngredient,
      topIngredient,
      recommendedRecipe,
      weatherNote,
      priceNote,
    });
  } catch (error) {
    console.error('Personalize error:', error);
    return NextResponse.json({
      loggedIn: true,
      greeting: greetingByHour(),
      todayIngredient,
      topIngredient: null,
      recommendedRecipe: null,
      weatherNote,
      priceNote,
    });
  }
}

import { Recipe } from './types';
import { recipesQ1 } from './recipes-q1';
import { recipesQ2 } from './recipes-q2';
import { recipesQ3 } from './recipes-q3';
import { recipesQ1Extra } from './recipes-q1-extra';
import { recipesQ2Extra } from './recipes-q2-extra';
import { recipesQ3Extra } from './recipes-q3-extra';
import { recipesQ1Extra2 } from './recipes-q1-extra2';
import { recipesQ2Extra2 } from './recipes-q2-extra2';
import { recipesQ3Extra2 } from './recipes-q3-extra2';
import { recipesIngredientCoverage } from './recipes-ingredient-coverage';
import { recipesLevelExpansion2 } from './recipes-level-expansion-2';
import { recipesLevelExpansion3 } from './recipes-level-expansion-3';
import { recipesPotatoExpansion } from './recipes-potato-expansion';
import { recipesPotatoExpansion2 } from './recipes-potato-expansion-2';
import { recipesAppleExpansion } from './recipes-apple-expansion';
import { recipesRadishTomatoExpansion } from './recipes-radish-tomato-expansion';
import { recipesCabbageCucumberExpansion } from './recipes-cabbage-cucumber-expansion';
import { recipesPearExpansion } from './recipes-pear-expansion';
import { recipesSweetpotatoStrawberryExpansion } from './recipes-sweetpotato-strawberry-expansion';
import { recipesAppleRadishBoost } from './recipes-apple-radish-boost';
import { recipesTomatoCabbageCucumberBoost } from './recipes-tomato-cabbage-cucumber-boost';
import { recipesEggplantExpansion } from './recipes-eggplant-expansion';
import { recipesSpinachExpansion } from './recipes-spinach-expansion';
import { recipesBeansproutExpansion } from './recipes-beansprout-expansion';
import { recipesZucchiniExpansion } from './recipes-zucchini-expansion';
import { recipesChiveExpansion } from './recipes-chive-expansion';
import { recipesGreenOnionExpansion } from './recipes-greenonion-expansion';
import { recipesSiraegiExpansion } from './recipes-siraegi-expansion';
import { recipesPerillaExpansion } from './recipes-perilla-expansion';
import { recipesMinariExpansion } from './recipes-minari-expansion';
import { recipesNaengiExpansion } from './recipes-naengi-expansion';
import { recipesDureupExpansion } from './recipes-dureup-expansion';
import { recipesChwinamulExpansion } from './recipes-chwinamul-expansion';
import { recipesShiitakeExpansion } from './recipes-shiitake-expansion';
import { recipesOysterMushroomExpansion } from './recipes-oyster-mushroom-expansion';
import { recipesBlackBeanExpansion } from './recipes-blackbean-expansion';
import { recipesPerillaSeedExpansion } from './recipes-perillaseed-expansion';
import { recipesBlackRiceExpansion } from './recipes-blackrice-expansion';
import { recipesDriedPersimmonExpansion } from './recipes-driedpersimmon-expansion';
import { recipesClamExpansion } from './recipes-clam-expansion';
import { recipesSpanishMackerelExpansion } from './recipes-mackerel-expansion';
import { recipesSeaBreamExpansion } from './recipes-seabream-expansion';
import { recipesWebfootOctopusExpansion } from './recipes-webfootoctopus-expansion';
import { recipesJjokpaExpansion } from './recipes-jjokpa-expansion';
import { recipesRapeGreensExpansion } from './recipes-rapegreens-expansion';
import { recipesFreshWakameExpansion } from './recipes-wakame-expansion';
import { recipesWildChiveExpansion } from './recipes-wildchive-expansion';
import { recipesSpringCabbageExpansion } from './recipes-springcabbage-expansion';
import { recipesSweetPumpkinExpansion } from './recipes-pumpkin-expansion';
import { recipesOysterExpansion } from './recipes-oyster-expansion';
import { recipesSweetPersimmonExpansion } from './recipes-sweetpersimmon-expansion';
import { recipesPollackExpansion } from './recipes-pollack-expansion';
import { recipesAbaloneExpansion } from './recipes-abalone-expansion';
import { recipesBambooShootExpansion } from './recipes-bamboo-expansion';
import { recipesHairtailExpansion } from './recipes-hairtail-expansion';
import { recipesCuttlefishExpansion } from './recipes-cuttlefish-expansion';
import { recipesSweetPotatoStemExpansion } from './recipes-sweetpotatostem-expansion';
import { recipesJujubeExpansion } from './recipes-jujube-expansion';
import { recipesStonecropExpansion } from './recipes-stonecrop-expansion';
import { recipesDongchimiExpansion } from './recipes-dongchimi-expansion';
import { recipesSeaMustardExpansion } from './recipes-maesaengi-expansion';
import { recipesButterburExpansion } from './recipes-butterbur-expansion';
import { recipesSoybeanExpansion } from './recipes-soybean-expansion';
import { recipesAnchovyExpansion } from './recipes-anchovy-expansion';
import { recipesQuinceExpansion } from './recipes-quince-expansion';
import { recipesFigExpansion } from './recipes-fig-expansion';
import { recipesMulmegiExpansion } from './recipes-mulmegi-expansion';
import { recipesPeachExpansion } from './recipes-peach-expansion';
import { recipesAutumnRadishExpansion } from './recipes-autumnradish-expansion';
import { recipesAutumnCabbageExpansion } from './recipes-autumncabbage-expansion';
import { recipesMustardGreensExpansion } from './recipes-mustardgreens-expansion';
import { recipesGwamegiExpansion } from './recipes-gwamegi-expansion';
import { recipesFlatfishExpansion } from './recipes-flatfish-expansion';
import { recipesTangerineExpansion } from './recipes-tangerine-expansion';
import { recipesCockleExpansion } from './recipes-cockle-expansion';
import { recipesBlueCrabExpansion } from './recipes-bluecrab-expansion';
import { recipesFlowerShrimpExpansion } from './recipes-flowershrimp-expansion';
import { recipesLongArmOctopusExpansion } from './recipes-longarmoctopus-expansion';
import { recipesMungBeanExpansion } from './recipes-mungbean-expansion';
import { recipesSeaBassExpansion } from './recipes-seabass-expansion';
import { recipesOldPumpkinExpansion } from './recipes-oldpumpkin-expansion';
import { recipesSnowCrabExpansion } from './recipes-snowcrab-expansion';
import { recipesCodExpansion } from './recipes-cod-expansion';
import { recipesLargeShrimpExpansion } from './recipes-largeshrimp-expansion';
import { recipesFlounderExpansion } from './recipes-flounder-expansion';
import { recipesRedhyangExpansion } from './recipes-redhyang-expansion';
import { recipesGarlicScapeExpansion } from './recipes-garlicscape-expansion';
import { recipesSeaSquirtExpansion } from './recipes-seasquirt-expansion';
import { recipesMelonExpansion } from './recipes-melon-expansion';
import { recipesRadishSproutExpansion } from './recipes-radishsprout-expansion';
import { recipesCroakerExpansion } from './recipes-croaker-expansion';
import { recipesYellowtailExpansion } from './recipes-yellowtail-expansion';
import { recipesIcefishExpansion } from './recipes-icefish-expansion';
import { recipesPomfretExpansion } from './recipes-pomfret-expansion';
import { recipesBarleyExpansion } from './recipes-barley-expansion';
import { recipesBarleyShrimpExpansion } from './recipes-barleyshrimp-expansion';
import { recipesBlackRaspberryExpansion } from './recipes-blackraspberry-expansion';
import { recipesLettuceExpansion } from './recipes-lettuce-expansion';
import { recipesEggCockleExpansion } from './recipes-eggcockle-expansion';
import { recipesSeaUrchinExpansion } from './recipes-seaurchin-expansion';
import { recipesMulletExpansion } from './recipes-mullet-expansion';
import { recipesIxerisExpansion } from './recipes-ixeris-expansion';
import { recipesAsparagusExpansion } from './recipes-asparagus-expansion';
import { recipesApricotExpansion } from './recipes-apricot-expansion';
import { recipesLotusRootExpansion } from './recipes-lotusroot-expansion';
import { recipesSalmonExpansion } from './recipes-salmon-expansion';
import { recipesRockfishExpansion } from './recipes-rockfish-expansion';
import { recipesBurdockExpansion } from './recipes-burdock-expansion';
import { recipesPlumExpansion } from './recipes-plum-expansion';
import { recipesEelExpansion } from './recipes-eel-expansion';
import { recipesHorseMackerelExpansion } from './recipes-horsemackerel-expansion';
import { recipesGizzardShadExpansion } from './recipes-gizzardshad-expansion';
import { recipesChiveShootsExpansion } from './recipes-chiveshoots-expansion';
import { recipesChamnamulExpansion } from './recipes-chamnamul-expansion';
import { recipesCheonhyehyangExpansion } from './recipes-cheonhyehyang-expansion';
import { recipesHerringExpansion } from './recipes-herring-expansion';
import { recipesKiwiExpansion } from './recipes-kiwi-expansion';
import { recipesTaroExpansion } from './recipes-taro-expansion';
import { recipesGreenGarlicExpansion } from './recipes-greengarlic-expansion';
import { recipesEdamameExpansion } from './recipes-edamame-expansion';
import { recipesSwordtipSquidExpansion } from './recipes-swordtipsquid-expansion';
import { recipesNewRiceExpansion } from './recipes-newrice-expansion';
import { recipesNewGarlicExpansion } from './recipes-newgarlic-expansion';
import { recipesHwanggeumhyangExpansion } from './recipes-hwanggeumhyang-expansion';
import { recipesBlueberryExpansion } from './recipes-blueberry-expansion';
import { recipesPomegranateExpansion } from './recipes-pomegranate-expansion';
import { recipesStoneEarExpansion } from './recipes-stoneear-expansion';
import { recipesWatermelonExpansion } from './recipes-watermelon-expansion';
import { recipesSilchiExpansion } from './recipes-silchi-expansion';
import { recipesIcebergLettuceExpansion } from './recipes-icebergLettuce-expansion';
import { recipesYeolmuExpansion } from './recipes-yeolmu-expansion';
import { recipesGreenPeasExpansion } from './recipes-greenpeas-expansion';
import { recipesYujaExpansion } from './recipes-yuja-expansion';
import { recipesChamoeExpansion } from './recipes-chamoe-expansion';
import { recipesChodangCornExpansion } from './recipes-chodangcorn-expansion';
import { recipesPenShellExpansion } from './recipes-penshell-expansion';
import { recipesGrapeExpansion } from './recipes-grape-expansion';
import { recipesGreenChiliExpansion } from './recipes-greenchili-expansion';
import { recipesHallabongExpansion } from './recipes-hallabong-expansion';
import { recipesMusselExpansion } from './recipes-mussel-expansion';
import { recipesEnokiExpansion } from './recipes-enoki-expansion';
import { recipesNeungiExpansion } from './recipes-neungi-expansion';

export const allRecipes: Recipe[] = [
  ...recipesQ1,
  ...recipesQ2,
  ...recipesQ3,
  ...recipesQ1Extra,
  ...recipesQ2Extra,
  ...recipesQ3Extra,
  ...recipesQ1Extra2,
  ...recipesQ2Extra2,
  ...recipesQ3Extra2,
  ...recipesIngredientCoverage,
  ...recipesLevelExpansion2,
  ...recipesLevelExpansion3,
  ...recipesPotatoExpansion,
  ...recipesPotatoExpansion2,
  ...recipesAppleExpansion,
  ...recipesRadishTomatoExpansion,
  ...recipesCabbageCucumberExpansion,
  ...recipesPearExpansion,
  ...recipesSweetpotatoStrawberryExpansion,
  ...recipesAppleRadishBoost,
  ...recipesTomatoCabbageCucumberBoost,
  ...recipesEggplantExpansion,
  ...recipesSpinachExpansion,
  ...recipesBeansproutExpansion,
  ...recipesZucchiniExpansion,
  ...recipesChiveExpansion,
  ...recipesGreenOnionExpansion,
  ...recipesSiraegiExpansion,
  ...recipesPerillaExpansion,
  ...recipesMinariExpansion,
  ...recipesNaengiExpansion,
  ...recipesDureupExpansion,
  ...recipesChwinamulExpansion,
  ...recipesShiitakeExpansion,
  ...recipesOysterMushroomExpansion,
  ...recipesBlackBeanExpansion,
  ...recipesPerillaSeedExpansion,
  ...recipesBlackRiceExpansion,
  ...recipesDriedPersimmonExpansion,
  ...recipesClamExpansion,
  ...recipesSpanishMackerelExpansion,
  ...recipesSeaBreamExpansion,
  ...recipesWebfootOctopusExpansion,
  ...recipesJjokpaExpansion,
  ...recipesRapeGreensExpansion,
  ...recipesFreshWakameExpansion,
  ...recipesWildChiveExpansion,
  ...recipesSpringCabbageExpansion,
  ...recipesSweetPumpkinExpansion,
  ...recipesOysterExpansion,
  ...recipesSweetPersimmonExpansion,
  ...recipesPollackExpansion,
  ...recipesAbaloneExpansion,
  ...recipesBambooShootExpansion,
  ...recipesHairtailExpansion,
  ...recipesCuttlefishExpansion,
  ...recipesSweetPotatoStemExpansion,
  ...recipesJujubeExpansion,
  ...recipesStonecropExpansion,
  ...recipesDongchimiExpansion,
  ...recipesSeaMustardExpansion,
  ...recipesButterburExpansion,
  ...recipesSoybeanExpansion,
  ...recipesAnchovyExpansion,
  ...recipesQuinceExpansion,
  ...recipesFigExpansion,
  ...recipesMulmegiExpansion,
  ...recipesPeachExpansion,
  ...recipesAutumnRadishExpansion,
  ...recipesAutumnCabbageExpansion,
  ...recipesMustardGreensExpansion,
  ...recipesGwamegiExpansion,
  ...recipesFlatfishExpansion,
  ...recipesTangerineExpansion,
  ...recipesCockleExpansion,
  ...recipesBlueCrabExpansion,
  ...recipesFlowerShrimpExpansion,
  ...recipesLongArmOctopusExpansion,
  ...recipesMungBeanExpansion,
  ...recipesSeaBassExpansion,
  ...recipesOldPumpkinExpansion,
  ...recipesSnowCrabExpansion,
  ...recipesCodExpansion,
  ...recipesLargeShrimpExpansion,
  ...recipesFlounderExpansion,
  ...recipesRedhyangExpansion,
  ...recipesGarlicScapeExpansion,
  ...recipesSeaSquirtExpansion,
  ...recipesMelonExpansion,
  ...recipesRadishSproutExpansion,
  ...recipesCroakerExpansion,
  ...recipesYellowtailExpansion,
  ...recipesIcefishExpansion,
  ...recipesPomfretExpansion,
  ...recipesBarleyExpansion,
  ...recipesBarleyShrimpExpansion,
  ...recipesBlackRaspberryExpansion,
  ...recipesLettuceExpansion,
  ...recipesEggCockleExpansion,
  ...recipesSeaUrchinExpansion,
  ...recipesMulletExpansion,
  ...recipesIxerisExpansion,
  ...recipesAsparagusExpansion,
  ...recipesApricotExpansion,
  ...recipesLotusRootExpansion,
  ...recipesSalmonExpansion,
  ...recipesRockfishExpansion,
  ...recipesBurdockExpansion,
  ...recipesPlumExpansion,
  ...recipesEelExpansion,
  ...recipesHorseMackerelExpansion,
  ...recipesGizzardShadExpansion,
  ...recipesChiveShootsExpansion,
  ...recipesChamnamulExpansion,
  ...recipesCheonhyehyangExpansion,
  ...recipesHerringExpansion,
  ...recipesKiwiExpansion,
  ...recipesTaroExpansion,
  ...recipesGreenGarlicExpansion,
  ...recipesEdamameExpansion,
  ...recipesSwordtipSquidExpansion,
  ...recipesNewRiceExpansion,
  ...recipesNewGarlicExpansion,
  ...recipesHwanggeumhyangExpansion,
  ...recipesBlueberryExpansion,
  ...recipesPomegranateExpansion,
  ...recipesStoneEarExpansion,
  ...recipesWatermelonExpansion,
  ...recipesSilchiExpansion,
  ...recipesIcebergLettuceExpansion,
  ...recipesYeolmuExpansion,
  ...recipesGreenPeasExpansion,
  ...recipesYujaExpansion,
  ...recipesChamoeExpansion,
  ...recipesChodangCornExpansion,
  ...recipesPenShellExpansion,
  ...recipesGrapeExpansion,
  ...recipesGreenChiliExpansion,
  ...recipesHallabongExpansion,
  ...recipesMusselExpansion,
  ...recipesEnokiExpansion,
  ...recipesNeungiExpansion,
];

export function getRecipeById(id: string): Recipe | undefined {
  return allRecipes.find((r) => r.id === id);
}

export function getRecipesByMonth(month: number): Recipe[] {
  return allRecipes.filter((r) => r.month === month);
}

export function getRecipesByIds(ids: string[]): Recipe[] {
  return ids
    .map((id) => getRecipeById(id))
    .filter((r): r is Recipe => r !== undefined);
}

export function searchRecipes(query: string): Recipe[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return allRecipes.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.mainIngredient.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
  );
}

/**
 * 식재료 이름(예: "감자", "햇감자")으로 그 재료를 주재료로 쓰는 레시피를 모두 찾음.
 * 양방향 부분일치 (레시피의 mainIngredient에 입력명이 포함되거나, 입력명에 mainIngredient가 포함).
 */
// 접미사가 같아도 실제로는 서로 다른 별개의 재료인 쌍(오탐 방지용 예외 목록).
// 예: "열무"는 "무"로 끝나지만 무와 다른 채소이므로, 무 페이지에 열무 레시피가
// (또는 그 반대가) 섞여 들어가면 안 됨. "가을무"/"동치미무"는 무의 이표기이므로 제외 대상 아님.
const INGREDIENT_MATCH_EXCEPTIONS: [string, string][] = [
  ['열무', '무'],
];
function isExceptedPair(a: string, b: string): boolean {
  return INGREDIENT_MATCH_EXCEPTIONS.some(
    ([x, y]) => (a === x && b === y) || (a === y && b === x)
  );
}
export function getRecipesByIngredient(ingredientName: string): Recipe[] {
  const normalized = ingredientName.trim();
  if (!normalized) return [];
  // 접미사 매칭만 허용: "알배추"는 "배추"와 매칭되지만(끝이 같음),
  // "배"는 "알배추"에 글자가 포함되어도 끝이 다르므로 매칭되지 않음.
  // 단순 includes()는 "배"가 "알배추" 안에 글자로 들어있다는 이유로
  // 잘못 매칭시키는 버그가 있었음(예: 알배추 페이지에 배 샐러드가 노출).
  return allRecipes.filter((r) => {
    if (r.mainIngredient === normalized) return true;
    if (isExceptedPair(r.mainIngredient, normalized)) return false;
    return r.mainIngredient.endsWith(normalized) || normalized.endsWith(r.mainIngredient);
  });
}

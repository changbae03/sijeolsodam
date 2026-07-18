/**
 * "소담이" 페르소나 정의
 *
 * 이미지 생성, 챗봇 응답, 체크포인트 문구 등 사이트 전반의 AI 생성 콘텐츠가
 * 일관된 톤을 유지하도록 하는 공통 설정입니다. 새로운 AI 기능을 추가할 때는
 * 이 파일의 정의를 참조해서 프롬프트를 작성하세요.
 */

export const SODAMI_PERSONA = {
  name: '소담이',
  description:
    '대한민국 최고의 셰프이자 요리 전문가이자 요리 강사. 24절기와 제철 식재료를 사랑하는, 나긋나긋하고 다정한 사람으로, 정갈하고 따뜻한 한식 가정요리에 진심이며, 누구든 부담 없이 요리할 수 있도록 옆에서 차분히 짚어준다. 낯설거나 외국 요리를 물어봐도 모른다고 하거나 답을 회피하지 않고, 셰프로서의 지식과 경험으로 자신 있고 정확하게, 실제로 따라할 수 있는 수준까지 설명한다.',
  speechStyle:
    '존댓말, "~해보세요", "~랍니다", "~예요" 같은 부드러운 어미를 사용. 단정적이거나 딱딱한 명령형은 피하고, 다정하지만 정확한 정보를 전달.',
} as const;

/**
 * 이미지 생성 시 모든 사진이 공유하는 "시절소담" 비주얼 톤.
 * 레시피 완성샷, 단계별 사진 등 모든 AI 이미지 프롬프트 끝에 덧붙입니다.
 */
export const SODAMI_VISUAL_STYLE = `
SHOT BY A REAL PERSON — this must read as a photograph a skilled food blogger actually took moments after the dish was finished, on a full-frame camera, in one unposed take. Candid, slightly imperfect composition: the plate a touch off-center, the crop not perfectly balanced, one prop half-cut by the frame edge — framed by instinct, not by a studio grid. Include the honest traces of real cooking and real life: a stray crumb or drop of sauce on the table, a faint smudge on the plate rim, steam softly blurring one small area, fine natural sensor grain in the shadows. FORBIDDEN AI TELLS: perfectly centered radial symmetry, immaculate spotless backgrounds, waxy or airbrushed food surfaces, identical repeated elements (every shrimp curled identically, every herb leaf the same), impossibly round bokeh circles, colors that glow from within, floating garnishes, and any 3D-render / illustration / CGI look.

DISH INTEGRITY — the single most important rule: the food must look like a specific, real, correctly-cooked dish that could actually be served, not a generic AI approximation. Every visible ingredient must be anatomically and physically correct (rice grains look like individual rice grains, not a smooth blob; herb leaves have real leaf shapes and veins; sliced vegetables show clean, correctly-shaped cross-sections; meat shows real muscle fiber and grain; braised and steamed dishes keep their solid pieces distinct and intact, never collapsing into a porridge-like mass unless the dish truly is a porridge). Nothing melts, warps, or blends into neighboring ingredients unless that is genuinely how the dish looks (e.g. melted cheese). Garnishes sit exactly where a cook would place them, always in contact with the food or plate. If unsure how a dish traditionally looks, default to its most classic real-world appearance.

APPETITE APPEAL — the photo must make the viewer hungry on sight. Capture the exact peak moment: broths with wisps of steam and glistening surface fat, glazes caught mid-drip with real shine, sear and char marks dark and defined, rice with a faint gloss, crispy skin visibly crackled, runny yolk if that is how the dish is served, herbs freshly cut. Shoot close enough that texture is unmistakable — the viewer should almost feel the crunch or the softness. Colors read vivid and fresh through the natural saturation of properly cooked ingredients, never through artificial "food ad" oversaturation. The dish looks generously portioned and plated seconds ago — never dried out, cold, or sitting.

CAMERA & GRADE (identical across every image — this is what makes the collection one photographer's work): full-frame camera, 50mm lens, shallow depth of field (f/2.0–f/2.8), plate sharp and background softly out of focus, camera usually at a 35–45 degree angle above the plate, but drop lower (20–30) for tall or stacked plates and go overhead (90) when a flat, composed fine-dining plate reads best that way, soft natural window light from the upper-left, gentle shadows, no flash. One consistent warm, slightly muted film-like color grade on every single image — think a quiet seasonal cooking magazine, never a fast-food ad.

SETTING FOLLOWS THE DISH — first, the serving vessel must be whatever this specific dish is actually served in (a wide shallow bowl for a clear consommé, a deep bowl for a stew, a flat plate for seared or sauced fine-dining plates, a ttukbaegi only for dishes truly served bubbling in one). Then the tabletop and props must belong to the place and register this dish is actually from, as if the photographer traveled there and shot it where it is really eaten. FINE-DINING dishes (chef collection): large white/stone plate or wide shallow bowl with generous negative space, restrained sauce work, clean restaurant table (pale linen, dark wood, or stone), quiet and precise — regardless of the cuisine's home setting. Korean home dishes: a Korean home kitchen table — worn wood or modest stone, ttukbaegi earthenware or stainless/plain ceramic bowls, a Korean spoon and chopsticks resting nearby, perhaps one small banchan dish softly blurred at the frame edge. Korean traditional/royal dishes: dark lacquered wood, brass (bangjja) or white porcelain. Japanese: dark ceramic or textured stoneware on dark wood, chopsticks on a rest. Chinese: simple porcelain on a round household table. Thai / Vietnamese / Southeast Asian: stainless or floral-rimmed plates, banana leaf accents, a weathered street-side or open-kitchen table in warm daylight. Italian / French / Western: rustic trattoria or bistro wood, simple white plate, crumpled linen, maybe torn bread nearby. Desserts and drinks: a calm cafe or home table. Always ONE hero dish with at most two quiet, cuisine-native props — nothing that competes with the food. VARIETY IS MANDATORY: the settings listed above are starting points, not a fixed prop kit. Choose tableware shape, color, and material that THIS dish calls for; vary or omit napkins, spoons, and side props from image to image; vary which side the light falls from within soft natural light; never repeat the exact same wooden-spoon-plus-green-linen arrangement as a default. Across a series, two photos should never look like the same table merely reloaded with different food. For raw seasonal-ingredient shots (no cooked dish), keep the original Korean seasonal home setting: warm cream or aged wooden table, plain ceramic, sage or terracotta linen.

FRAMING: the finished dish fills most of the frame and is clearly the single subject — no other complete dishes, no people.

CRITICAL — absolutely no text anywhere in the image: no labels, tags, cards, handwriting, printed text, watermarks, logos, or signage in any language. No object whose purpose is to display text (paper tags, notecards, chalkboards, labeled packaging). No visible human faces or hands.`;

/**
 * 텍스트 생성(챗봇, 체크포인트 등)에서 공유하는 시스템 지침 조각.
 * 각 기능의 프롬프트에 이어붙여 사용하세요.
 */
export const SODAMI_TEXT_PERSONA_PROMPT = `당신은 "${SODAMI_PERSONA.name}"입니다. ${SODAMI_PERSONA.description} 말투: ${SODAMI_PERSONA.speechStyle}`;

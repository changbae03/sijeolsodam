/** 한글 단어 뒤에 붙는 조사를 받침 유무에 따라 자동으로 골라준다.
 * 예: josa('그라탕', '은/는') -> '은', josa('파스타', '은/는') -> '는' */
function hasBatchim(word: string): boolean {
  const lastChar = word.trim().slice(-1);
  const code = lastChar.charCodeAt(0);
  // 완성형 한글(가-힣) 범위 밖이면(영문/숫자 등) 받침 없는 것으로 간주
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

type JosaPair = '은/는' | '이/가' | '을/를' | '과/와';

export function josa(word: string, pair: JosaPair): string {
  const withBatchim = hasBatchim(word);
  switch (pair) {
    case '은/는':
      return withBatchim ? '은' : '는';
    case '이/가':
      return withBatchim ? '이' : '가';
    case '을/를':
      return withBatchim ? '을' : '를';
    case '과/와':
      return withBatchim ? '과' : '와';
  }
}

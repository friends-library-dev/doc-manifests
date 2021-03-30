import { toRoman } from 'roman-numerals';

export function addVolumeSuffix(str: string, volIdx?: number): string {
  if (typeof volIdx === `number`) {
    return `${str} &#8212; Vol. ${toRoman(volIdx + 1)}`;
  }
  return str;
}

export function rangeFromVolIdx(
  splits: number[],
  volIdx?: number,
): [startIdx: number, endIdx: number] {
  if (typeof volIdx !== `number`) {
    return [0, Infinity];
  }

  const startIdx = splits[volIdx - 1] || 0;
  const endIdx = splits[volIdx] || Infinity;

  return [startIdx, endIdx];
}

import { describe, it } from '@jest/globals';
import { rangeFromVolIdx } from '../faux-volumes';

describe(`rangeFromVolIdx()`, () => {
  it(`returns zero, infinity for undefined volume index`, () => {
    expect(rangeFromVolIdx([3], undefined)).toMatchObject([0, Infinity]);
  });

  it(`returns zero, infinity for empty splits`, () => {
    expect(rangeFromVolIdx([], 0)).toMatchObject([0, Infinity]);
  });

  it(`returns contiguous ranges for a split`, () => {
    expect(rangeFromVolIdx([45], 0)).toMatchObject([0, 45]);
    expect(rangeFromVolIdx([45], 1)).toMatchObject([45, Infinity]);
  });
});

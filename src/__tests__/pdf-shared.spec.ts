import { DocPrecursor } from '@friends-library/types';
import { describe, expect, it } from '@jest/globals';
import { runningHead } from '../pdf-shared';

describe(`runningHead()`, () => {
  it(`uses author name for single-chapter work`, () => {
    const dpc = { meta: { author: { name: `Bob Smith` } }, config: {} } as DocPrecursor;
    expect(runningHead(dpc, 1)).toBe(`Bob Smith`);
  });

  it(`title is pre-processed using adoc-utils/utf8ShortTitle`, () => {
    const dpc = { meta: { title: `Works -- Vol. 1` }, config: {} };
    expect(runningHead(dpc as DocPrecursor, 2)).toBe(`Works – Vol. I`);
  });
});

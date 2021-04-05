import { describe, test, expect } from '@jest/globals';
import { genericDpc } from '@friends-library/types';
import { copyright } from '../frontmatter';

describe(`copyright()`, () => {
  test(`english copyright`, () => {
    expect(copyright(genericDpc())).toMatchSnapshot();
  });

  test(`spanish copyright`, () => {
    const dpc = genericDpc();
    dpc.lang = `es`;
    expect(copyright(dpc)).toMatchSnapshot();
  });
});

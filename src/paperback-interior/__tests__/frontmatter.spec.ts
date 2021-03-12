import { useMultiColLayout } from '../frontmatter';
import { ChapterResult } from '../../../../evaluator/dist';

describe(`useMultiColLayout()`, () => {
  const BARE_TITLE = new ChapterResult(0, ``, `Preface`, false, undefined, `Preface`);
  const INTERMEDIATE_TITLE = new ChapterResult(1, ``, `V. II`, true, undefined, `V. II`);
  const BARE_CHAPTER = new ChapterResult(2, ``, `Chapter 2`, false, 2);
  const NAMED_CHAPTER = new ChapterResult(3, ``, `Travels`, false, 3, `Travels`);

  test(`doc with mostly named chapters should use multi-col layout`, () => {
    const doc = [BARE_TITLE, NAMED_CHAPTER, NAMED_CHAPTER, NAMED_CHAPTER, NAMED_CHAPTER];
    expect(useMultiColLayout(doc)).toBe(true);
  });

  test(`doc with mostly bare chapters should not use multi-col layout`, () => {
    const doc = [BARE_TITLE, BARE_CHAPTER, BARE_CHAPTER, BARE_CHAPTER, BARE_CHAPTER];
    expect(useMultiColLayout(doc)).toBe(false);
  });

  test(`doc with only bare title sections should not use multi-col layout`, () => {
    const doc = [BARE_TITLE, BARE_TITLE, BARE_TITLE, BARE_TITLE, BARE_TITLE];
    expect(useMultiColLayout(doc)).toBe(false);
  });

  test(`doc with without majority of named chapters should not use multi-col`, () => {
    const doc = [BARE_TITLE, BARE_CHAPTER, BARE_CHAPTER, NAMED_CHAPTER, NAMED_CHAPTER];
    expect(useMultiColLayout(doc)).toBe(false);
  });

  test(`intermediate titles are not counted when determining layout`, () => {
    const doc = [
      BARE_TITLE,
      INTERMEDIATE_TITLE,
      NAMED_CHAPTER,
      INTERMEDIATE_TITLE,
      NAMED_CHAPTER,
      INTERMEDIATE_TITLE,
      NAMED_CHAPTER,
      INTERMEDIATE_TITLE,
      NAMED_CHAPTER,
    ];
    expect(useMultiColLayout(doc)).toBe(true);
  });
});

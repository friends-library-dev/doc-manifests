import { describe, it, expect } from '@jest/globals';
import { DocPrecursor, genericDpc, Lang } from '@friends-library/types';
import { evaluate } from '@friends-library/evaluator';
import { packageDocument } from '../package-document';

describe(`packageDocument()`, () => {
  it(`outputs correct string (English)`, () => {
    const dpc = dpcFromAdoc(`== Chapter 1\n\nHello world.\n`);
    const src = evaluate.toEbookSrcHtml(dpc);
    const conf = { frontmatter: true, subType: `epub` } as const;
    expect(packageDocument(dpc, conf, src)).toMatchSnapshot();
  });

  it(`outputs correct string (Spanish)`, () => {
    const dpc = dpcFromAdoc(`== Capitulo 1\n\nHola world.\n`, `es`);
    const src = evaluate.toEbookSrcHtml(dpc);
    const conf = { frontmatter: true, subType: `epub` } as const;
    expect(packageDocument(dpc, conf, src)).toMatchSnapshot();
  });
});

function dpcFromAdoc(adoc: string, lang: Lang = `en`): DocPrecursor {
  const dpc = genericDpc();
  dpc.lang = lang;
  dpc.asciidocFiles = [{ adoc, filename: `01-journal.adoc` }];
  return dpc;
}

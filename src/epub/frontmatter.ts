import { Html, DocPrecursor, FileManifest, Lang } from '@friends-library/types';
import { frontmatter as commonFrontmatter } from '../frontmatter';
import { ChapterResult, EbookSrcResult } from '@friends-library/evaluator';

function frontmatter(
  dpc: DocPrecursor,
  src: EbookSrcResult,
  target: 'mobi' | 'epub',
): FileManifest {
  const fm = commonFrontmatter(dpc, src);
  fm[`half-title`] = `<div class="half-title-page">${fm[`half-title`]}</div>`;

  if (src.hasFootnotes) {
    fm[`footnote-helper`] = src.footnoteHelperSourceHtml;
  }

  if (target === `mobi` && src.numChapters > 2) {
    fm[`content-toc`] = contentToc(src.chapters, dpc.lang);
  }

  return fm;
}

export default frontmatter;

function contentToc(chapters: ChapterResult[], lang: Lang): Html {
  return `
  <section class="content-toc">
    <h1>${lang === `en` ? `Table of Contents` : `Índice`}</h1>
    ${chapters.map(tocEntry).join(`\n`)}
  </section>`;
}

function tocEntry(chapter: ChapterResult): Html {
  const short = chapter.shortHeading;
  return `
  <div>
    <a href="${chapter.id}.xhtml">
      ${chapter.isIntermediateTitle ? `~ ${short} ~` : short}
    </a>
  </div>`;
}

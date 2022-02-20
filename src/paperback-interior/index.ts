import { paperbackInterior as paperbackInteriorCss } from '@friends-library/doc-css';
import { DocPrecursor, FileManifest, PrintSize } from '@friends-library/types';
import { getPrintSizeDetails } from '@friends-library/lulu';
import { evaluate as eval, PdfSrcResult } from '@friends-library/evaluator';
import wrapHtmlBody from '../utils';
import frontmatter from './frontmatter';
import { lineSvgMarkup, runningHead } from '../pdf-shared';
import { getCustomCss } from '../custom-css';
import { rangeFromVolIdx } from '../faux-volumes';
import { PaperbackInteriorConfig } from '../types';

export default async function paperbackInteriorManifests(
  dpc: DocPrecursor,
  conf: PaperbackInteriorConfig,
): Promise<FileManifest[]> {
  const src = eval.toPdfSrcHtml(dpc);

  const css = paperbackInteriorCss({
    runningHeadTitle: runningHead(dpc, src.numChapters),
    numFootnotes: src.numFootnotes,
    printSize: conf.printSize,
    customCss: getCustomCss(dpc.customCode.css, `paperback-interior`),
    condense: conf.condense,
  });

  if (conf.allowSplits === false || dpc.paperbackSplits.length === 0) {
    return [
      {
        'doc.html': wrapHtml(pdfHtml(src, dpc, conf.frontmatter), dpc, conf.printSize),
        'doc.css': css,
        'line.svg': lineSvgMarkup(),
      },
    ];
  }

  return [...dpc.paperbackSplits, Infinity].map((_, volIdx) => {
    return {
      'doc.html': wrapHtml(
        pdfHtml(src, dpc, conf.frontmatter, volIdx),
        dpc,
        conf.printSize,
      ),
      'doc.css': css,
      'line.svg': lineSvgMarkup(),
    };
  });
}

function pdfHtml(
  src: PdfSrcResult,
  dpc: DocPrecursor,
  includeFrontmatter: boolean,
  volIdx?: number,
): string {
  const [chStartIdx, chEndIdx] = rangeFromVolIdx(dpc.paperbackSplits, volIdx);
  const frontmatterHtml = includeFrontmatter ? frontmatter(dpc, src, volIdx) : ``;
  const bodyHtml = src.mergedChapterHtml(chStartIdx, chEndIdx);
  return frontmatterHtml + bodyHtml;
}

function wrapHtml(html: string, dpc: DocPrecursor, printSize: PrintSize): string {
  const { abbrev } = getPrintSizeDetails(printSize);
  return wrapHtmlBody(html, {
    title: dpc.meta.title,
    css: [`doc.css`],
    bodyClass: `body trim--${abbrev}`,
    htmlAttrs: `lang="${dpc.lang}"`,
  });
}

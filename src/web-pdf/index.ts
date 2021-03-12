import { webPdf as css } from '@friends-library/doc-css';
import { DocPrecursor, Html, FileManifest } from '@friends-library/types';
import wrapHtmlBody from '../utils';
import { lineSvgMarkup } from '../pdf-shared';
import { evaluate as eval } from '../../../evaluator/dist';
import { getCustomCss } from '../custom-css';

export default async function webPdfManifests(
  dpc: DocPrecursor,
): Promise<FileManifest[]> {
  const result = eval.toPdfSrcHtml(dpc);
  return [
    {
      'doc.html': wrapHtml(result.mergedChapterHtml(), dpc),
      'doc.css': css({ customCss: getCustomCss(dpc.customCode.css, `web-pdf`) }),
      'line.svg': lineSvgMarkup(),
    },
  ];
}

function wrapHtml(inner: Html, dpc: DocPrecursor): Html {
  return wrapHtmlBody(inner, {
    title: dpc.meta.title,
    css: [`doc.css`],
    bodyClass: `body`,
    htmlAttrs: `lang="${dpc.lang}"`,
  });
}

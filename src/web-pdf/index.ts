import { webPdf as css } from '@friends-library/doc-css';
import flow from 'lodash/flow';
import { DocPrecursor, Html, FileManifest } from '@friends-library/types';
import { removeMobi7Tags } from '@friends-library/doc-html';
import wrapHtmlBody from '../wrap-html';
import {
  lineSvgMarkup,
  joinSections,
  inlineNotes,
  HtmlStep,
  HtmlStepConfig,
} from '../pdf-shared';
import { html as evalHtml } from '../../../evaluator/dist';

export default async function webPdfManifests(
  dpc: DocPrecursor,
): Promise<FileManifest[]> {
  const conf = { frontmatter: false, condense: false, allowSplits: false };
  const { chapters } = evalHtml(dpc);
  const mannys = [
    {
      'doc.html': wrapHtml([chapters.join(``), dpc, conf])[0],
      'doc.css': css({ runningHeadTitle: `roflcopter` }),
      'line.svg': lineSvgMarkup(),
    },
  ];
  return mannys;
}

function html(dpc: DocPrecursor, conf: HtmlStepConfig, volIdx?: number): Html {
  return flow([
    joinSections,
    inlineNotes,
    ([html, d, c, i]) => [removeMobi7Tags(html), d, c, i],
    wrapHtml,
  ])([``, dpc, conf, volIdx])[0];
}

const wrapHtml: HtmlStep = ([html, dpc, conf, volIdx]) => {
  const wrapped = wrapHtmlBody(html, {
    title: dpc.meta.title,
    css: [`doc.css`],
    bodyClass: `body`,
    htmlAttrs: `lang="${dpc.lang}"`,
  });
  return [wrapped, dpc, conf, volIdx];
};

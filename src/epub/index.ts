import {
  Xml,
  DocPrecursor,
  EbookConfig,
  FileManifest,
  Html,
  Lang,
} from '@friends-library/types';
import { mobi as mobiCss, epub as epubCss } from '@friends-library/doc-css';
import { packageDocument } from './package-document';
import wrapHtmlBody from '../utils';
import { nav } from './nav';
import ebookFrontmatter from './frontmatter';
import { evaluate as eval, EbookSrcResult } from '@friends-library/evaluator';
import { getCustomCss } from '../custom-css';

export default async function ebook(
  dpc: DocPrecursor,
  conf: EbookConfig,
): Promise<FileManifest[]> {
  const src = eval.toEbookSrcHtml(dpc);
  const customCss = getCustomCss(dpc.customCode.css, conf.subType);
  const config = { customCss };
  return [
    {
      mimetype: `application/epub+zip`,
      'META-INF/container.xml': container(),
      'OEBPS/style.css': conf.subType === `epub` ? epubCss(config) : mobiCss(config),
      'OEBPS/package-document.opf': packageDocument(dpc, conf, src),
      'OEBPS/nav.xhtml': wrapEbookBodyHtml(nav(dpc, conf, src), dpc.lang),
      ...coverFiles(dpc, conf.coverImg),
      ...sectionFiles(src, dpc.lang),
      ...notesFile(src, dpc.lang),
      ...frontmatterFiles(dpc, conf, src),
    },
  ];
}

function coverFiles(dpc: DocPrecursor, coverImg?: Buffer): FileManifest {
  if (!coverImg) return {};
  return {
    'OEBPS/cover.png': coverImg,
    'OEBPS/cover.xhtml': wrapEbookBodyHtml(
      `<figure><img alt="Cover" src="cover.png"/></figure>`,
      dpc.lang,
      `cover`,
    ),
  };
}

function container(): Xml {
  return `
<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/package-document.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>
  `.trim();
}

function wrapEbookBodyHtml(bodyHtml: Html, lang: Lang, bodyClass?: string): Html {
  return wrapHtmlBody(bodyHtml, {
    htmlAttrs: `xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${lang}" lang="${lang}"`,
    css: [`style.css`],
    isUtf8: true,
    ...(bodyClass ? { bodyClass } : {}),
  });
}

function sectionFiles(src: EbookSrcResult, lang: Lang): Record<string, Html> {
  const files: Record<string, Html> = {};
  src.chapters.forEach(({ content: html }, index) => {
    files[`OEBPS/chapter-${index + 1}.xhtml`] = wrapEbookBodyHtml(html, lang);
  });
  return files;
}

function notesFile(src: EbookSrcResult, lang: Lang): Record<string, Html> {
  if (!src.hasFootnotes) {
    return {};
  }
  return {
    'OEBPS/notes.xhtml': wrapEbookBodyHtml(src.notesContentHtml, lang),
  };
}

function frontmatterFiles(
  dpc: DocPrecursor,
  conf: EbookConfig,
  src: EbookSrcResult,
): Record<string, Html> {
  return Object.entries(ebookFrontmatter(dpc, src, conf.subType)).reduce(
    (files, [slug, html]) => {
      files[`OEBPS/${slug}.xhtml`] = wrapEbookBodyHtml(String(html), dpc.lang);
      return files;
    },
    {} as Record<string, Html>,
  );
}

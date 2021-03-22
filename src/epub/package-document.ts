import moment from 'moment';
import { Xml, DocPrecursor, EbookConfig } from '@friends-library/types';
import ebookFrontmatter from './frontmatter';
import { EbookSrcResult } from '@friends-library/evaluator';

export function packageDocument(
  dpc: DocPrecursor,
  conf: EbookConfig,
  src: EbookSrcResult,
): Xml {
  const {
    lang,
    isCompilation,
    revision: { timestamp },
    meta: {
      author: { name, nameSort },
      title,
    },
  } = dpc;
  const modified = moment.utc(moment.unix(timestamp)).format(`YYYY-MM-DDThh:mm:ss[Z]`);
  const randomize = conf.randomizeForLocalTesting;
  const randomizer = ` (${moment().format(`h:mm:ss`)})`;
  const publisher =
    lang === `en` ? `The Friends Library` : `La Biblioteca de los Amigios`;

  return `
<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:language id="pub-language">${lang}</dc:language>
  <dc:identifier id="pub-id">friends-library/${
    randomize ? Date.now() : `${dpc.documentId}/${dpc.editionType}`
  }</dc:identifier>
  <dc:title id="pub-title">${title}${randomize ? `` : randomizer}</dc:title>
  <dc:creator id="author">${isCompilation ? publisher : name}</dc:creator>
  <dc:publisher>${publisher}</dc:publisher>
  <dc:subject>${lang === `en` ? `Quakers` : `Cuáqueros`}</dc:subject>
  <dc:subject>${
    lang === `en` ? `Religious Society of Friends` : `La Sociedad de Amigos (Cuáqueros)`
  }</dc:subject>
  <dc:rights>${
    lang === `en`
      ? `Public domain in the USA.`
      : `Dominio público en los Estados Unidos de América`
  }</dc:rights>
  ${isCompilation ? `` : `<meta property="file-as" refines="#author">${nameSort}</meta>`}
  <meta property="dcterms:modified">${modified}</meta>
  ${conf.coverImg ? `<meta name="cover" content="cover-img" />` : ``}
</metadata>
<manifest>
  ${[...manifestItems(dpc, conf, src)]
    .map(([id, data]) => `<item id="${id}" ${attrs(data)}/>`)
    .join(`\n  `)}
</manifest>
<spine>
  ${spineItems(dpc, conf, src)
    .map((id) => `<itemref idref="${id}"/>`)
    .join(`\n  `)}
</spine>
</package>
`.trim();
}

function attrs(data: Record<string, any>): string {
  return Object.entries(data)
    .reduce((acc, [key, val]) => {
      acc.push(`${key}="${String(val)}"`);
      return acc;
    }, [] as string[])
    .join(` `);
}

interface Item {
  href: string;
  'media-type': 'text/css' | 'application/xhtml+xml' | 'image/png' | 'image/jpeg';
  properties?: string;
}

export function manifestItems(
  dpc: DocPrecursor,
  conf: EbookConfig,
  src: EbookSrcResult,
): Map<string, Item> {
  const items = new Map<string, Item>();

  items.set(`css`, {
    href: `style.css`,
    'media-type': `text/css`,
  });

  if (conf.coverImg) {
    items.set(`cover-img`, {
      href: `cover.png`,
      'media-type': `image/png`,
      properties: `cover-image`,
    });

    items.set(`cover`, {
      href: `cover.xhtml`,
      'media-type': `application/xhtml+xml`,
    });
  }

  items.set(`nav`, {
    href: `nav.xhtml`,
    'media-type': `application/xhtml+xml`,
    properties: `nav`,
  });

  for (let num = 1; num <= src.numChapters; num++) {
    const id = `chapter-${num}`;
    items.set(id, {
      href: `${id}.xhtml`,
      'media-type': `application/xhtml+xml`,
    });
  }

  if (src.hasFootnotes) {
    items.set(`notes`, {
      href: `notes.xhtml`,
      'media-type': `application/xhtml+xml`,
    });
  }

  Object.keys(ebookFrontmatter(dpc, src, conf.subType)).forEach((slug) =>
    items.set(slug, {
      href: `${slug}.xhtml`,
      'media-type': `application/xhtml+xml`,
    }),
  );

  return items;
}

export function spineItems(
  dpc: DocPrecursor,
  conf: EbookConfig,
  src: EbookSrcResult,
): string[] {
  let items = Object.keys(ebookFrontmatter(dpc, src, conf.subType));
  items = items.concat(
    src.chapters.map((_, idx) => {
      return `chapter-${idx + 1}`;
    }),
  );

  if (src.hasFootnotes) {
    items.push(`notes`);
  }

  if (conf.coverImg) {
    items.unshift(`cover`);
  }

  return items;
}

import { Html, DocPrecursor, EbookConfig, Lang } from '@friends-library/types';
import { EbookSrcResult } from '@friends-library/evaluator';

interface TocItem {
  href: string;
  text: string;
  hidden?: true;
}

interface Landmark {
  type: 'toc' | 'titlepage' | 'bodymatter';
  href: 'nav.xhtml' | 'half-title.xhtml' | 'chapter-1.xhtml';
  text: string;
}

export function nav(dpc: DocPrecursor, conf: EbookConfig, src: EbookSrcResult): Html {
  if (src.numChapters === 1) {
    return `<nav epub:type="toc" id="toc"><ol></ol></nav>`;
  }

  return `
    <nav epub:type="toc" id="toc">
      <h2>${dpc.lang === `en` ? `Table of Contents` : `Índice`}</h2>
      <ol>
        ${tocItems(dpc, src).map(tocItemMarkup).join(`\n`)}
      </ol>
    </nav>
    <nav epub:type="landmarks" hidden="">
      <ol>
        ${landmarks(conf, dpc.lang).map(landmarkItemMarkup).join(`\n`)}
      </ol>
    </nav>`;
}

function tocItemMarkup(item: TocItem): Html {
  const hidden = item.hidden ? ` hidden=""` : ``;
  return `<li${hidden}><a href="${item.href}">${item.text}</a></li>`;
}

function landmarkItemMarkup(item: Landmark): Html {
  return `<li><a href="${item.href}" epub:type="${item.type}">${item.text}</a></li>`;
}

export function tocItems({ lang }: DocPrecursor, src: EbookSrcResult): TocItem[] {
  const items: TocItem[] = [];

  items.push({
    hidden: true,
    href: `half-title.xhtml`,
    text: lang === `en` ? `Title page` : `Portada`,
  });

  src.chapters.forEach((chapter, idx) => {
    const text = chapter.shortHeading;
    items.push({
      href: `chapter-${idx + 1}.xhtml`,
      text: chapter.isIntermediateTitle ? `~ ${text} ~` : text,
    });
  });

  return items;
}

export function landmarks({ subType, frontmatter }: EbookConfig, lang: Lang): Landmark[] {
  const landmarkItems: Landmark[] = [];

  landmarkItems.push({
    type: `titlepage`,
    href: `half-title.xhtml`,
    text: lang === `en` ? `Title page` : `Portada`,
  });

  if (subType === `mobi`) {
    landmarkItems.push({
      type: `toc`,
      href: `nav.xhtml`,
      text: lang === `en` ? `Table of Contents` : `Índice`,
    });
  }

  landmarkItems.push({
    type: `bodymatter`,
    href: frontmatter ? `half-title.xhtml` : `chapter-1.xhtml`,
    text: lang === `en` ? `Beginning` : `Comenzando`,
  });

  return landmarkItems;
}

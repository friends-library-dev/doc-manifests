import { Lang } from '@friends-library/types';

export default function wrapHtmlBody(
  bodyHtml: string,
  opts: {
    htmlAttrs?: string;
    isUtf8?: boolean;
    css?: string[];
    title?: string;
    bodyClass?: string;
  } = {},
): string {
  return `
    <!DOCTYPE html>
    <html${opts.htmlAttrs ? ` ${opts.htmlAttrs.trim()}` : ``}>
    <head>
      ${opts.isUtf8 ? `<meta charset="UTF-8"/>` : ``}
      ${opts.title ? `<title>${opts.title}</title>` : ``}
      ${(opts.css || []).map(
        (href) => `<link href="${href}" rel="stylesheet" type="text/css" />`,
      )}
    </head>
    <body${opts.bodyClass ? ` class="${opts.bodyClass}"` : ``}>
      ${bodyHtml.trim()}
    </body>
    </html>
  `;
}

const smallEn = `a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|via`.split(`|`);
const smallEs = `a|un|una|el|la|los|las|y|e|o|con|de|del|al|por|si|en|que`.split(`|`);

export function capitalizeTitle(str: string, lang: Lang): string {
  const small = lang === `en` ? smallEn : smallEs;
  return str
    .split(` `)
    .map((word, index, parts) => {
      if (index === 0 || index === parts.length - 1) {
        return ucfirst(word);
      }
      return small.includes(word.toLowerCase()) ? word : ucfirst(word);
    })
    .join(` `);
}

export function ucfirst(lower: string): string {
  return lower.replace(/^\w/, (c) => c.toUpperCase());
}

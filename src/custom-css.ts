import { Css, DocPrecursor, ArtifactType } from '@friends-library/types';

export function getCustomCss(
  customCss: DocPrecursor['customCode']['css'],
  type: ArtifactType,
): Css | undefined {
  const cssChunks = [customCss.all ?? ``];

  if ([`paperback-interior`, `web-pdf`].includes(type) && customCss.pdf !== undefined) {
    cssChunks.push(customCss.pdf);
  }

  if ([`epub`, `mobi`].includes(type) && customCss.ebook !== undefined) {
    cssChunks.push(customCss.ebook);
  }

  if (typeof customCss[type] === `string`) {
    cssChunks.push(customCss[type] ?? ``);
  }

  return cssChunks.length === 0 ? undefined : cssChunks.join(`\n\n`);
}

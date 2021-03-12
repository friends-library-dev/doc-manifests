import { Html, Lang, DocPrecursor, DocSection } from '@friends-library/types';
import { br7 } from '@friends-library/doc-html';

const symbolMap = new Map([
  [1, `§`],
  [2, `*`],
  [3, `†`],
  [4, `‡`],
]);

// function makeGetRef({ notes }: DocPrecursor): (num: number) => number | string {
//   return (num: number) => (useSymbols(notes) ? symbolMap.get(num) || `` : num);
// }

// export function useSymbols(notes: Notes): boolean {
//   return notes.size < 4;
// }

export function makeFootnoteCallReplacer(dpc: DocPrecursor): (html: Html) => Html {
  // let number = 2; // starts at two to make room for dynamically inserted helper note
  // const getRef = makeGetRef(dpc);
  // return (html: Html): Html => {
  //   return html.replace(/{% note: ([a-z0-9-]+) %}/gim, (_, id) =>
  //     callMarkup(id, getRef(number++)),
  //   );
  // };
  return () => `@TODO, delete?`;
}

export function callMarkup(id: string, ref: string | number, withId = true): Html {
  // TODO spanish "View footnote"
  return [
    `<sup class="footnote"${withId ? ` id="fn-call__${id}"` : ``}>`,
    `<a href="notes.xhtml#fn__${id}" title="View footnote.">`,
    ref,
    `</a>`,
    `</sup>`,
  ].join(``);
}

export function notesMarkup(dpc: DocPrecursor): Html {
  return `@TODO delete me, i thinK?`;
  //   const { lang, notes } = dpc;
  //   // const locations = getNoteLocations(sections);
  //   // TODO, reimplment
  //   const locations: Map<string, string> = new Map();
  //   const helperNote = getHelperNote(useSymbols(notes), lang);
  //   const getRef = makeGetRef(dpc);
  //   return `
  //     <div id="footnotes">
  //       <div class="footnote" id="fn__helper-note">
  //         <a href="footnote-helper.xhtml#fn-call__helper-note">${getRef(
  //           1,
  //         )}</a> ${helperNote}
  //         <a href="footnote-helper.xhtml#fn-call__helper-note">\u23CE</a>
  //         ${br7}
  //         ${br7}
  //       </div>
  //       ${[...notes]
  //         .map(
  //           ([id, note], index) =>
  //             `<div class="footnote" id="fn__${id}">
  //           <a href="${locations.get(id) || ``}.xhtml#fn-call__${id}">${getRef(
  //               index + 2,
  //             )}</a> ${note}
  //           <a href="${locations.get(id) || ``}.xhtml#fn-call__${id}">\u23CE</a>
  //           ${br7}
  //           ${br7}
  //         </div>`,
  //         )
  //         .join(`\n      `)}
  //     </div>
  // `.trim();
}

function getNoteLocations(sections: DocSection[]): Map<string, string> {
  return sections.reduce((locations, section) => {
    let match: RegExpExecArray | null = null;
    const regex = /{% note: ([a-z0-9-]+) %}/gim;
    while ((match = regex.exec(section.html))) {
      const [, noteId] = match;
      locations.set(noteId, section.id);
    }
    return locations;
  }, new Map());
}

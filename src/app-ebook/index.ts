import { DocPrecursor, FileManifest } from '@friends-library/types';
import { evaluate as eval } from '@friends-library/evaluator';

export default async function appEbook(dpc: DocPrecursor): Promise<FileManifest[]> {
  const src = eval.toPdfSrcHtml(dpc);
  return [{ file: src.mergedChapterHtml() }];
}

import { DocPrecursor, FileManifest } from '@friends-library/types';
import { evaluate } from '@friends-library/evaluator';

export default async function speech(dpc: DocPrecursor): Promise<FileManifest[]> {
  return [
    {
      file: evaluate.toSpeechText(dpc),
    },
  ];
}

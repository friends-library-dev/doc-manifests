import { DocPrecursor, FileManifest } from '@friends-library/types';
import { speech as evaluateSpeech } from '../../../evaluator/dist';

export default async function speech(dpc: DocPrecursor): Promise<FileManifest[]> {
  return [
    {
      file: evaluateSpeech(dpc),
    },
  ];
}

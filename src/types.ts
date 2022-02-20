import { PrintSize } from '@friends-library/types';

export interface PaperbackInteriorConfig {
  printSize: PrintSize;
  frontmatter: boolean;
  condense: boolean;
  allowSplits: boolean;
}

export interface PaperbackCoverConfig {
  printSize: PrintSize;
  volumes: number[];
  showGuides?: boolean;
}

export interface EbookConfig {
  frontmatter: boolean;
  subType: 'epub' | 'mobi';
  coverImg?: Buffer;
  randomizeForLocalTesting?: boolean;
}

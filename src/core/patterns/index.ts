import { squarePattern } from './square';
import { zigzagFestoonPattern } from './zigzag-festoon';
import { diagonalFestoonPattern } from './diagonal-festoon';
import { jumpingFestoonPattern } from './jumping-festoon';
import { alternatingHalfHitchPattern } from './alternating-half-hitch';
import { vFestoonChevronPattern } from './v-festoon-chevron';
import { classicChevronPattern } from './chevron';
import { alternating2ThreadPattern } from './alternating-2-thread';
import { diagonalPairs6Pattern } from './diagonal-pairs-6';
import type { Pattern } from '../types';

export const PATTERNS: Record<string, Pattern> = {
  [squarePattern.id]: squarePattern,
  [diagonalPairs6Pattern.id]: diagonalPairs6Pattern,
  [alternating2ThreadPattern.id]: alternating2ThreadPattern,
  [zigzagFestoonPattern.id]: zigzagFestoonPattern,
  [diagonalFestoonPattern.id]: diagonalFestoonPattern,
  [jumpingFestoonPattern.id]: jumpingFestoonPattern,
  [alternatingHalfHitchPattern.id]: alternatingHalfHitchPattern,
  [vFestoonChevronPattern.id]: vFestoonChevronPattern,
  [classicChevronPattern.id]: classicChevronPattern
};

export const PATTERN_LIST = Object.values(PATTERNS);

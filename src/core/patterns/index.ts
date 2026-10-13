import { squarePattern } from './square';
import { zigzagFestoonPattern } from './zigzag-festoon';
import { diagonalFestoonPattern } from './diagonal-festoon';
import { jumpingFestoonPattern } from './jumping-festoon';
import { alternatingHalfHitchPattern } from './alternating-half-hitch';
import { vFestoonChevronPattern } from './v-festoon-chevron';
import { classicChevronPattern } from './chevron';
import { alternating2ThreadPattern } from './alternating-2-thread';
import { diagonalPairs6Pattern } from './diagonal-pairs-6';
import { symmetricFestoon4Pattern } from './feston-simetrico-4';
import type { Pattern } from '../types';

export const PATTERNS: Record<string, Pattern> = {
  [diagonalFestoonPattern.id]: diagonalFestoonPattern,
  [symmetricFestoon4Pattern.id]: symmetricFestoon4Pattern,
  [diagonalPairs6Pattern.id]: diagonalPairs6Pattern,
  [alternating2ThreadPattern.id]: alternating2ThreadPattern,
  [zigzagFestoonPattern.id]: zigzagFestoonPattern,
  [jumpingFestoonPattern.id]: jumpingFestoonPattern,
  [alternatingHalfHitchPattern.id]: alternatingHalfHitchPattern,
  [vFestoonChevronPattern.id]: vFestoonChevronPattern,
  [classicChevronPattern.id]: classicChevronPattern,
  [squarePattern.id]: squarePattern
};

export const PATTERN_LIST = Object.values(PATTERNS);
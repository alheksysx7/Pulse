import { squarePattern } from './square';
import { zigzagFestoonPattern } from './zigzag-festoon';
import { diagonalFestoonPattern } from './diagonal-festoon';
import { jumpingFestoonPattern } from './jumping-festoon';
import { alternatingHalfHitchPattern } from './alternating-half-hitch';
import type { Pattern } from '../types';

export const PATTERNS: Record<string, Pattern> = {
  [squarePattern.id]: squarePattern,
  [zigzagFestoonPattern.id]: zigzagFestoonPattern,
  [diagonalFestoonPattern.id]: diagonalFestoonPattern,
  [jumpingFestoonPattern.id]: jumpingFestoonPattern,
  [alternatingHalfHitchPattern.id]: alternatingHalfHitchPattern
};

export const PATTERN_LIST = Object.values(PATTERNS);

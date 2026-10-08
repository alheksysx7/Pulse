import { squarePattern } from './square';
import { squareAlternatingPattern } from './square-alternating';
import { zigzagFestoonPattern } from './zigzag-festoon';
import { diagonalFestoonPattern } from './diagonal-festoon';
import { jumpingFestoonPattern } from './jumping-festoon';
import type { Pattern } from '../types';

export const PATTERNS: Record<string, Pattern> = {
  [squarePattern.id]: squarePattern,
  [squareAlternatingPattern.id]: squareAlternatingPattern,
  [zigzagFestoonPattern.id]: zigzagFestoonPattern,
  [diagonalFestoonPattern.id]: diagonalFestoonPattern,
  [jumpingFestoonPattern.id]: jumpingFestoonPattern
};

export const PATTERN_LIST = Object.values(PATTERNS);

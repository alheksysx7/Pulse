import { squarePattern } from './square';
import { squareAlternatingPattern } from './square-alternating';
import { zigzagFestoonPattern } from './zigzag-festoon';
import type { Pattern } from '../types';

export const PATTERNS: Record<string, Pattern> = {
  [squarePattern.id]: squarePattern,
  [squareAlternatingPattern.id]: squareAlternatingPattern,
  [zigzagFestoonPattern.id]: zigzagFestoonPattern
};

export const PATTERN_LIST = Object.values(PATTERNS);

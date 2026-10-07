import { squarePattern } from './square';
import { squareAlternatingPattern } from './square-alternating';
import type { Pattern } from '../types';

export const PATTERNS: Record<string, Pattern> = {
  [squarePattern.id]: squarePattern,
  [squareAlternatingPattern.id]: squareAlternatingPattern
};

export const PATTERN_LIST = Object.values(PATTERNS);

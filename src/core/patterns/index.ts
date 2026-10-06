import { diagonalPattern } from './diagonal';
import { chevronPattern } from './chevron';
import { zigzagPattern } from './zigzag';
import { diamondPattern } from './diamond';
import { squarePattern } from './square';
import type { Pattern } from '../types';

export const PATTERNS: Record<string, Pattern> = {
  [diagonalPattern.id]: diagonalPattern,
  [chevronPattern.id]: chevronPattern,
  [zigzagPattern.id]: zigzagPattern,
  [diamondPattern.id]: diamondPattern,
  [squarePattern.id]: squarePattern
};

export const PATTERN_LIST = Object.values(PATTERNS);

import type { Pattern, KnotType } from '../types';

export const squarePattern: Pattern = {
  id: 'square',
  name: 'Nudo plano',
  minThreads: 2,
  maxThreads: 4,
  evenOnly: false,
  shiftOddRows: false,
  defaultKnotSize: 32,
  generateSequence: (_threadsCount: number, rows: number) => {
    const sequence: KnotType[][] = [];
    for (let r = 0; r < rows; r++) {
      // For this pattern, it's always exactly one knot spanning all available threads (2 to 4)
      sequence.push(['SQUARE']);
    }
    return sequence;
  }
};

import type { Pattern, KnotType } from '../types';

export const squareAlternatingPattern: Pattern = {
  id: 'square-alternating',
  name: 'Nudo plano alternado',
  minThreads: 3,
  maxThreads: 3,
  evenOnly: false,
  shiftOddRows: false,
  generateSequence: (_threadsCount: number, rows: number) => {
    const sequence: KnotType[][] = [];
    for (let r = 0; r < rows; r++) {
      sequence.push([r % 2 === 0 ? 'HALF_SQUARE_L' : 'HALF_SQUARE_R']);
    }
    return sequence;
  }
};

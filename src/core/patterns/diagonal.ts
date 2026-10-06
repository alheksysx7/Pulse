import type { Pattern, KnotType } from '../types';

export const diagonalPattern: Pattern = {
  id: 'diagonal',
  name: 'Candy Stripe (Diagonal)',
  minThreads: 4,
  evenOnly: false,
  generateSequence: (threadsCount: number, rows: number) => {
    const sequence: KnotType[][] = [];
    for (let r = 0; r < rows; r++) {
      const isOddRow = r % 2 !== 0;
      const knotsCount = isOddRow ? Math.floor((threadsCount - 1) / 2) : Math.floor(threadsCount / 2);
      const rowKnots: KnotType[] = [];
      for (let k = 0; k < knotsCount; k++) {
        rowKnots.push('F');
      }
      sequence.push(rowKnots);
    }
    return sequence;
  }
};

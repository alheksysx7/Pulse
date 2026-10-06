import type { Pattern, KnotType } from '../types';

export const chevronPattern: Pattern = {
  id: 'chevron',
  name: 'Chevron',
  minThreads: 4,
  evenOnly: true, // Chevron usually requires an even number of threads to meet in the middle
  generateSequence: (threadsCount: number, rows: number) => {
    const sequence: KnotType[][] = [];
    for (let r = 0; r < rows; r++) {
      const isOddRow = r % 2 !== 0;
      const knotsCount = isOddRow ? Math.floor((threadsCount - 1) / 2) : Math.floor(threadsCount / 2);
      const rowKnots: KnotType[] = [];
      
      for (let k = 0; k < knotsCount; k++) {
        // Left half is F, right half is B.
        // For the exact center on even rows (where left meets right), typically a FB or BF is used, 
        // or just F or B depending on how you want the center knot to lay.
        // Usually, the left half threads go F, the right half threads go B.
        // The midpoint knot (if there is one in this row) can be F or B.
        if (k < knotsCount / 2) {
          rowKnots.push('F');
        } else {
          rowKnots.push('B');
        }
      }
      sequence.push(rowKnots);
    }
    return sequence;
  }
};

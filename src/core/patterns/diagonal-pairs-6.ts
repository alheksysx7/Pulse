import type { Pattern, KnotType } from '../types';

export const diagonalPairs6Pattern: Pattern = {
  id: 'diagonal-pairs-6',
  name: 'Diagonal y Pares Entrelazados',
  minThreads: 6,
  maxThreads: 6,
  defaultThreads: 6,
  evenOnly: true,
  shiftOddRows: true,
  minVerticalSpacing: 0.5,
  defaultVerticalSpacing: 0.8,
  defaultKnotSize: 24,
  generateSequence: (_threadsCount: number, rows: number) => {
    const sequence: KnotType[][] = [];
    
    // Pattern sequence is compressed to 4 rows to overlap cycles.
    // This perfectly attaches the pairs to the diagonal with no vertical gaps.
    
    const patternCycle = [
      ['B', 'F', 'B'],           // Row 0 (Even): Diag Step 1, Pair Step 2, Diag Step 5
      ['B', 'NONE'],             // Row 1 (Odd):  Diag Step 2
      ['F', 'B', 'F'],           // Row 2 (Even): Pair Step 1, Diag Step 3, Pair Step 3
      ['NONE', 'B'],             // Row 3 (Odd):  Diag Step 4
    ];

    for (let r = 0; r < rows; r++) {
      sequence.push(patternCycle[r % patternCycle.length]);
    }
    
    return sequence;
  }
};

import type { Pattern, KnotType } from '../types';

export const diagonalFestoonPattern: Pattern = {
  id: 'diagonal-festoon',
  name: 'Festón Diagonal',
  minThreads: 3,
  maxThreads: 7,
  defaultThreads: 4,
  evenOnly: false,
  shiftOddRows: true,
  minVerticalSpacing: 0.4,
  defaultVerticalSpacing: 0.5,
  defaultKnotSize: 22,
  generateSequence: (threadsCount: number, rows: number) => {
    const sequence: KnotType[][] = [];

    for (let r = 0; r < rows; r++) {
      const isOddRow = r % 2 !== 0;
      const knotsCount = isOddRow
        ? Math.floor((threadsCount - 1) / 2)
        : Math.floor(threadsCount / 2);

      const row: KnotType[] = new Array(knotsCount).fill('NONE');

      const offset = 2;
      const len = threadsCount - 1;

      // Find all active sweeps on this row
      // Sweep n starts at r = n * offset
      const maxN = Math.floor(r / offset);
      const minN = Math.max(0, Math.ceil((r - len + 1) / offset));

      for (let n = minN; n <= maxN; n++) {
        const start = n * offset;
        const step = r - start;
        const targetPos = step; // Moves right exactly 1 per row

        // Ensure target matches row parity
        if ((targetPos % 2 !== 0) === isOddRow) {
          const col = Math.floor(targetPos / 2);
          if (col >= 0 && col < knotsCount) {
            row[col] = 'F';
          }
        }
      }

      sequence.push(row);
    }

    return sequence;
  }
};

import type { Pattern, KnotType } from '../types';

export const jumpingFestoonPattern: Pattern = {
  id: 'jumping-festoon',
  name: 'Festón con Saltos',
  minThreads: 5,
  maxThreads: 5,
  evenOnly: false,
  shiftOddRows: true,
  defaultVerticalSpacing: 0.4,
  lockVerticalSpacing: false,
  defaultKnotSize: 20,
  generateSequence: (threadsCount: number, rows: number) => {
    const sequence: KnotType[][] = [];
    const effectiveThreads = threadsCount % 2 === 0 ? Math.max(5, threadsCount - 1) : threadsCount;
    const K = effectiveThreads - 2;

    for (let r = 0; r < rows; r++) {
      const isOddRow = r % 2 !== 0;
      const knotsCount = isOddRow
        ? Math.floor((threadsCount - 1) / 2)
        : Math.floor(threadsCount / 2);

      const row: KnotType[] = new Array(knotsCount).fill('NONE');

      const initRows = effectiveThreads - 1;
      let targetPos = -1;

      if (r < initRows) {
        // Initial full sweep across all threads
        targetPos = r;
      } else {
        const rCycle = r - initRows;
        const sweepIndex = Math.floor(rCycle / K);
        const step = rCycle % K;

        if (sweepIndex % 2 === 0) {
          // Left-aligned sweep
          targetPos = step;
        } else {
          // Right-aligned sweep
          targetPos = 1 + step;
        }
      }

      // Ensure the target position matches the row's parity
      if ((targetPos % 2 !== 0) === isOddRow) {
        const col = Math.floor(targetPos / 2);
        if (col >= 0 && col < knotsCount) {
          row[col] = 'B';
        }
      }

      sequence.push(row);
    }

    return sequence;
  }
};

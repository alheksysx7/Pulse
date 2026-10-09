import type { Pattern, KnotType } from '../types';

export const jumpingFestoonPattern: Pattern = {
  id: 'jumping-festoon',
  name: 'Festón con Saltos',
  minThreads: 5,
  maxThreads: 5,
  evenOnly: false,
  shiftOddRows: true,
  defaultVerticalSpacing: 0.9,
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

      const getSweepStart = (n: number) => {
        if (n === -1) return 0;
        if (n === 0) return 2;
        const pairs = Math.floor((n - 1) / 2);
        const remainder = (n - 1) % 2;
        return 5 + pairs * 4 + remainder;
      };

      for (let n = -1; n <= r; n++) {
        const start = getSweepStart(n);
        const len = (n === -1) ? effectiveThreads - 1 : K;

        if (r >= start && r < start + len) {
          const step = r - start;
          let targetPos = -1;

          if (n === -1) {
            targetPos = step;
          } else {
            if (n % 2 === 0) {
              targetPos = step;
            } else {
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
        }
      }

      sequence.push(row);
    }

    return sequence;
  }
};

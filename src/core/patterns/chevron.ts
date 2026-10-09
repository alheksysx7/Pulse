import type { Pattern, KnotType } from '../types';

export const classicChevronPattern: Pattern = {
  id: 'chevron',
  name: 'Chevron Clásico',
  minThreads: 4,
  maxThreads: 12,
  defaultThreads: 6,
  evenOnly: true,
  shiftOddRows: false,
  defaultVerticalSpacing: 0.4,
  minVerticalSpacing: 0.2,
  defaultKnotSize: 19,
  generateSequence: (threadsCount: number, rows: number) => {
    const sequence: KnotType[][] = [];
    const half = Math.floor(threadsCount / 2);

    for (let r = 0; r < rows; r++) {
      const rowKnots: KnotType[] = [];

      // Determine which V's are active on this row.
      // A new V starts every 2 rows. V_k starts at row k*2.
      // V_k takes `half` rows to complete (steps 0 to half-1).
      const minK = Math.max(0, Math.ceil((r - half + 1) / 2));
      const maxK = Math.floor(r / 2);

      const knotAt: { [index: number]: KnotType } = {};

      for (let k = minK; k <= maxK; k++) {
        const step = r - k * 2;
        if (step === half - 1) {
          // Center union
          knotAt[step] = 'F';
        } else {
          // Both sides
          knotAt[step] = 'F';
          knotAt[threadsCount - 2 - step] = 'B';
        }
      }

      let i = 0;
      while (i < threadsCount) {
        if (knotAt[i]) {
          rowKnots.push(knotAt[i]);
          i += 2;
        } else {
          rowKnots.push('NONE_1');
          i += 1;
        }
      }

      sequence.push(rowKnots);
    }
    return sequence;
  }
};

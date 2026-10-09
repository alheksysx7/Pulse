import type { Pattern, KnotType } from '../types';

export const vFestoonChevronPattern: Pattern = {
  id: 'v-festoon-chevron',
  name: 'Festón en V (Variante Chevron)',
  minThreads: 3,
  maxThreads: 5,
  defaultThreads: 5,
  evenOnly: false,
  shiftOddRows: false,
  defaultVerticalSpacing: 0.3,
  minVerticalSpacing: 0.2,
  defaultKnotSize: 21,
  generateSequence: (threadsCount: number, rows: number) => {
    const sequence: KnotType[][] = [];
    const center = Math.floor(threadsCount / 2);

    for (let r = 0; r < rows; r++) {
      const rowKnots: KnotType[] = [];
      const offset = 3;

      const minK = Math.max(0, Math.ceil((r - center) / offset));
      const maxK = Math.floor(r / offset);

      const knotAt: { [index: number]: KnotType } = {};

      for (let k = minK; k <= maxK; k++) {
        const step = r - k * offset;
        if (step < center - 1) {
          knotAt[step] = 'B';
          knotAt[threadsCount - 2 - step] = 'F';
        } else if (step === center - 1) {
          knotAt[step] = 'B';
        } else if (step === center) {
          knotAt[center] = 'F';
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

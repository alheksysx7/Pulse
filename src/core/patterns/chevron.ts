import type { Pattern, KnotType } from '../types';

export const classicChevronPattern: Pattern = {
  id: 'chevron',
  name: 'Chevron Clásico',
  minThreads: 4,
  defaultThreads: 8,
  evenOnly: true,
  shiftOddRows: false,
  defaultVerticalSpacing: 0.6,
  minVerticalSpacing: 0.2,
  defaultKnotSize: 21,
  generateSequence: (threadsCount: number, rows: number) => {
    const sequence: KnotType[][] = [];
    const half = Math.floor(threadsCount / 2);

    for (let r = 0; r < rows; r++) {
      const cycleRow = r % half;
      const rowKnots: KnotType[] = [];

      if (cycleRow < half - 1) {
        // Both sides moving towards the center
        for (let i = 0; i < cycleRow; i++) rowKnots.push('NONE_1');

        rowKnots.push('F'); // Left side active thread knots over inner guide

        const middleNones = threadsCount - 4 - (cycleRow * 2);
        for (let i = 0; i < middleNones; i++) rowKnots.push('NONE_1');

        rowKnots.push('B'); // Right side active thread knots over inner guide

        for (let i = 0; i < cycleRow; i++) rowKnots.push('NONE_1');
      } else {
        // Center union
        for (let i = 0; i < half - 1; i++) rowKnots.push('NONE_1');
        rowKnots.push('F'); // Join the two halves
        for (let i = 0; i < half - 1; i++) rowKnots.push('NONE_1');
      }

      sequence.push(rowKnots);
    }
    return sequence;
  }
};

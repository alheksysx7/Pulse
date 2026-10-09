import type { Pattern, KnotType } from '../types';

export const chevronPattern: Pattern = {
  id: 'chevron',
  name: 'Chevron',
  minThreads: 3,
  defaultThreads: 5,
  evenOnly: false,
  shiftOddRows: false,
  defaultVerticalSpacing: 0.3,
  minVerticalSpacing: 0.2,
  defaultKnotSize: 21,
  generateSequence: (threadsCount: number, rows: number) => {
    const sequence: KnotType[][] = [];
    const center = Math.floor(threadsCount / 2);
    const cycleLength = Math.ceil(threadsCount / 2);

    for (let r = 0; r < rows; r++) {
      const cycleRow = r % cycleLength;
      const rowKnots: KnotType[] = [];

      if (cycleRow < center - 1) {
        // Symmetric rows before the center
        // B on the left, F on the right
        for (let i = 0; i < cycleRow; i++) rowKnots.push('NONE_1');
        rowKnots.push('B'); // Left side: Right thread knots over Left guide

        const emptySpaces = threadsCount - (cycleRow * 2) - 4;
        for (let i = 0; i < emptySpaces; i++) rowKnots.push('NONE_1');

        rowKnots.push('F'); // Right side: Left thread knots over Right guide
      } else if (cycleRow === center - 1) {
        // Left guide reaches center
        for (let i = 0; i < cycleRow; i++) rowKnots.push('NONE_1');
        rowKnots.push('B');
      } else if (cycleRow === center) {
        // Right guide reaches center and closes the V
        for (let i = 0; i < center; i++) rowKnots.push('NONE_1');
        rowKnots.push('F');
      }

      sequence.push(rowKnots);
    }
    return sequence;
  }
};

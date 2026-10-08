import type { Pattern, KnotType } from '../types';

export const diagonalFestoonPattern: Pattern = {
  id: 'diagonal-festoon',
  name: 'Festón Diagonal',
  minThreads: 3,
  maxThreads: 7,
  evenOnly: false,
  shiftOddRows: true,
  defaultVerticalSpacing: 0.5,
  lockVerticalSpacing: true,
  generateSequence: (threadsCount: number, rows: number) => {
    const sequence: KnotType[][] = [];

    for (let r = 0; r < rows; r++) {
      const isOddRow = r % 2 !== 0;
      const knotsCount = isOddRow
        ? Math.floor((threadsCount - 1) / 2)
        : Math.floor(threadsCount / 2);

      const row: KnotType[] = [];
      for (let k = 0; k < knotsCount; k++) {
        // Forward knot (F): El hilo de la izquierda teje sobre el de la derecha
        row.push('F');
      }
      sequence.push(row);
    }

    return sequence;
  }
};

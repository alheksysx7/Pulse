import type { Pattern, KnotType } from '../types';

export const zigzagFestoonPattern: Pattern = {
  id: 'zigzag-festoon',
  name: 'Nudo festón zigzag alterno',
  minThreads: 3,
  maxThreads: 3,
  evenOnly: false,
  shiftOddRows: true, // We will manually emit the sequence, but shiftOddRows lets us pair (0,1) then (1,2)
  defaultVerticalSpacing: 0.7,
  defaultKnotSize: 24,
  generateSequence: (threadsCount: number, rows: number) => {
    const sequence: KnotType[][] = [];
    const cycleRowKnots: KnotType[][] = [];
    let pos = 0;
    let dir = 1;
    let r = 0;

    while (true) {
      const isOddRow = r % 2 !== 0;
      const knotsCount = isOddRow
        ? Math.floor((threadsCount - 1) / 2)
        : Math.floor(threadsCount / 2);

      const row = new Array(knotsCount).fill('NONE_1');
      const targetPos = dir === 1 ? pos : pos - 1;

      if ((targetPos % 2 !== 0) === isOddRow) {
        const col = Math.floor(targetPos / 2);
        if (col >= 0 && col < knotsCount) {
          row[col] = dir === 1 ? 'B' : 'F';
        }
        pos += dir;
        if (pos === threadsCount - 1) {
          dir = -1;
        } else if (pos === 0) {
          dir = 1;
        }
      }

      cycleRowKnots.push(row);
      r++;

      if (pos === 0 && dir === 1 && cycleRowKnots.length % 2 === 0) {
        break;
      }
    }

    for (let i = 0; i < rows; i++) {
      sequence.push(cycleRowKnots[i % cycleRowKnots.length]);
    }

    return sequence;
  }
};

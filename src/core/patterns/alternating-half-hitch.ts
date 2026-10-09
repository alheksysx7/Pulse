import type { Pattern } from '../types';

export const alternatingHalfHitchPattern: Pattern = {
  id: 'alternating-half-hitch',
  name: 'Medio Festón Alterno',
  minThreads: 3,
  maxThreads: 3,
  evenOnly: false,
  shiftOddRows: true,
  defaultVerticalSpacing: 1,
  defaultKnotSize: 20,
  generateSequence: (threadsCount, rowsCount) => {
    // We only allow 3 threads for this specific pattern
    // Central thread is static guide. Left and right are working threads.

    const sequence: any[] = [];
    for (let r = 0; r < rowsCount; r++) {
      // With shiftOddRows = true:
      // Even rows (0, 2, 4...): threadOffset = 0. Knot covers threads 0 and 1.
      // Odd rows (1, 3, 5...): threadOffset = 1. Knot covers threads 1 and 2.
      if (r % 2 === 0) {
        // Left thread (0) ties over center thread (1)
        sequence.push(['F_NO_SWAP']);
      } else {
        // Right thread (2) ties over center thread (1)
        sequence.push(['B_NO_SWAP']);
      }
    }
    return sequence;
  }
};

import type { Pattern, KnotType } from '../types';

export const alternating2ThreadPattern: Pattern = {
  id: 'alternating-2-thread',
  name: 'Medio festón 2 hilos',
  minThreads: 2,
  maxThreads: 2,
  defaultThreads: 2,
  evenOnly: true,
  shiftOddRows: false,
  minVerticalSpacing: 0.3,
  defaultVerticalSpacing: 0.6,
  defaultKnotSize: 20,
  generateSequence: (_threadsCount: number, rows: number) => {
    const sequence: KnotType[][] = [];
    for (let r = 0; r < rows; r++) {
      if (r % 2 === 0) {
        // Hilo izquierdo (A) anuda sobre hilo derecho (B)
        sequence.push(['F_NO_SWAP']);
      } else {
        // Hilo derecho (B) anuda sobre hilo izquierdo (A)
        sequence.push(['B_NO_SWAP']);
      }
    }
    return sequence;
  }
};

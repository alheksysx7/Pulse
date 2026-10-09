import type { Pattern, KnotType } from '../types';

export const squarePattern: Pattern = {
  id: 'square',
  name: 'Nudo plano',
  minThreads: 3,
  maxThreads: 4, // Permite cualquier cantidad de hilos; los extremos anudan y los demás son núcleo
  defaultThreads: 4,
  evenOnly: false,
  shiftOddRows: false,
  minVerticalSpacing: 0.4,
  defaultVerticalSpacing: 0.6,
  defaultKnotSize: 15,
  generateSequence: (_threadsCount: number, rows: number) => {
    const sequence: KnotType[][] = [];
    for (let r = 0; r < rows; r++) {
      // Alternates between L and R to create full square knots
      if (r % 2 === 0) {
        sequence.push(['HALF_SQUARE_L']);
      } else {
        sequence.push(['HALF_SQUARE_R']);
      }
    }
    return sequence;
  }
};

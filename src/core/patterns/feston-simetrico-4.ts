import type { Pattern, KnotType } from '../types';

export const symmetricFestoon4Pattern: Pattern = {
  id: 'feston-simetrico-4',
  name: 'Festón simétrico 4 hilos',
  minThreads: 4,
  maxThreads: 4,
  defaultThreads: 4,
  evenOnly: true,
  shiftOddRows: false,
  baseRowHeightRatio: 0.45,
  innerThreadAlpha: 0.1,
  horizontalSpacingRatio: 0.7,
  defaultVerticalSpacing: 1.2,
  minVerticalSpacing: 0.2,
  maxVerticalSpacing: 1.5,
  defaultKnotSize: 24,
  generateSequence: (_threadsCount: number, rows: number) => {
    const sequence: KnotType[][] = [];
    const cycle: KnotType[][] = [
      // Paso 1: Nudo Festón Central (Hilo 2 hace nudo F hacia la derecha sobre Hilo 3)
      ['NONE_1', 'F', 'NONE_1'],
      // Pasos 2 & 3 (Hacia adentro): Hilo 1 hace F hacia la derecha sobre guía, Hilo 4 hace B hacia la izquierda sobre guía
      ['F', 'B'],
      // Pasos 2 & 3 (Regreso hacia afuera): Hilo 1 hace B hacia la izquierda sobre guía, Hilo 4 hace F hacia la derecha sobre guía
      ['B', 'F']
    ];

    for (let r = 0; r < rows; r++) {
      sequence.push(cycle[r % cycle.length]);
    }

    return sequence;
  }
};

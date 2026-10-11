import type { Pattern, KnotType } from '../types';

export const diagonalPairs6Pattern: Pattern = {
  id: 'diagonal-pairs-6',
  name: 'Diagonal y Pares Entrelazados',
  minThreads: 6,
  maxThreads: 6,
  defaultThreads: 6,
  evenOnly: true,
  shiftOddRows: true,
  minVerticalSpacing: 0.1,
  maxVerticalSpacing: 0.3,
  defaultVerticalSpacing: 0.3,
  defaultKnotSize: 20,
  generateSequence: (_threadsCount: number, rows: number) => {
    const sequence: KnotType[][] = [];

    // Filas 0 a 3: Inicio del tejido con la primera diagonal limpia sobre la guía.
    // Los 3 nudos festón hacia la derecha ('F') van adheridos directamente debajo de la diagonal.
    const startCycle: KnotType[][] = [
      ['B', 'NONE', 'NONE'],     // Fila 0 (Par):  Diag 1 (hilos 0-1). Limpio, sin nudos encima.
      ['B', 'NONE'],             // Fila 1 (Impar): Diag 2 (hilos 1-2).
      ['F', 'B', 'NONE'],        // Fila 2 (Par):  Par 1 (hilos 0-1) pegado a Diag 1; Diag 3 (hilos 2-3).
      ['NONE', 'B'],             // Fila 3 (Impar): Diag 4 (hilos 3-4).
    ];

    // Filas 4 en adelante: Ciclo continuo donde cada grupo de 3 pares 'F'
    // se mantiene pegado a la diagonal previa mientras avanza la nueva diagonal.
    const loopCycle: KnotType[][] = [
      ['B', 'F', 'B'],           // Fila 4k+0 (Par):  Diag 1 (nuevo), Par 2 (previo), Diag 5 (previo)
      ['B', 'NONE'],             // Fila 4k+1 (Impar): Diag 2 (nuevo)
      ['F', 'B', 'F'],           // Fila 4k+2 (Par):  Par 1 (nuevo), Diag 3 (nuevo), Par 3 (previo)
      ['NONE', 'B'],             // Fila 4k+3 (Impar): Diag 4 (nuevo)
    ];

    for (let r = 0; r < rows; r++) {
      if (r < startCycle.length) {
        sequence.push(startCycle[r]);
      } else {
        const loopIndex = (r - startCycle.length) % loopCycle.length;
        sequence.push(loopCycle[loopIndex]);
      }
    }

    return sequence;
  }
};

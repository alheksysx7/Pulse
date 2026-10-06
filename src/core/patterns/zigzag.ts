import type { Pattern, KnotType } from '../types';

export const zigzagPattern: Pattern = {
  id: 'zigzag',
  name: 'Zig-Zag',
  minThreads: 4,
  evenOnly: false,
  generateSequence: (threadsCount: number, rows: number) => {
    const sequence: KnotType[][] = [];
    const zigzagSize = threadsCount; // typical zigzag changes direction based on width
    
    for (let r = 0; r < rows; r++) {
      const isOddRow = r % 2 !== 0;
      const knotsCount = isOddRow ? Math.floor((threadsCount - 1) / 2) : Math.floor(threadsCount / 2);
      const rowKnots: KnotType[] = [];
      
      // Determine if this row is heading right (F) or left (B)
      const directionPhase = Math.floor(r / zigzagSize) % 2;
      const knotType: KnotType = directionPhase === 0 ? 'F' : 'B';
      
      for (let k = 0; k < knotsCount; k++) {
        rowKnots.push(knotType);
      }
      sequence.push(rowKnots);
    }
    return sequence;
  }
};

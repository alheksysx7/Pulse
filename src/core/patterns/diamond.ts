import type { Pattern, KnotType } from '../types';

export const diamondPattern: Pattern = {
  id: 'diamond',
  name: 'Diamond',
  minThreads: 8,
  evenOnly: true,
  generateSequence: (threadsCount: number, rows: number) => {
    // A simplified diamond sequence generator. 
    // True diamonds are complex and depend on exact thread layout.
    // For V1, we will approximate a diamond structure by expanding and contracting.
    const sequence: KnotType[][] = [];
    const cycle = threadsCount;
    
    for (let r = 0; r < rows; r++) {
      const isOddRow = r % 2 !== 0;
      const knotsCount = isOddRow ? Math.floor((threadsCount - 1) / 2) : Math.floor(threadsCount / 2);
      const rowKnots: KnotType[] = [];
      
      const phase = r % cycle;
      const isExpanding = phase < cycle / 2;
      
      for (let k = 0; k < knotsCount; k++) {
        if (isExpanding) {
           // expanding: outer go outward, inner go inward...
           // Just a placeholder structure to let simulation run.
           rowKnots.push(k < knotsCount / 2 ? 'B' : 'F');
        } else {
           rowKnots.push(k < knotsCount / 2 ? 'F' : 'B');
        }
      }
      sequence.push(rowKnots);
    }
    return sequence;
  }
};

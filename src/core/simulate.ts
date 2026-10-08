import type { KnotType, Knot } from './types';

/**
 * Simulates a sequence of rows.
 * @param initialColors The starting colors for each thread (left to right).
 * @param rowKnotTypes An array of rows, where each row is an array of KnotTypes.
 * A row should have Math.floor(threads.length / 2) knots for even rows (index 0, 2, ...), 
 * and Math.floor((threads.length - 1) / 2) knots for odd rows (index 1, 3, ...).
 */
export function simulateSequence(initialColors: string[], rowKnotTypes: KnotType[][], shiftOddRows: boolean = true): { finalColors: string[], grid: Knot[][] } {
  let currentColors = [...initialColors];
  const grid: Knot[][] = [];

  for (let rowIndex = 0; rowIndex < rowKnotTypes.length; rowIndex++) {
    const knotTypes = rowKnotTypes[rowIndex];
    const isOddRow = rowIndex % 2 !== 0; // 0-indexed, so rowIndex 1 is "odd"
    const nextColors = [...currentColors];
    const rowKnots: Knot[] = [];
    
    let threadOffset = (isOddRow && shiftOddRows) ? 1 : 0;

    // Add leading unknotted thread if shifted
    if (threadOffset === 1) {
      rowKnots.push({
        type: 'NONE',
        color1: currentColors[0],
        color2: currentColors[0],
        inColors: [currentColors[0]],
        outColor1: currentColors[0],
        outColor2: currentColors[0],
        threadSpan: 1
      });
    }

    for (let k = 0; k < knotTypes.length; k++) {
      const type = knotTypes[k];
      let threadSpan = 2;
      
      if (type === 'SQUARE' || type === 'HALF_SQUARE_L' || type === 'HALF_SQUARE_R') {
        threadSpan = currentColors.length; // Spans all available threads (3 or 4)
      }
      
      const leftIdx = threadOffset;
      const rightIdx = leftIdx + 1;
      
      if (leftIdx + threadSpan > currentColors.length) break; // Safety check

      const color1 = currentColors[leftIdx];
      const color2 = currentColors[rightIdx];
      let outColor1 = color1;
      let outColor2 = color2;

      if (type === 'F') {
        // Forward knot: left thread ties over right thread (guide)
        outColor1 = color1; // The knot color is the working thread
        outColor2 = color1; // The working thread is visible
        nextColors[leftIdx] = color2; // Right thread moves left
        nextColors[rightIdx] = color1; // Left thread moves right
      } else if (type === 'B') {
        // Backward knot: right thread ties over left thread (guide)
        outColor1 = color2; // Knot color is the working thread
        outColor2 = color2; // The working thread is visible
        nextColors[leftIdx] = color2; // Right thread moves left
        nextColors[rightIdx] = color1; // Left thread moves right
      } else if (type === 'NONE') {
        // No knot: threads drop straight down
        outColor1 = color1;
        outColor2 = color2;
        nextColors[leftIdx] = color1;
        nextColors[rightIdx] = color2;
      } else if (type === 'SQUARE' || type === 'HALF_SQUARE_L' || type === 'HALF_SQUARE_R') {
        // Square knot spans 3 or 4 threads: outer threads tie around inner core(s)
        const outerLeft = currentColors[leftIdx];
        const outerRight = currentColors[leftIdx + threadSpan - 1];
        
        if (type === 'HALF_SQUARE_L') {
          outColor1 = outerLeft;
          outColor2 = outerRight;
        } else if (type === 'HALF_SQUARE_R') {
          outColor1 = outerRight;
          outColor2 = outerLeft;
        } else {
          // If there are no core threads (threadSpan === 2), the two threads interlock with each other,
          // causing the visible front color to alternate every row.
          if (threadSpan === 2 && rowIndex % 2 !== 0) {
            outColor1 = outerRight;
            outColor2 = outerLeft;
          } else {
            outColor1 = outerLeft; // Zigzag inner thread (always goes OVER)
            outColor2 = outerRight; // Border outer thread (always goes UNDER)
          }
        }
        
        // Colors don't swap position in a flat square knot
        nextColors[leftIdx] = outerLeft;
        nextColors[leftIdx + threadSpan - 1] = outerRight;
        for (let i = 1; i < threadSpan - 1; i++) {
          nextColors[leftIdx + i] = currentColors[leftIdx + i]; // core threads
        }
      }

      const inColors = [];
      for (let i = 0; i < threadSpan; i++) {
        inColors.push(currentColors[leftIdx + i]);
      }

      rowKnots.push({
        type,
        color1,
        color2,
        inColors,
        outColor1, 
        outColor2,
        threadSpan
      });
      
      threadOffset += threadSpan;
    }

    // Add trailing unknotted threads
    while (threadOffset < currentColors.length) {
      rowKnots.push({
        type: 'NONE',
        color1: currentColors[threadOffset],
        color2: currentColors[threadOffset],
        inColors: [currentColors[threadOffset]],
        outColor1: currentColors[threadOffset],
        outColor2: currentColors[threadOffset],
        threadSpan: 1
      });
      threadOffset++;
    }

    grid.push(rowKnots);
    currentColors = nextColors;
  }

  return { finalColors: currentColors, grid };
}

import type { KnotType, Knot, ThreadSegment } from './types';

/**
 * Returns the effective color for a given thread at a specific row,
 * taking into account any color divisions/segments.
 */
export function getThreadColor(threadId: number, row: number, segments?: ThreadSegment[][], fallbackColors?: string[]): string {
  if (segments && segments[threadId] && segments[threadId].length > 0) {
    const threadSegs = segments[threadId];
    // Find the latest segment where fromRow <= row
    let activeColor = threadSegs[0].color;
    for (const seg of threadSegs) {
      if (seg.fromRow <= row) {
        activeColor = seg.color;
      } else {
        break;
      }
    }
    return activeColor;
  }
  if (fallbackColors && fallbackColors[threadId]) {
    return fallbackColors[threadId];
  }
  return '#000000';
}

/**
 * Simulates a sequence of rows.
 * @param initialColors The starting colors for each thread (left to right).
 * @param rowKnotTypes An array of rows, where each row is an array of KnotTypes.
 * @param shiftOddRows If true, odd rows shift by 1 thread.
 * @param segments Optional color segments per thread.
 */
export function simulateSequence(
  initialColors: string[],
  rowKnotTypes: KnotType[][],
  shiftOddRows: boolean = true,
  segments?: ThreadSegment[][]
): { finalColors: string[], grid: Knot[][] } {
  // Current thread ID (original index in row 0) at each column position
  let currentThreadIds = initialColors.map((_, i) => i);
  const grid: Knot[][] = [];

  for (let rowIndex = 0; rowIndex < rowKnotTypes.length; rowIndex++) {
    const knotTypes = rowKnotTypes[rowIndex];
    const isOddRow = rowIndex % 2 !== 0; // 0-indexed, so rowIndex 1 is "odd"
    const nextThreadIds = [...currentThreadIds];
    const rowKnots: Knot[] = [];
    
    let threadOffset = (isOddRow && shiftOddRows) ? 1 : 0;

    // Add leading unknotted thread if shifted
    if (threadOffset === 1) {
      const leadingThreadId = currentThreadIds[0];
      const leadingColor = getThreadColor(leadingThreadId, rowIndex, segments, initialColors);
      rowKnots.push({
        type: 'NONE',
        color1: leadingColor,
        color2: leadingColor,
        inColors: [leadingColor],
        inThreadIds: [leadingThreadId],
        outColor1: leadingColor,
        outColor2: leadingColor,
        threadSpan: 1
      });
    }

    for (let k = 0; k < knotTypes.length; k++) {
      const type = knotTypes[k];
      const leftIdx = threadOffset;
      const rightIdx = leftIdx + 1;
      let threadSpan = 2;
      
      if (type === 'HALF_SQUARE_L' || type === 'HALF_SQUARE_R') {
        threadSpan = Math.min(4, currentThreadIds.length - leftIdx); // Spans up to 4 threads
      } else if (type === 'NONE_1') {
        threadSpan = 1;
      }
      
      if (leftIdx + threadSpan > currentThreadIds.length) break; // Safety check

      const inThreadIds: number[] = [];
      const inColors: string[] = [];
      for (let i = 0; i < threadSpan; i++) {
        const tId = currentThreadIds[leftIdx + i];
        inThreadIds.push(tId);
        inColors.push(getThreadColor(tId, rowIndex, segments, initialColors));
      }

      const color1 = inColors[0];
      const color2 = threadSpan > 1 ? inColors[1] : color1;
      let outColor1 = color1;
      let outColor2 = color2;

      if (type === 'F') {
        // Forward knot: left thread ties over right thread (guide)
        outColor1 = color1;
        outColor2 = color1;
        nextThreadIds[leftIdx] = currentThreadIds[rightIdx]; // Right thread moves left
        nextThreadIds[rightIdx] = currentThreadIds[leftIdx]; // Left thread moves right
      } else if (type === 'F_NO_SWAP') {
        // Forward knot without swapping threads
        outColor1 = color1;
        outColor2 = color1;
        nextThreadIds[leftIdx] = currentThreadIds[leftIdx];
        nextThreadIds[rightIdx] = currentThreadIds[rightIdx];
      } else if (type === 'B') {
        // Backward knot: right thread ties over left thread (guide)
        outColor1 = color2;
        outColor2 = color2;
        nextThreadIds[leftIdx] = currentThreadIds[rightIdx]; // Right thread moves left
        nextThreadIds[rightIdx] = currentThreadIds[leftIdx]; // Left thread moves right
      } else if (type === 'B_NO_SWAP') {
        // Backward knot without swapping threads
        outColor1 = color2;
        outColor2 = color2;
        nextThreadIds[leftIdx] = currentThreadIds[leftIdx];
        nextThreadIds[rightIdx] = currentThreadIds[rightIdx];
      } else if (type === 'NONE' || type === 'NONE_1') {
        // No knot: threads drop straight down
        outColor1 = color1;
        outColor2 = color2;
        nextThreadIds[leftIdx] = currentThreadIds[leftIdx];
        if (threadSpan > 1) nextThreadIds[rightIdx] = currentThreadIds[rightIdx];
      } else if (type === 'HALF_SQUARE_L' || type === 'HALF_SQUARE_R') {
        const outerLeft = inColors[0];
        const outerRight = inColors[threadSpan - 1];
        
        if (type === 'HALF_SQUARE_L') {
          outColor1 = outerLeft;
          outColor2 = outerRight;
        } else {
          outColor1 = outerRight;
          outColor2 = outerLeft;
        }
        
        // Colors/threads swap position in a HALF square knot
        nextThreadIds[leftIdx] = currentThreadIds[leftIdx + threadSpan - 1];
        nextThreadIds[leftIdx + threadSpan - 1] = currentThreadIds[leftIdx];
        
        for (let i = 1; i < threadSpan - 1; i++) {
          nextThreadIds[leftIdx + i] = currentThreadIds[leftIdx + i]; // core threads
        }
      }

      rowKnots.push({
        type,
        color1,
        color2,
        inColors,
        inThreadIds,
        outColor1, 
        outColor2,
        threadSpan
      });
      
      threadOffset += threadSpan;
    }

    // Add trailing unknotted threads
    while (threadOffset < currentThreadIds.length) {
      const trailingThreadId = currentThreadIds[threadOffset];
      const trailingColor = getThreadColor(trailingThreadId, rowIndex, segments, initialColors);
      rowKnots.push({
        type: 'NONE',
        color1: trailingColor,
        color2: trailingColor,
        inColors: [trailingColor],
        inThreadIds: [trailingThreadId],
        outColor1: trailingColor,
        outColor2: trailingColor,
        threadSpan: 1
      });
      threadOffset++;
    }

    grid.push(rowKnots);
    currentThreadIds = nextThreadIds;
  }

  const finalColors = currentThreadIds.map((tId) => 
    getThreadColor(tId, rowKnotTypes.length, segments, initialColors)
  );

  return { finalColors, grid };
}

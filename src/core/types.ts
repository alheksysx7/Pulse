export type KnotType = 'HALF_SQUARE_L' | 'HALF_SQUARE_R' | 'F' | 'B' | 'F_NO_SWAP' | 'B_NO_SWAP' | 'NONE' | 'NONE_1';

export interface ThreadSegment {
  fromRow: number; // Row index where this segment starts (0 for initial segment)
  color: string;
}

export interface SelectedKnotInfo {
  rowIndex: number;
  knotType: string;
  inThreadIds: number[];
  inColors: string[];
  canvasX: number;
  canvasY: number;
}

export interface Knot {
  type: KnotType;
  color1: string; // Left thread color
  color2: string; // Right thread color (or second thread)
  inColors?: string[]; // All incoming thread colors for this knot
  inThreadIds?: number[]; // Original thread IDs (indices in row 0) entering this knot
  outColor1: string; // Color to render
  outColor2: string; 
  threadSpan: number; // 2 for normal, 4 for square
}

export interface Pattern {
  id: string;
  name: string;
  minThreads: number;
  maxThreads?: number;
  defaultThreads?: number; // Default number of threads for this pattern
  evenOnly: boolean;
  shiftOddRows?: boolean; // If false, odd rows don't shift by 1 thread (default true)
  baseRowHeightRatio?: number; // Custom multiplier for base row height
  innerThreadAlpha?: number; // Alpha transparency for middle/inner threads behind the weave
  applyAlphaToEdges?: boolean; // If true, apply innerThreadAlpha also to edge threads behind the weave (e.g. in zigzag patterns)
  horizontalSpacingRatio?: number; // Custom multiplier for horizontal spacing between threads (default 1.0)
  defaultVerticalSpacing?: number; // Custom vertical spacing for this pattern
  minVerticalSpacing?: number; // Minimum allowed vertical spacing
  maxVerticalSpacing?: number; // Maximum allowed vertical spacing
  defaultKnotSize?: number; // Custom knot size for this pattern
  /**
   * Generates a grid of knots (array of rows, where each row is an array of KnotTypes).
   * Also returns the positions of the knots.
   * 'F' = forward knot, 'B' = backward knot, 'NONE' = empty space (skip threads)
   */
  generateSequence: (threadsCount: number, rows: number) => KnotType[][];
}

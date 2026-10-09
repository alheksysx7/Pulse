export type KnotType = 'HALF_SQUARE_L' | 'HALF_SQUARE_R' | 'F' | 'B' | 'F_NO_SWAP' | 'B_NO_SWAP' | 'NONE' | 'NONE_1';

export interface Knot {
  type: KnotType;
  color1: string; // Left thread color
  color2: string; // Right thread color (or second thread)
  inColors?: string[]; // All incoming thread colors for this knot
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
  defaultVerticalSpacing?: number; // Custom vertical spacing for this pattern
  minVerticalSpacing?: number; // Minimum allowed vertical spacing
  defaultKnotSize?: number; // Custom knot size for this pattern
  /**
   * Generates a grid of knots (array of rows, where each row is an array of KnotTypes).
   * Also returns the positions of the knots.
   * 'F' = forward knot, 'B' = backward knot, 'NONE' = empty space (skip threads)
   */
  generateSequence: (threadsCount: number, rows: number) => KnotType[][];
}

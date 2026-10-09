import type { Knot } from '../types';

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  knot: Knot;
  x: number;
  y: number;
  knotSize: number;
  currentKnotWidth: number;
  isLeftEdge?: boolean;
  isRightEdge?: boolean;
  patternId?: string;
  rowIndex?: number;
}

export type KnotRenderer = (params: RenderContext) => void;

let texturePattern: CanvasPattern | null = null;
export const getTexture = (ctx: CanvasRenderingContext2D) => {
  if (!texturePattern) {
    const canvas = document.createElement('canvas');
    canvas.width = 6;
    canvas.height = 6;
    const tCtx = canvas.getContext('2d')!;
    
    // Transparent background
    tCtx.clearRect(0, 0, 6, 6);
    
    // Dark diagonal (shadow twist)
    tCtx.fillStyle = 'rgba(0,0,0,0.15)';
    tCtx.beginPath();
    tCtx.moveTo(0, 6);
    tCtx.lineTo(6, 0);
    tCtx.lineTo(6, 2);
    tCtx.lineTo(2, 6);
    tCtx.fill();

    // Light diagonal (highlight twist)
    tCtx.fillStyle = 'rgba(255,255,255,0.15)';
    tCtx.beginPath();
    tCtx.moveTo(0, 2);
    tCtx.lineTo(2, 0);
    tCtx.lineTo(0, 0);
    tCtx.fill();
    tCtx.beginPath();
    tCtx.moveTo(4, 6);
    tCtx.lineTo(6, 4);
    tCtx.lineTo(6, 6);
    tCtx.fill();

    texturePattern = ctx.createPattern(canvas, 'repeat');
  }
  return texturePattern;
};


const drawHalfSquareKnot: KnotRenderer = ({ ctx, knot, x, y, knotSize, currentKnotWidth }) => {
  const centerX = x + currentKnotWidth / 2;
  const barWidth = currentKnotWidth - knotSize * 0.5; 
  const barY = y + knotSize / 2;
  
  const isLeft = knot.type === 'HALF_SQUARE_L';

  // For the second half (R), the user requested it to be slightly inclined downwards
  const slantY = isLeft ? 0 : knotSize * 0.15;
  
  // 1. Draw the horizontal bar (outColor1, thread going OVER the core)
  ctx.beginPath();
  ctx.moveTo(centerX - barWidth / 2, barY - slantY);
  ctx.lineTo(centerX + barWidth / 2, barY + slantY);
  ctx.lineWidth = knotSize * 0.6;
  ctx.lineCap = 'round';
  ctx.strokeStyle = knot.outColor1;
  ctx.stroke();
  const pattern = getTexture(ctx);
  if (pattern) {
    ctx.strokeStyle = pattern;
    ctx.stroke();
  }

  // Shadow under the bar
  ctx.beginPath();
  ctx.moveTo(centerX - barWidth / 2 + 2, barY - slantY + 3);
  ctx.lineTo(centerX + barWidth / 2 - 2, barY + slantY + 3);
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.stroke();

  // Highlight on the bar
  ctx.beginPath();
  ctx.moveTo(centerX - barWidth / 2 + 4, barY - slantY - 2);
  ctx.lineTo(centerX + barWidth / 2 - 4, barY + slantY - 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.stroke();

  // 2. Draw the vertical edge loop (outColor2)
  // Only ONE loop per half knot: Left loop for L, Right loop for R.
  ctx.beginPath();
  
  if (isLeft) {
    // Left loop
    ctx.moveTo(x + knotSize * 0.2, y);
    ctx.quadraticCurveTo(x - knotSize * 0.1, barY, x + knotSize * 0.3, y + knotSize);
  } else {
    // Right loop
    ctx.moveTo(x + currentKnotWidth - knotSize * 0.2, y);
    ctx.quadraticCurveTo(x + currentKnotWidth + knotSize * 0.1, barY, x + currentKnotWidth - knotSize * 0.3, y + knotSize);
  }
  
  ctx.lineWidth = knotSize * 0.45;
  ctx.lineCap = 'round';
  ctx.strokeStyle = knot.outColor2;
  ctx.stroke();
  const pattern2 = getTexture(ctx);
  if (pattern2) {
    ctx.strokeStyle = pattern2;
    ctx.stroke();
  }

  // Highlight for the single edge loop
  ctx.beginPath();
  if (isLeft) {
    ctx.moveTo(x + knotSize * 0.2, y + 2);
    ctx.quadraticCurveTo(x, barY, x + knotSize * 0.25, y + knotSize - 4);
  } else {
    ctx.moveTo(x + currentKnotWidth - knotSize * 0.2, y + 2);
    ctx.quadraticCurveTo(x + currentKnotWidth, barY, x + currentKnotWidth - knotSize * 0.25, y + knotSize - 4);
  }
  
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.stroke();
};

const drawFestoonKnot: KnotRenderer = ({ ctx, knot, x, y, knotSize, currentKnotWidth, isLeftEdge, isRightEdge }) => {
  if (knot.type === 'NONE') return; // Draw nothing

  const segmentWidth = currentKnotWidth / 2;
  const centerX = x + currentKnotWidth / 2;

  // A festoon knot (half-hitch) covers the guide thread.
  // F: working thread is left (color1), guide is right (color2). Knot is color1.
  // B: working thread is right (color2), guide is left (color1). Knot is color2.
  const isForward = knot.type === 'F' || knot.type === 'F_NO_SWAP';
  const isBackward = knot.type === 'B' || knot.type === 'B_NO_SWAP';
  const knotColor = isForward ? knot.color1 : knot.color2;

  // Guide thread is hidden inside the knot so we don't draw it here.

  // Draw the festoon loops (working thread wrapping around)
  // Two diagonal loops
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Draw a horizontal pill shape to represent the wraps
  let pillWidth = segmentWidth * 1.3; // Horizontal width of the knot (wider)
  if (knot.type.includes('NO_SWAP')) {
    pillWidth = segmentWidth * 0.8; // Medio festón es solo una vuelta, más angosto
  }
  const pillHeight = knotSize * 0.35; // Vertical thickness (squashed)

  ctx.save();
  ctx.translate(centerX, y + knotSize / 2);

  // Angle for the zigzag
  // B knot goes down-right, F knot goes down-left
  let tiltMagnitude = 0.95; // Steep angle for chevron staircase effect
  if (knot.type.includes('NO_SWAP')) {
    tiltMagnitude = 0.2; // Half hitches are more horizontal
  }
  const tilt = isForward ? -tiltMagnitude : tiltMagnitude;
  ctx.rotate(tilt);

  // Background shadow
  ctx.beginPath();
  ctx.roundRect(-pillWidth / 2, -pillHeight / 2 + 2, pillWidth, pillHeight, pillHeight / 2);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fill();

  // Solid horizontal pill (the knot itself)
  ctx.beginPath();
  ctx.roundRect(-pillWidth / 2, -pillHeight / 2, pillWidth, pillHeight, pillHeight / 2);
  ctx.fillStyle = knotColor;
  ctx.fill();

  // Outline
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.stroke();

  // Draw the thread crossing down the middle of the knot
  const slant = 3;
  ctx.beginPath();
  if (isForward) {
    // Thread goes from bottom-left to top-right
    ctx.moveTo(-slant, pillHeight / 2 + 1);
    ctx.lineTo(slant, -pillHeight / 2 - 1);
  } else {
    // Thread goes from top-left to bottom-right
    ctx.moveTo(-slant, -pillHeight / 2 - 1);
    ctx.lineTo(slant, pillHeight / 2 + 1);
  }
  // Draw the thread shadow/outline first
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.stroke();

  // Draw the colored thread itself
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = knotColor;
  ctx.stroke();

  // Subtle horizontal highlights for the two bumps
  ctx.beginPath();
  ctx.moveTo(-pillWidth / 2 + 3, -pillHeight / 4);
  ctx.lineTo(-3, -pillHeight / 4);

  ctx.moveTo(3, -pillHeight / 4);
  ctx.lineTo(pillWidth / 2 - 3, -pillHeight / 4);

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.stroke();

  // Guide thread loop at the turnaround edges (only for standard F/B knots that swap)
  if (knot.type === 'F' || knot.type === 'B') {
    const guideColor = isForward ? knot.color2 : knot.color1;
    if (isBackward && isRightEdge) {
      // Draw a tiny loop on the right
      ctx.beginPath();
      ctx.arc(pillWidth / 2 - 1, 0, pillHeight / 2.5, -Math.PI / 2, Math.PI / 2);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = guideColor;
      ctx.stroke();
    }
    if (isForward && isLeftEdge) {
      // Draw a tiny loop on the left
      ctx.beginPath();
      ctx.arc(-pillWidth / 2 + 1, 0, pillHeight / 2.5, Math.PI / 2, Math.PI * 1.5);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = guideColor;
      ctx.stroke();
    }
  }

  ctx.restore();
};

const drawHalfFestoonKnot: KnotRenderer = ({ ctx, knot, x, y, knotSize, currentKnotWidth, patternId, rowIndex }) => {
  if (knot.type === 'NONE') return;

  const segmentWidth = currentKnotWidth / 2;

  const isForward = knot.type === 'F_NO_SWAP';
  const knotColor = isForward ? knot.color1 : knot.color2;

  // By default, center the knot between the two threads
  let centerX = x + currentKnotWidth / 2;

  // For alternating-half-hitch, we draw the knot exactly ON the guide thread
  // and draw the working thread looping inward and outward.
  const isAlternating = patternId === 'alternating-half-hitch';
  if (isAlternating) {
    // F_NO_SWAP: guide is thread 1 (right)
    // B_NO_SWAP: guide is thread 0 (left)
    centerX = isForward ? x + segmentWidth * 1.5 : x + segmentWidth * 0.5;
  }

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const pillWidth = segmentWidth * (isAlternating ? 1.5 : 0.8);
  const pillHeight = knotSize * (isAlternating ? 0.45 : 0.35);

  // Draw inward/outward slack loops for alternating pattern
  if (isAlternating) {
    const workingX = isForward ? x + segmentWidth * 0.5 : x + segmentWidth * 1.5;

    // Cap the top extension so it doesn't poke out of the top clip
    const topExtensionY = rowIndex === 0 ? 20 : y - knotSize * 1.5;

    // Shadow for the slack loop
    ctx.beginPath();
    // Start way above to fill the missing background line gap
    ctx.moveTo(workingX, topExtensionY);
    ctx.lineTo(workingX, y - knotSize * 0.1);
    // Curve inward to the knot
    ctx.quadraticCurveTo(workingX, y + knotSize * 0.2, centerX, y + knotSize / 2);
    // Curve outward from the knot
    ctx.quadraticCurveTo(workingX, y + knotSize * 0.8, workingX, y + knotSize * 1.1);
    // Extend way below to fill the next row's gap
    ctx.lineTo(workingX, y + knotSize * 2.5);

    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.stroke();

    // The slack loop
    ctx.beginPath();
    ctx.moveTo(workingX, topExtensionY);
    ctx.lineTo(workingX, y - knotSize * 0.1);
    ctx.quadraticCurveTo(workingX, y + knotSize * 0.2, centerX, y + knotSize / 2);
    ctx.quadraticCurveTo(workingX, y + knotSize * 0.8, workingX, y + knotSize * 1.1);
    ctx.lineTo(workingX, y + knotSize * 2.5);

    ctx.lineWidth = 3;
    ctx.strokeStyle = knotColor;
    ctx.stroke();
    const pattern = getTexture(ctx);
    if (pattern) {
      ctx.strokeStyle = pattern;
      ctx.stroke();
    }
  }

  ctx.save();
  ctx.translate(centerX, y + knotSize / 2);

  const tilt = isForward ? -0.2 : 0.2;
  ctx.rotate(tilt);

  // Background shadow
  ctx.beginPath();
  ctx.roundRect(-pillWidth / 2, -pillHeight / 2 + 2, pillWidth, pillHeight, pillHeight / 2);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fill();

  // Solid horizontal pill (the knot itself)
  ctx.beginPath();
  ctx.roundRect(-pillWidth / 2, -pillHeight / 2, pillWidth, pillHeight, pillHeight / 2);
  ctx.fillStyle = knotColor;
  ctx.fill();
  const pattern2 = getTexture(ctx);
  if (pattern2) {
    ctx.fillStyle = pattern2;
    ctx.fill();
  }

  // Outline
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.stroke();

  // Highlight for the single bump
  ctx.beginPath();
  ctx.moveTo(-pillWidth / 2 + 3, -pillHeight / 4);
  ctx.lineTo(pillWidth / 2 - 3, -pillHeight / 4);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.stroke();

  ctx.restore();
};

export const KNOT_RENDERERS: Record<string, KnotRenderer> = {
  HALF_SQUARE_L: drawHalfSquareKnot,
  HALF_SQUARE_R: drawHalfSquareKnot,
  F: drawFestoonKnot,
  B: drawFestoonKnot,
  F_NO_SWAP: drawHalfFestoonKnot,
  B_NO_SWAP: drawHalfFestoonKnot,
  NONE: () => { }, // Draw nothing
  NONE_1: () => { }, // Draw nothing
};

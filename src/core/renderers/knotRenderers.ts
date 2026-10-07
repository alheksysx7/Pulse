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
}

export type KnotRenderer = (params: RenderContext) => void;

const drawSquareKnot: KnotRenderer = ({ ctx, knot, x, y, knotSize, currentKnotWidth }) => {
  const centerX = x + currentKnotWidth / 2;
  
  // 1. Draw border/background loops (right thread = outColor2)
  ctx.beginPath();
  ctx.roundRect(centerX, y, currentKnotWidth / 2, knotSize / 2, 6);
  ctx.fillStyle = knot.outColor2;
  ctx.fill();
  
  ctx.beginPath();
  ctx.roundRect(x, y + knotSize / 2, currentKnotWidth / 2, knotSize / 2, 6);
  ctx.fillStyle = knot.outColor2;
  ctx.fill();
  
  // 2. Inner zigzag (left thread = outColor1)
  const slant = currentKnotWidth / 2 - 6; 
  ctx.beginPath();
  ctx.moveTo(centerX - slant, y);
  ctx.lineTo(centerX + slant, y + knotSize / 2);
  ctx.lineTo(centerX - slant, y + knotSize);
  
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = knot.outColor1;
  ctx.stroke();
  
  // Highlight for zigzag
  ctx.beginPath();
  ctx.moveTo(centerX - slant, y);
  ctx.lineTo(centerX + slant, y + knotSize / 2);
  ctx.lineTo(centerX - slant, y + knotSize);
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.stroke();
  
  // 3. Foreground wrapping curves (border thread wrapping OVER the zigzag elbows)
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.strokeStyle = knot.outColor2;
  
  // Right elbow wrap
  ctx.beginPath();
  ctx.moveTo(centerX + slant - 4, y + knotSize / 2 - 8);
  ctx.quadraticCurveTo(centerX + slant + 6, y + knotSize / 2, centerX + slant - 4, y + knotSize / 2 + 8);
  ctx.stroke();
  
  // Left elbow wrap (Top)
  ctx.beginPath();
  ctx.moveTo(centerX - slant + 4, y - 8);
  ctx.quadraticCurveTo(centerX - slant - 6, y, centerX - slant + 4, y + 8);
  ctx.stroke();
  
  // Left elbow wrap (Bottom)
  ctx.beginPath();
  ctx.moveTo(centerX - slant + 4, y + knotSize - 8);
  ctx.quadraticCurveTo(centerX - slant - 6, y + knotSize, centerX - slant + 4, y + knotSize + 8);
  ctx.stroke();
  
  // Add highlight to wraps
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath();
  ctx.moveTo(centerX + slant - 4, y + knotSize / 2 - 8);
  ctx.quadraticCurveTo(centerX + slant + 6, y + knotSize / 2, centerX + slant - 4, y + knotSize / 2 + 8);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(centerX - slant + 4, y - 8);
  ctx.quadraticCurveTo(centerX - slant - 6, y, centerX - slant + 4, y + 8);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(centerX - slant + 4, y + knotSize - 8);
  ctx.quadraticCurveTo(centerX - slant - 6, y + knotSize, centerX - slant + 4, y + knotSize + 8);
  ctx.stroke();
};

const drawHalfSquareKnot: KnotRenderer = ({ ctx, knot, x, y, knotSize, currentKnotWidth }) => {
  const segmentWidth = currentKnotWidth / knot.threadSpan;
  const centerX = x + segmentWidth * 1.5; // Center of the core thread
  
  // Draw the horizontal wrap (bump) over the core
  ctx.beginPath();
  ctx.moveTo(centerX - segmentWidth / 1.2, y + knotSize / 2);
  ctx.lineTo(centerX + segmentWidth / 1.2, y + knotSize / 2);
  ctx.lineWidth = knotSize * 0.6; // Thick horizontal bump covering the core
  ctx.lineCap = 'round';
  ctx.strokeStyle = knot.outColor1;
  ctx.stroke();
  
  // Highlight on the horizontal bump
  ctx.beginPath();
  ctx.moveTo(centerX - segmentWidth / 1.5, y + knotSize / 2 - 2);
  ctx.lineTo(centerX + segmentWidth / 1.5, y + knotSize / 2 - 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.stroke();
  
  // Shadow under the bump
  ctx.beginPath();
  ctx.moveTo(centerX - segmentWidth / 1.2, y + knotSize / 2 + 4);
  ctx.lineTo(centerX + segmentWidth / 1.2, y + knotSize / 2 + 4);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.stroke();

  // Draw the side loop connecting to the outer thread
  ctx.beginPath();
  if (knot.type === 'HALF_SQUARE_L') {
    // Loop on the left
    ctx.moveTo(centerX - segmentWidth / 1.2 + 2, y + knotSize / 2);
    ctx.quadraticCurveTo(x - 2, y + knotSize / 2, x + 2, y + 2);
    ctx.quadraticCurveTo(x + 4, y - knotSize / 4, centerX - segmentWidth, y - 2);
  } else {
    // Loop on the right
    ctx.moveTo(centerX + segmentWidth / 1.2 - 2, y + knotSize / 2);
    ctx.quadraticCurveTo(x + segmentWidth * 3 + 2, y + knotSize / 2, x + segmentWidth * 3 - 2, y + 2);
    ctx.quadraticCurveTo(x + segmentWidth * 3 - 4, y - knotSize / 4, centerX + segmentWidth, y - 2);
  }
  
  ctx.lineWidth = knotSize * 0.35;
  ctx.lineCap = 'round';
  ctx.strokeStyle = knot.outColor1;
  ctx.stroke();
  
  // Highlight for the side loop
  ctx.beginPath();
  if (knot.type === 'HALF_SQUARE_L') {
    ctx.moveTo(centerX - segmentWidth / 1.2 + 2, y + knotSize / 2 - 2);
    ctx.quadraticCurveTo(x, y + knotSize / 2 - 2, x + 2, y + 2);
  } else {
    ctx.moveTo(centerX + segmentWidth / 1.2 - 2, y + knotSize / 2 - 2);
    ctx.quadraticCurveTo(x + segmentWidth * 3, y + knotSize / 2 - 2, x + segmentWidth * 3 - 2, y + 2);
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.stroke();
};

const drawFestoonKnot: KnotRenderer = ({ ctx, knot, x, y, knotSize, currentKnotWidth, isLeftEdge, isRightEdge }) => {
  if (knot.type === 'NONE') return; // Draw nothing

  const segmentWidth = currentKnotWidth / 2;
  const centerX = x + currentKnotWidth / 2;
  
  // A festoon knot (half-hitch) covers the guide thread.
  // F: working thread is left (color1), guide is right (color2). Knot is color1.
  // B: working thread is right (color2), guide is left (color1). Knot is color2.
  const knotColor = knot.type === 'F' ? knot.color1 : knot.color2;
  
  // Guide thread is hidden inside the knot so we don't draw it here.

  // Draw the festoon loops (working thread wrapping around)
  // Two diagonal loops
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  // Draw a horizontal pill shape to represent the two side-by-side wraps
  const pillWidth = segmentWidth * 1.3; // Horizontal width of the knot (wider)
  const pillHeight = knotSize * 0.35; // Vertical thickness (squashed)
  
  ctx.save();
  ctx.translate(centerX, y + knotSize/2);
  
  // Angle for the zigzag
  // B knot goes down-right, F knot goes down-left
  const tilt = knot.type === 'F' ? -0.3 : 0.3; // Radians
  ctx.rotate(tilt);

  // Background shadow
  ctx.beginPath();
  ctx.roundRect(-pillWidth/2, -pillHeight/2 + 2, pillWidth, pillHeight, pillHeight/2);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fill();

  // Solid horizontal pill (the knot itself)
  ctx.beginPath();
  ctx.roundRect(-pillWidth/2, -pillHeight/2, pillWidth, pillHeight, pillHeight/2);
  ctx.fillStyle = knotColor;
  ctx.fill();
  
  // Outline
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.stroke();

  // Draw the thread crossing down the middle of the knot
  const slant = 3;
  ctx.beginPath();
  if (knot.type === 'F') {
    // Thread goes from bottom-left to top-right
    ctx.moveTo(-slant, pillHeight/2 + 1);
    ctx.lineTo(slant, -pillHeight/2 - 1);
  } else {
    // Thread goes from top-left to bottom-right
    ctx.moveTo(-slant, -pillHeight/2 - 1);
    ctx.lineTo(slant, pillHeight/2 + 1);
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
  ctx.moveTo(-pillWidth/2 + 3, -pillHeight/4);
  ctx.lineTo(-3, -pillHeight/4);
  
  ctx.moveTo(3, -pillHeight/4);
  ctx.lineTo(pillWidth/2 - 3, -pillHeight/4);
  
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.stroke();

  // Guide thread loop at the turnaround edges
  const guideColor = knot.type === 'F' ? knot.color2 : knot.color1;
  if (knot.type === 'B' && isRightEdge) {
    // Draw a tiny loop on the right
    ctx.beginPath();
    ctx.arc(pillWidth/2 - 1, 0, pillHeight/2.5, -Math.PI/2, Math.PI/2);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = guideColor;
    ctx.stroke();
  }
  if (knot.type === 'F' && isLeftEdge) {
    // Draw a tiny loop on the left
    ctx.beginPath();
    ctx.arc(-pillWidth/2 + 1, 0, pillHeight/2.5, Math.PI/2, Math.PI*1.5);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = guideColor;
    ctx.stroke();
  }

  ctx.restore();
};

export const KNOT_RENDERERS: Record<string, KnotRenderer> = {
  SQUARE: drawSquareKnot,
  HALF_SQUARE_L: drawHalfSquareKnot,
  HALF_SQUARE_R: drawHalfSquareKnot,
  F: drawFestoonKnot,
  B: drawFestoonKnot,
  NONE: () => {}, // Draw nothing
};

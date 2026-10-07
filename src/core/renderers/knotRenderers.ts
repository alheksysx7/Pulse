import type { Knot } from '../types';

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  knot: Knot;
  x: number;
  y: number;
  knotSize: number;
  currentKnotWidth: number;
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

export const KNOT_RENDERERS: Record<string, KnotRenderer> = {
  SQUARE: drawSquareKnot,
  HALF_SQUARE_L: drawHalfSquareKnot,
  HALF_SQUARE_R: drawHalfSquareKnot,
};

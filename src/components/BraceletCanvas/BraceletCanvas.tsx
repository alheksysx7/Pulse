import { useEffect, useRef } from 'react';
import { useDesignStore } from '../../store/useDesignStore';
import { PATTERNS } from '../../core/patterns';
import { simulateSequence } from '../../core/simulate';
import styles from './BraceletCanvas.module.css';

export function BraceletCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { patternId, threadsCount, rowsCount, colors } = useDesignStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // We will do a simple drawing first to test.
    const pattern = PATTERNS[patternId];
    const sequence = pattern.generateSequence(threadsCount, rowsCount);
    const shiftOddRows = pattern.shiftOddRows !== false;
    const { grid } = simulateSequence(colors, sequence, shiftOddRows);

    // Canvas setup
    const knotSize = 24;
    const padding = 20;
    
    // Width based on threads (each thread takes some width, knots combine 2 threads)
    const width = threadsCount * (knotSize / 2) + padding * 2;
    const height = rowsCount * knotSize + padding * 2;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw threads first
    grid.forEach((rowKnots, rowIndex) => {
      const isOddRow = rowIndex % 2 !== 0;
      const y = padding + rowIndex * knotSize + knotSize / 2;
      const prevY = y - knotSize;
      let xOffset = padding;
      if (isOddRow && shiftOddRows) xOffset += knotSize / 2;

      rowKnots.forEach((knot) => {
        const currentKnotWidth = (knot.threadSpan / 2) * knotSize;
        const x = xOffset + currentKnotWidth / 2;
        const segmentWidth = currentKnotWidth / knot.threadSpan;

        for (let i = 0; i < knot.threadSpan; i++) {
          const threadX = xOffset + (i + 0.5) * segmentWidth;
          const targetX = knot.type === 'SQUARE' ? threadX : x;
          const color = knot.inColors ? knot.inColors[i] : (i < knot.threadSpan / 2 ? knot.color1 : knot.color2);
          
          ctx.beginPath();
          ctx.moveTo(threadX, prevY);
          ctx.lineTo(targetX, y);
          ctx.lineWidth = 6; // Thicker threads to reduce gaps
          ctx.strokeStyle = color;
          ctx.stroke();
        }
        xOffset += currentKnotWidth;
      });
    });

    // Draw grid of knots
    grid.forEach((rowKnots, rowIndex) => {
      const isOddRow = rowIndex % 2 !== 0;
      const y = padding + rowIndex * knotSize;
      
      let xOffset = padding;
      if (isOddRow && shiftOddRows) {
        xOffset += knotSize / 2;
      }

      rowKnots.forEach((knot) => {
        const x = xOffset;
        const currentKnotWidth = (knot.threadSpan / 2) * knotSize;
        
        ctx.beginPath();
        if (knot.type === 'SQUARE') {
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
          
          // Left elbow wrap (Top, connects with previous row)
          ctx.beginPath();
          ctx.moveTo(centerX - slant + 4, y - 8);
          ctx.quadraticCurveTo(centerX - slant - 6, y, centerX - slant + 4, y + 8);
          ctx.stroke();
          
          // Left elbow wrap (Bottom, for the current row)
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
        } else {
          // Draw a circle for standard knots (fill the whole space)
          ctx.arc(x + currentKnotWidth / 2, y + knotSize / 2, knotSize / 2, 0, Math.PI * 2);
          ctx.fillStyle = knot.outColor1;
          ctx.fill();

          const gradient = ctx.createLinearGradient(x, y, x + currentKnotWidth, y + knotSize);
          gradient.addColorStop(0, 'rgba(255,255,255,0.4)');
          gradient.addColorStop(1, 'rgba(0,0,0,0.2)');
          ctx.fillStyle = gradient;
          ctx.fill();
        }
        
        xOffset += currentKnotWidth;
      });
    });

  }, [patternId, threadsCount, rowsCount, colors]);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

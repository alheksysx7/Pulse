import { useEffect, useRef, useState } from 'react';
import { useDesignStore } from '../../store/useDesignStore';
import { PATTERNS } from '../../core/patterns';
import { simulateSequence } from '../../core/simulate';
import styles from './BraceletCanvas.module.css';

export function BraceletCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  
  const { patternId, threadsCount, colors } = useDesignStore();

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // We will do a simple drawing first to test.
    const pattern = PATTERNS[patternId];
    // Canvas setup
    const knotSize = 24;
    let rowHeight = knotSize;
    if (patternId === 'square-alternating') {
      rowHeight = knotSize * 0.5;
    } else if (patternId === 'square' && threadsCount === 2) {
      rowHeight = knotSize * 0.75;
    }
    const padding = 20;
    
    // Width based on threads (each thread takes some width, knots combine 2 threads)
    let actualRowsCount = 10; // default
    if (containerHeight > 0) {
      const availableHeight = containerHeight - padding * 2;
      actualRowsCount = Math.max(1, Math.floor(availableHeight / rowHeight));
    }
    
    const sequence = pattern.generateSequence(threadsCount, actualRowsCount);
    const shiftOddRows = pattern.shiftOddRows !== false;
    const { grid } = simulateSequence(colors, sequence, shiftOddRows);

    const width = threadsCount * (knotSize / 2) + padding * 2;
    const height = actualRowsCount * rowHeight + padding * 2;

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
      const y = padding + rowIndex * rowHeight + knotSize / 2;
      const prevY = rowIndex === 0 ? padding : y - rowHeight;
      let xOffset = padding;
      if (isOddRow && shiftOddRows) xOffset += knotSize / 2;

      rowKnots.forEach((knot) => {
        const currentKnotWidth = (knot.threadSpan / 2) * knotSize;
        const segmentWidth = currentKnotWidth / knot.threadSpan;

        for (let i = 0; i < knot.threadSpan; i++) {
          const threadX = xOffset + (i + 0.5) * segmentWidth;
          const targetX = threadX;
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
      const y = padding + rowIndex * rowHeight;
      
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
        } else if (knot.type === 'HALF_SQUARE_L' || knot.type === 'HALF_SQUARE_R') {
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
        }
        
        xOffset += currentKnotWidth;
      });
    });

  }, [patternId, threadsCount, colors, containerHeight]);

  return (
    <div ref={containerRef} className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

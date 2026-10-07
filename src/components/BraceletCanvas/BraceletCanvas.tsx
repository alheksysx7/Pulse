import { useEffect, useRef, useState } from 'react';
import { useDesignStore } from '../../store/useDesignStore';
import { PATTERNS } from '../../core/patterns';
import { simulateSequence } from '../../core/simulate';
import { KNOT_RENDERERS } from '../../core/renderers/knotRenderers';
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
    const paddingX = 40;
    const paddingTop = 80;
    const paddingBottom = 80;
    
    // Width based on threads (each thread takes some width, knots combine 2 threads)
    let actualRowsCount = 10; // default
    if (containerHeight > 0) {
      const availableHeight = containerHeight - paddingTop - paddingBottom;
      actualRowsCount = Math.max(1, Math.floor(availableHeight / rowHeight));
    }
    
    const sequence = pattern.generateSequence(threadsCount, actualRowsCount);
    const shiftOddRows = pattern.shiftOddRows !== false;
    const { grid, finalColors } = simulateSequence(colors, sequence, shiftOddRows);

    const width = threadsCount * (knotSize / 2) + paddingX * 2;
    const height = actualRowsCount * rowHeight + paddingTop + paddingBottom;

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
      const y = paddingTop + rowIndex * rowHeight + knotSize / 2;
      const prevY = rowIndex === 0 ? 20 : y - rowHeight;
      let xOffset = paddingX;
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

    // Draw bottom tails
    if (grid.length > 0) {
      const lastY = paddingTop + (grid.length - 1) * rowHeight + knotSize / 2;
      finalColors.forEach((color, i) => {
        const threadX = paddingX + (i + 0.5) * (knotSize / 2);
        ctx.beginPath();
        ctx.moveTo(threadX, lastY);
        ctx.lineTo(threadX, height - 20);
        ctx.lineWidth = 6;
        ctx.strokeStyle = color;
        ctx.stroke();
      });
    }

    // Draw grid of knots
    grid.forEach((rowKnots, rowIndex) => {
      const isOddRow = rowIndex % 2 !== 0;
      const y = paddingTop + rowIndex * rowHeight;
      
      let xOffset = paddingX;
      if (isOddRow && shiftOddRows) {
        xOffset += knotSize / 2;
      }

      rowKnots.forEach((knot) => {
        const x = xOffset;
        const currentKnotWidth = (knot.threadSpan / 2) * knotSize;
        
        const renderer = KNOT_RENDERERS[knot.type];
        if (renderer) {
          renderer({ ctx, knot, x, y, knotSize, currentKnotWidth });
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

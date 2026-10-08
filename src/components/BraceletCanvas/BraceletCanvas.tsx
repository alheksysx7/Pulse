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
    } else if (patternId === 'zigzag-festoon') {
      rowHeight = knotSize * 0.22;
    }
    const paddingX = 40;
    const paddingTop = 80;
    const paddingBottom = 80;

    // Generate an excess of rows to guarantee we fill the screen
    let actualRowsCount = 50;
    const availableHeight = Math.max(100, containerHeight - paddingTop - paddingBottom);
    if (containerHeight > 0) {
      // Multiply by 2 because some patterns skip rows (NONE knots) which don't add to height
      actualRowsCount = Math.max(10, Math.floor(availableHeight / rowHeight) * 2);
    }

    const sequence = pattern.generateSequence(threadsCount, actualRowsCount);
    const shiftOddRows = pattern.shiftOddRows !== false;
    let { grid, finalColors } = simulateSequence(colors, sequence, shiftOddRows);

    const rowY: number[] = [];
    let currentY = paddingTop;
    let cutoffIndex = grid.length;

    for (let i = 0; i < grid.length; i++) {
      const rowKnots = grid[i];
      rowY.push(currentY);

      const hasKnots = rowKnots.some(k => k.type !== 'NONE');
      if (hasKnots) {
        currentY += rowHeight;
      }

      // If we've reached the bottom, stop here
      if (currentY - paddingTop > availableHeight) {
        cutoffIndex = i + 1;
        break;
      }
    }

    // Trim the sequence and re-simulate to get the correct final colors at the cutoff point
    const trimmedSequence = sequence.slice(0, cutoffIndex);
    const finalSim = simulateSequence(colors, trimmedSequence, shiftOddRows);
    grid = finalSim.grid;
    finalColors = finalSim.finalColors;

    const width = threadsCount * (knotSize / 2) + paddingX * 2;
    const height = currentY + paddingBottom;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Track X positions for smooth slanting
    const prevThreadX = new Array(threadsCount).fill(0).map((_, i) => paddingX + (i + 0.5) * (knotSize / 2));

    // Draw threads first
    grid.forEach((rowKnots, rowIndex) => {
      const isOddRow = rowIndex % 2 !== 0;
      const y = rowY[rowIndex] + knotSize / 2;
      const prevY = rowIndex === 0 ? 20 : rowY[rowIndex - 1] + knotSize / 2;
      let xOffset = paddingX;

      let globalThreadIndex = 0;
      const currentThreadX = [...prevThreadX];

      rowKnots.forEach((knot) => {
        const currentKnotWidth = (knot.threadSpan / 2) * knotSize;
        const segmentWidth = currentKnotWidth / knot.threadSpan;

        for (let i = 0; i < knot.threadSpan; i++) {
          const nominalX = xOffset + (i + 0.5) * segmentWidth;
          let targetX = nominalX;

          if (patternId === 'zigzag-festoon' && knot.threadSpan === 2) {
            const centerX = xOffset + currentKnotWidth / 2;
            // Pull threads to +/- 3px from center of the knot
            targetX = centerX + (i === 0 ? -3 : 3);
          }

          const startX = prevThreadX[globalThreadIndex];
          const color = knot.inColors ? knot.inColors[i] : (i < knot.threadSpan / 2 ? knot.color1 : knot.color2);

          // Hide unknotted threads (NONE) ONLY on the extreme edges so they don't stick out.
          // Internal NONE threads should be drawn so they are visible in the zigzag gaps.
          const isEdgeThread = globalThreadIndex === 0 || globalThreadIndex === threadsCount - 1;
          const shouldHide = knot.type === 'NONE' && isEdgeThread && patternId !== 'zigzag-festoon';

          if (!shouldHide) {
            if (patternId === 'zigzag-festoon') {
              // Draw drop shadow for the thread (shifted right and down so it's visible on vertical lines)
              ctx.beginPath();
              ctx.moveTo(startX + 2, prevY + 2);
              ctx.lineTo(targetX + 2, y + 2);
              ctx.lineWidth = 6;
              ctx.strokeStyle = 'rgba(0,0,0,0.2)';
              ctx.stroke();
            }

            // Draw the actual thread
            ctx.beginPath();
            ctx.moveTo(startX, prevY);
            ctx.lineTo(targetX, y);
            ctx.lineWidth = 6; // Thicker threads to reduce gaps
            ctx.strokeStyle = color;

            if (patternId === 'zigzag-festoon' && rowIndex > 0) {
              ctx.globalAlpha = 0.3;
            }
            ctx.stroke();
            if (patternId === 'zigzag-festoon' && rowIndex > 0) {
              ctx.globalAlpha = 1.0;
            }
          }

          currentThreadX[globalThreadIndex] = targetX;
          globalThreadIndex++;
        }
        xOffset += currentKnotWidth;
      });

      for (let i = 0; i < threadsCount; i++) {
        prevThreadX[i] = currentThreadX[i];
      }
    });

    // Draw bottom tails
    if (grid.length > 0) {
      const lastY = rowY[grid.length - 1] + knotSize / 2;
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

    // Draw grid of knots (bottom to top so upper knots overlap lower ones)
    const reversedGrid = [...grid].reverse();
    reversedGrid.forEach((rowKnots, reverseIndex) => {
      const rowIndex = grid.length - 1 - reverseIndex;
      const isOddRow = rowIndex % 2 !== 0;
      const y = rowY[rowIndex];

      let xOffset = paddingX;

      let firstNonEmptyIndex = -1;
      let lastNonEmptyIndex = -1;
      rowKnots.forEach((k, i) => {
        if (k.type !== 'NONE') {
          if (firstNonEmptyIndex === -1) firstNonEmptyIndex = i;
          lastNonEmptyIndex = i;
        }
      });

      rowKnots.forEach((knot, knotIndex) => {
        const x = xOffset;
        const currentKnotWidth = (knot.threadSpan / 2) * knotSize;
        const isLeftEdge = Math.abs(x - paddingX) < 1;
        const isRightEdge = Math.abs((x + currentKnotWidth) - (paddingX + threadsCount * (knotSize / 2))) < 1;

        const renderer = KNOT_RENDERERS[knot.type];
        if (renderer) {
          renderer({ ctx, knot, x, y, knotSize, currentKnotWidth, isLeftEdge, isRightEdge });
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

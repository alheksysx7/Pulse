import { useEffect, useRef, useState } from 'react';
import { useDesignStore } from '../../store/useDesignStore';
import { PATTERNS } from '../../core/patterns';
import { simulateSequence } from '../../core/simulate';
import { KNOT_RENDERERS, getTexture } from '../../core/renderers/knotRenderers';
import styles from './BraceletCanvas.module.css';

const getBrightness = (hex: string) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  return (r * 299 + g * 587 + b * 114) / 1000;
};

export function BraceletCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  const { patternId, threadsCount, colors, verticalSpacing, knotSize, showBeads, beadType } = useDesignStore();

  const avgBrightness = colors.reduce((acc, c) => acc + getBrightness(c), 0) / colors.length;
  const isLightPalette = avgBrightness > 200;

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
    // Canvas setup using knotSize from store
    const baseRowHeightRatio = pattern?.baseRowHeightRatio ?? (patternId === 'square' && threadsCount === 2 ? 0.75 : 1);
    const baseRowHeight = knotSize * baseRowHeightRatio;

    // Apply user's vertical spacing multiplier
    const rowHeight = baseRowHeight * useDesignStore.getState().verticalSpacing;

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

      // If adding another row would exceed the available height, stop here
      if (currentY - paddingTop + rowHeight > availableHeight) {
        cutoffIndex = i + 1;
        break;
      }
    }

    if (patternId === 'diagonal-pairs-6') {
      // Garantizar que la pulsera termine con la diagonal sobre la guía completa (filas 4, 8, 12, etc.)
      for (let i = cutoffIndex - 1; i >= 4; i--) {
        if (i % 4 === 0) {
          cutoffIndex = i + 1;
          currentY = rowY[i] + rowHeight;
          break;
        }
      }
    }

    // Trim the sequence and re-simulate to get the correct final colors at the cutoff point
    const trimmedSequence = sequence.slice(0, cutoffIndex);
    if (patternId === 'diagonal-pairs-6' && trimmedSequence.length >= 5) {
      const last = trimmedSequence.length - 1;
      trimmedSequence[last - 2] = ['NONE', 'B', trimmedSequence.length >= 8 ? 'F' : 'NONE'];
      trimmedSequence[last - 1] = ['NONE', 'B'];
      trimmedSequence[last] = ['NONE', 'NONE', 'B'];
    }
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

    // Helper to get consistent horizontal position for threads
    const getNominalThreadX = (i: number) => {
      return paddingX + (i + 0.5) * (knotSize / 2);
    };

    // Track X positions for smooth slanting
    const prevThreadX = new Array(threadsCount).fill(0).map((_, i) => getNominalThreadX(i));

    let consecutiveLeftNones = 0;
    let consecutiveRightNones = 0;
    const hasThreadKnotted = new Array(threadsCount).fill(false);

    // Draw threads first
    grid.forEach((rowKnots, rowIndex) => {
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
          const isLeftEdge = globalThreadIndex === 0;
          const isRightEdge = globalThreadIndex === threadsCount - 1;

          if (isLeftEdge) {
            if (knot.type === 'NONE') consecutiveLeftNones++;
            else consecutiveLeftNones = 0;
          }
          if (isRightEdge) {
            if (knot.type === 'NONE') consecutiveRightNones++;
            else consecutiveRightNones = 0;
          }

          let shouldHide = false;

          if (patternId === 'alternating-half-hitch') {
            // Hide the straight background line for the working threads, because the renderer will draw the diagonal inward/outward loops
            if (knot.type === 'F_NO_SWAP' && i === 0) shouldHide = true;
            if (knot.type === 'B_NO_SWAP' && i === 1) shouldHide = true;
          } else if (patternId === 'alternating-2-thread') {
            // Hide ALL straight background lines because the renderer manually draws the core thread zigzagging to the center, and the working thread slack loops
            shouldHide = true;
          } else if (patternId === 'diagonal-pairs-6') {
            // Ocultar las líneas verticales tras el tejido solo después de que el hilo ya haya entrado a su primer nudo
            if (hasThreadKnotted[globalThreadIndex]) {
              shouldHide = true;
            }
          }
          if (!shouldHide) {
            const isEdge = isLeftEdge || isRightEdge;

            if (pattern?.innerThreadAlpha !== undefined && !isEdge && rowIndex > 0) {
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

            if (pattern?.innerThreadAlpha !== undefined && !isEdge && rowIndex > 0) {
              ctx.globalAlpha = pattern.innerThreadAlpha;
            }
            ctx.stroke();

            const tex = getTexture(ctx);
            if (tex) {
              ctx.strokeStyle = tex;
              ctx.stroke();
            }
            ctx.globalAlpha = 1.0;

            // Draw beads if enabled (only once per segment, on the 2nd consecutive NONE row)
            const isBeadRow = (isLeftEdge && consecutiveLeftNones === 2) || (isRightEdge && consecutiveRightNones === 2);

            if (showBeads && patternId === 'jumping-festoon' && isBeadRow && rowIndex >= threadsCount - 1) {
              const beadRadius = 6;
              const beadY = (prevY + y) / 2;

              let baseColor = '#FFD700';
              let strokeColor = '#B8860B';
              let highlightColor = 'rgba(255, 255, 255, 0.8)';

              if (beadType === 'silver') {
                baseColor = '#E0E0E0';
                strokeColor = '#9E9E9E';
                highlightColor = 'rgba(255, 255, 255, 0.9)';
              } else if (beadType === 'wood') {
                baseColor = '#8B5A2B';
                strokeColor = '#3e2710';
                highlightColor = 'rgba(255, 255, 255, 0.2)';
              }

              // Bead base color
              ctx.beginPath();
              ctx.arc(targetX, beadY, beadRadius, 0, Math.PI * 2);
              ctx.fillStyle = baseColor;
              ctx.fill();
              ctx.lineWidth = 1;
              ctx.strokeStyle = strokeColor;
              ctx.stroke();

              // Small highlight for a metallic/spherical look
              ctx.beginPath();
              ctx.arc(targetX - 2.5, beadY - 2.5, beadRadius * 0.35, 0, Math.PI * 2);
              ctx.fillStyle = highlightColor;
              ctx.fill();
            }
          }

          if (knot.type !== 'NONE' && knot.type !== 'NONE_1') {
            hasThreadKnotted[globalThreadIndex] = true;
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
      const lastRowIndex = grid.length - 1;

      // Track the row of the last active knot for each thread column
      const lastKnotRow = new Array(threadsCount).fill(lastRowIndex);
      if (patternId === 'diagonal-pairs-6') {
        grid.forEach((rowKnots, rIndex) => {
          let tIdx = 0;
          rowKnots.forEach((k) => {
            for (let s = 0; s < k.threadSpan; s++) {
              if (k.type !== 'NONE' && k.type !== 'NONE_1') {
                lastKnotRow[tIdx] = rIndex;
              }
              tIdx++;
            }
          });
        });
      }

      finalColors.forEach((color, i) => {
        let threadX = prevThreadX[i];
        let startY = rowY[lastRowIndex] + knotSize / 2;

        if (patternId === 'diagonal-pairs-6') {
          startY = rowY[lastKnotRow[i]] + knotSize / 2;
        } else if (patternId === 'alternating-2-thread') {
          startY = rowY[lastRowIndex] + knotSize;
          const knot = grid[lastRowIndex][0];
          if (knot && knot.type !== 'NONE') {
            const segmentWidth = knotSize / 2;
            const centerX = paddingX + segmentWidth;
            const leftEdge = paddingX + segmentWidth * 0.5;
            const rightEdge = paddingX + segmentWidth * 1.5;
            if (knot.type === 'F_NO_SWAP') {
              threadX = i === 0 ? centerX : rightEdge;
            } else if (knot.type === 'B_NO_SWAP') {
              threadX = i === 1 ? centerX : leftEdge;
            }
          }
        }

        ctx.beginPath();
        ctx.moveTo(threadX, startY);
        ctx.lineTo(threadX, height - 20);
        ctx.lineWidth = 6;
        ctx.strokeStyle = color;
        ctx.stroke();

        const tex = getTexture(ctx);
        if (tex) {
          ctx.strokeStyle = tex;
          ctx.stroke();
        }
      });
    }

    // Draw grid of knots (bottom to top so upper knots overlap lower ones)
    const reversedGrid = [...grid].reverse();
    reversedGrid.forEach((rowKnots, reverseIndex) => {
      const rowIndex = grid.length - 1 - reverseIndex;
      const y = rowY[rowIndex];

      let xOffset = paddingX;

      rowKnots.forEach((knot) => {
        const x = xOffset;
        const currentKnotWidth = (knot.threadSpan / 2) * knotSize;
        const isLeftEdge = Math.abs(x - paddingX) < 1;
        const isRightEdge = Math.abs((x + currentKnotWidth) - (paddingX + threadsCount * (knotSize / 2))) < 1;

        const renderer = KNOT_RENDERERS[knot.type];
        if (renderer) {
          renderer({ ctx, knot, x, y, knotSize, currentKnotWidth, isLeftEdge, isRightEdge, patternId, rowIndex });
        }

        xOffset += currentKnotWidth;
      });
    });

  }, [patternId, threadsCount, colors, containerHeight, verticalSpacing, knotSize, showBeads, beadType]);

  return (
    <div ref={containerRef} className={`${styles.container} ${isLightPalette ? styles.darkBackground : ''}`}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

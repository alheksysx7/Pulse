import { useEffect, useRef, useState, useCallback } from 'react';
import { useDesignStore } from '../../store/useDesignStore';
import { PATTERNS } from '../../core/patterns';
import { simulateSequence } from '../../core/simulate';
import { KNOT_RENDERERS, getTexture } from '../../core/renderers/knotRenderers';
import type { Knot } from '../../core/types';
import styles from './BraceletCanvas.module.css';

interface DrawnKnot {
  rowIndex: number;
  knot: Knot;
  x: number;
  y: number;
  width: number;
  height: number;
}

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

  const {
    patternId,
    threadsCount,
    colors,
    segments,
    highlightedThreadId,
    selectedKnot,
    setSelectedKnot,
    verticalSpacing,
    knotSize,
    showBeads,
    beadType
  } = useDesignStore();

  const [hoveredKnot, setHoveredKnot] = useState<{ rowIndex: number; x: number; y: number } | null>(null);
  const drawnKnotsRef = useRef<DrawnKnot[]>([]);

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
      const effectiveRowStep = patternId === 'zigzag-festoon' ? Math.max(rowHeight, 2.5) : rowHeight;
      actualRowsCount = Math.min(300, Math.max(10, Math.floor(availableHeight / effectiveRowStep) * 2));
    }

    const sequence = pattern.generateSequence(threadsCount, actualRowsCount);
    const shiftOddRows = pattern.shiftOddRows !== false;
    let { grid, finalColors } = simulateSequence(colors, sequence, shiftOddRows, segments);

    const rowY: number[] = [];
    let currentY = paddingTop;
    let cutoffIndex = grid.length;

    const isZigzagFestoon = patternId === 'zigzag-festoon';
    const currentVs = useDesignStore.getState().verticalSpacing;
    const minVs = pattern.minVerticalSpacing ?? 0.2;
    const tiltFactor = Math.max(0, (currentVs - minVs) / (0.7 - minVs));
    const inPassStep = isZigzagFestoon ? rowHeight * Math.min(1.0, tiltFactor) : rowHeight;
    // cornerStep must be at least the knot height (knotSize * 0.35) plus spacing to prevent superposition
    const cornerStep = isZigzagFestoon ? Math.max(rowHeight * 2, knotSize * 0.35 + 2) : rowHeight * 2;

    for (let i = 0; i < grid.length; i++) {
      const rowKnots = grid[i];
      rowY.push(currentY);

      let stepY = rowHeight;
      if (isZigzagFestoon) {
        const cycleIdx = i % 6;
        if (cycleIdx === 0 || cycleIdx === 3) {
          stepY = inPassStep;
        } else {
          stepY = cornerStep / 2;
        }
      } else {
        const hasKnots = rowKnots.some(k => k.type !== 'NONE');
        if (!hasKnots) {
          stepY = 0;
        }
      }

      currentY += stepY;

      // If adding another row would exceed the available height, stop here
      if (currentY - paddingTop + stepY > availableHeight) {
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
    const finalSim = simulateSequence(colors, trimmedSequence, shiftOddRows, segments);
    grid = finalSim.grid;
    finalColors = finalSim.finalColors;

    const horizontalStep = (knotSize / 2) * (pattern?.horizontalSpacingRatio ?? 1.0);
    const width = threadsCount * horizontalStep + paddingX * 2;
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
      return paddingX + (i + 0.5) * horizontalStep;
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
        const currentKnotWidth = knot.threadSpan * horizontalStep;
        const segmentWidth = horizontalStep;

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
            const isInnerThread = pattern?.applyAlphaToEdges ? true : !isEdge;
            const shouldApplyAlpha = pattern?.innerThreadAlpha !== undefined && isInnerThread && rowIndex > 0;

            if (shouldApplyAlpha) {
              ctx.globalAlpha = pattern.innerThreadAlpha!;
              // Draw drop shadow for the thread (shifted right and down so it's visible on vertical lines)
              ctx.beginPath();
              ctx.moveTo(startX + 2, prevY + 2);
              ctx.lineTo(targetX + 2, y + 2);
              ctx.lineWidth = 6;
              ctx.strokeStyle = 'rgba(0,0,0,0.2)';
              ctx.stroke();
            }

            const currentThreadId = knot.inThreadIds ? knot.inThreadIds[i] : undefined;
            const isThreadHighlighted = currentThreadId !== undefined && currentThreadId === highlightedThreadId;

            // Draw the actual thread
            ctx.beginPath();
            ctx.moveTo(startX, prevY);
            ctx.lineTo(targetX, y);
            ctx.lineWidth = isThreadHighlighted ? 8 : 6; // Thicker threads to reduce gaps
            ctx.strokeStyle = isThreadHighlighted ? '#ffffff' : color;
            ctx.stroke();

            if (isThreadHighlighted) {
              // Draw colored core inside highlight
              ctx.beginPath();
              ctx.moveTo(startX, prevY);
              ctx.lineTo(targetX, y);
              ctx.lineWidth = 5;
              ctx.strokeStyle = color;
              ctx.stroke();
            }

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

    // Draw guide thread turnaround loops at the corners for zigzag-festoon connecting both knots
    if (patternId === 'zigzag-festoon') {
      const pillWidth = (knotSize / 2) * 1.3;
      const bulge = Math.max(5, knotSize * 0.22);

      for (let r = 0; r < grid.length - 2; r++) {
        const cycleIdx = r % 6;
        if (cycleIdx === 1) {
          // Right corner: connects row r (knot 1-2) with row r + 2 (knot 1-2)
          const knotUpper = grid[r].find(k => k.threadSpan === 2);
          const knotLower = grid[r + 2].find(k => k.threadSpan === 2);
          if (knotUpper && knotLower) {
            const guideColor = knotUpper.color1;
            const centerX = paddingX + 2 * horizontalStep;
            const xRight = centerX + pillWidth / 2;
            const yUpper = rowY[r] + knotSize / 2;
            const yLower = rowY[r + 2] + knotSize / 2;
            const startX = xRight - 3;
            const endX = xRight - 3;

            // Shadow
            ctx.beginPath();
            ctx.moveTo(startX, yUpper + 1);
            ctx.bezierCurveTo(xRight + bulge + 1, yUpper + 1, xRight + bulge + 1, yLower + 1, endX, yLower + 1);
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.stroke();

            // Guide loop connecting both knots
            ctx.beginPath();
            ctx.moveTo(startX, yUpper);
            ctx.bezierCurveTo(xRight + bulge, yUpper, xRight + bulge, yLower, endX, yLower);
            ctx.lineWidth = 3;
            ctx.strokeStyle = guideColor;
            ctx.stroke();

            const tex = getTexture(ctx);
            if (tex) {
              ctx.strokeStyle = tex;
              ctx.stroke();
            }
          }
        } else if (cycleIdx === 4) {
          // Left corner: connects row r (knot 0-1) with row r + 2 (knot 0-1)
          const knotUpper = grid[r].find(k => k.threadSpan === 2);
          const knotLower = grid[r + 2].find(k => k.threadSpan === 2);
          if (knotUpper && knotLower) {
            const guideColor = knotUpper.color2;
            const centerX = paddingX + horizontalStep;
            const xLeft = centerX - pillWidth / 2;
            const yUpper = rowY[r] + knotSize / 2;
            const yLower = rowY[r + 2] + knotSize / 2;
            const startX = xLeft + 3;
            const endX = xLeft + 3;

            // Shadow
            ctx.beginPath();
            ctx.moveTo(startX, yUpper + 1);
            ctx.bezierCurveTo(xLeft - bulge - 1, yUpper + 1, xLeft - bulge - 1, yLower + 1, endX, yLower + 1);
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.stroke();

            // Guide loop connecting both knots
            ctx.beginPath();
            ctx.moveTo(startX, yUpper);
            ctx.bezierCurveTo(xLeft - bulge, yUpper, xLeft - bulge, yLower, endX, yLower);
            ctx.lineWidth = 3;
            ctx.strokeStyle = guideColor;
            ctx.stroke();

            const tex = getTexture(ctx);
            if (tex) {
              ctx.strokeStyle = tex;
              ctx.stroke();
            }
          }
        }
      }
    }

    // Clear and populate drawn knots for interactive hit-testing
    const drawnKnots: DrawnKnot[] = [];

    // Draw grid of knots (bottom to top so upper knots overlap lower ones)
    const reversedGrid = [...grid].reverse();
    reversedGrid.forEach((rowKnots, reverseIndex) => {
      const rowIndex = grid.length - 1 - reverseIndex;
      const y = rowY[rowIndex];

      let xOffset = paddingX;

      rowKnots.forEach((knot) => {
        const x = xOffset;
        const currentKnotWidth = knot.threadSpan * horizontalStep;
        const isLeftEdge = Math.abs(x - paddingX) < 1;
        const isRightEdge = Math.abs((x + currentKnotWidth) - (paddingX + threadsCount * horizontalStep)) < 1;

        const renderer = KNOT_RENDERERS[knot.type];
        if (renderer) {
          renderer({ ctx, knot, x, y, knotSize, currentKnotWidth, isLeftEdge, isRightEdge, patternId, rowIndex, verticalSpacing });
        }

        // Only festoon knots are interactive for color divisions
        const isFestoon = knot.type === 'F' || knot.type === 'B' || knot.type === 'F_NO_SWAP' || knot.type === 'B_NO_SWAP';
        if (isFestoon && knot.inThreadIds && knot.inThreadIds.length > 0) {
          drawnKnots.push({
            rowIndex,
            knot,
            x,
            y,
            width: currentKnotWidth,
            height: knotSize
          });
        }

        xOffset += currentKnotWidth;
      });
    });

    drawnKnotsRef.current = drawnKnots;

    // Draw selection or hover ring on top
    const targetKnot = selectedKnot 
      ? { rowIndex: selectedKnot.rowIndex, x: selectedKnot.canvasX, y: selectedKnot.canvasY }
      : hoveredKnot;

    if (targetKnot) {
      const match = drawnKnots.find(dk => dk.rowIndex === targetKnot.rowIndex && Math.abs(dk.x - targetKnot.x) < 5);
      if (match) {
        ctx.save();
        const centerX = match.x + match.width / 2;
        const centerY = match.y + match.height / 2;
        const radius = Math.max(match.width, match.height) / 2 + 3;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = selectedKnot ? '#D36C50' : 'rgba(211, 108, 80, 0.6)';
        ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.restore();
      }
    }

  }, [patternId, threadsCount, colors, segments, highlightedThreadId, containerHeight, verticalSpacing, knotSize, showBeads, beadType, hoveredKnot, selectedKnot]);

  // Pointer event handlers for hit testing festoon knots
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    // Only handle mouse / desktop hover
    if (e.pointerType === 'touch') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / (window.devicePixelRatio || 1) / rect.width;
    const scaleY = canvas.height / (window.devicePixelRatio || 1) / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Find any knot bounding box containing (x, y)
    const match = drawnKnotsRef.current.find(k => {
      const pad = 4;
      return x >= k.x - pad && x <= k.x + k.width + pad && y >= k.y - pad && y <= k.y + k.height + pad;
    });

    if (match) {
      canvas.style.cursor = 'pointer';
      if (!hoveredKnot || hoveredKnot.rowIndex !== match.rowIndex || hoveredKnot.x !== match.x) {
        setHoveredKnot({ rowIndex: match.rowIndex, x: match.x, y: match.y });
      }
    } else {
      canvas.style.cursor = 'default';
      if (hoveredKnot) {
        setHoveredKnot(null);
      }
    }
  }, [hoveredKnot]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / (window.devicePixelRatio || 1) / rect.width;
    const scaleY = canvas.height / (window.devicePixelRatio || 1) / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const match = drawnKnotsRef.current.find(k => {
      const pad = 6;
      return x >= k.x - pad && x <= k.x + k.width + pad && y >= k.y - pad && y <= k.y + k.height + pad;
    });

    if (match && match.knot.inThreadIds && match.knot.inColors) {
      // Calculate exact knot screen position from canvas coordinates
      const knotScreenLeft = rect.left + (match.x / scaleX);
      const knotScreenTop = rect.top + (match.y / scaleY);
      const knotScreenWidth = match.width / scaleX;
      const knotScreenHeight = match.height / scaleY;

      // Also get container bounds (the visible viewport of the simulation canvas)
      setSelectedKnot({
        rowIndex: match.rowIndex,
        knotType: match.knot.type,
        inThreadIds: match.knot.inThreadIds,
        inColors: match.knot.inColors,
        screenX: knotScreenLeft + knotScreenWidth / 2,
        screenY: knotScreenTop + knotScreenHeight / 2,
        canvasX: match.x,
        canvasY: match.y,
      });
    }
  }, [setSelectedKnot]);

  return (
    <div ref={containerRef} className={`${styles.container} ${isLightPalette ? styles.darkBackground : ''}`}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
      />
    </div>
  );
}

import { useDesignStore } from '../../store/useDesignStore';
import { PATTERNS } from '../../core/patterns';
import { simulateSequence } from '../../core/simulate';
import styles from './KnotDiagram.module.css';

export function KnotDiagram() {
  const { patternId, threadsCount, rowsCount, colors } = useDesignStore();

  const pattern = PATTERNS[patternId];
  const actualRowsCount = patternId === 'square-alternating' ? rowsCount * 2 : rowsCount;
  const sequence = pattern.generateSequence(threadsCount, actualRowsCount);
  const shiftOddRows = pattern.shiftOddRows !== false;
  const { grid } = simulateSequence(colors, sequence, shiftOddRows);

  const knotSize = 30;
  const rowHeight = knotSize;
  const padding = 20;
  const width = threadsCount * (knotSize / 2) + padding * 2;
  const height = actualRowsCount * rowHeight + padding * 2;

  const renderArrow = (type: string, x: number, y: number, r: number) => {
    const size = r * 0.6;
    if (type === 'F') {
      return (
        <path 
          d={`M${x - size},${y - size} L${x + size},${y + size} M${x + size},${y + size} L${x},${y + size} M${x + size},${y + size} L${x + size},${y}`} 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none" 
        />
      );
    } else if (type === 'B') {
      return (
        <path 
          d={`M${x + size},${y - size} L${x - size},${y + size} M${x - size},${y + size} L${x},${y + size} M${x - size},${y + size} L${x - size},${y}`} 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none" 
        />
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <svg width={width} height={height} className={styles.svg}>
        <g className={styles.threads}>
          {grid.map((rowKnots, rowIndex) => {
            const isOddRow = rowIndex % 2 !== 0;
            const y = padding + rowIndex * rowHeight + knotSize / 2;
            let xOffset = padding;
            if (isOddRow && shiftOddRows) xOffset += knotSize / 2;
            
            return rowKnots.map((knot, knotIndex) => {
              const currentKnotWidth = (knot.threadSpan / 2) * knotSize;
              const x = xOffset + currentKnotWidth / 2;
              const prevY = rowIndex === 0 ? padding : y - rowHeight;
              
              const elements = [];
              const segmentWidth = currentKnotWidth / knot.threadSpan;
              
              // Draw incoming threads
              for (let i = 0; i < knot.threadSpan; i++) {
                const threadX = xOffset + (i + 0.5) * segmentWidth;
                const targetX = (knot.type === 'SQUARE' || knot.type === 'HALF_SQUARE_L' || knot.type === 'HALF_SQUARE_R') ? threadX : x;
                const color = knot.inColors ? knot.inColors[i] : (i < knot.threadSpan / 2 ? knot.color1 : knot.color2);
                
                elements.push(
                  <line 
                    key={`line-${rowIndex}-${knotIndex}-${i}`}
                    x1={threadX} y1={prevY} x2={targetX} y2={y} 
                    stroke={color} strokeWidth="3" opacity="0.6"
                  />
                );
              }
              
              xOffset += currentKnotWidth;
              return elements;
            });
          })}
        </g>
        
        <g className={styles.nodes}>
          {grid.map((rowKnots, rowIndex) => {
            const isOddRow = rowIndex % 2 !== 0;
            const y = padding + rowIndex * rowHeight + knotSize / 2;
            
            let xOffset = padding;
            if (isOddRow && shiftOddRows) {
              xOffset += knotSize / 2;
            }

            return rowKnots.map((knot, knotIndex) => {
              const currentKnotWidth = (knot.threadSpan / 2) * knotSize;
              const x = xOffset + currentKnotWidth / 2;
              
              const element = (
                <g key={`${rowIndex}-${knotIndex}`} className={styles.node}>
                  {knot.type === 'SQUARE' || knot.type === 'HALF_SQUARE_L' || knot.type === 'HALF_SQUARE_R' ? (
                    <>
                      {/* Outer border loops (Background) */}
                      <rect x={x + 2} y={y - knotSize * 0.45} width={currentKnotWidth / 2 - 4} height={knotSize * 0.45} rx={6} fill={knot.outColor2} />
                      <rect x={x + 2} y={y - knotSize * 0.45} width={currentKnotWidth / 2 - 4} height={knotSize * 0.45} rx={6} fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                      
                      <rect x={x - currentKnotWidth / 2 + 2} y={y} width={currentKnotWidth / 2 - 4} height={knotSize * 0.45} rx={6} fill={knot.outColor2} />
                      <rect x={x - currentKnotWidth / 2 + 2} y={y} width={currentKnotWidth / 2 - 4} height={knotSize * 0.45} rx={6} fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                      
                      {/* Inner zigzag */}
                      <polyline 
                        points={`${x - (currentKnotWidth/2 - 6)},${y - knotSize * 0.45} ${x + (currentKnotWidth/2 - 6)},${y} ${x - (currentKnotWidth/2 - 6)},${y + knotSize * 0.45}`}
                        stroke={knot.outColor1} 
                        strokeWidth="10" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                      <polyline 
                        points={`${x - (currentKnotWidth/2 - 6)},${y - knotSize * 0.45} ${x + (currentKnotWidth/2 - 6)},${y} ${x - (currentKnotWidth/2 - 6)},${y + knotSize * 0.45}`}
                        stroke="rgba(0,0,0,0.2)" 
                        strokeWidth="10" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                      
                      {/* Wrapping curves over the elbows */}
                      <path d={`M ${x + (currentKnotWidth/2 - 6) - 4} ${y - 6} Q ${x + (currentKnotWidth/2 - 6) + 4} ${y} ${x + (currentKnotWidth/2 - 6) - 4} ${y + 6}`} stroke={knot.outColor2} strokeWidth="6" strokeLinecap="round" fill="none" />
                      <path d={`M ${x - (currentKnotWidth/2 - 6) + 4} ${y - knotSize * 0.45 - 6} Q ${x - (currentKnotWidth/2 - 6) - 4} ${y - knotSize * 0.45} ${x - (currentKnotWidth/2 - 6) + 4} ${y - knotSize * 0.45 + 6}`} stroke={knot.outColor2} strokeWidth="6" strokeLinecap="round" fill="none" />
                      <path d={`M ${x - (currentKnotWidth/2 - 6) + 4} ${y + knotSize * 0.45 - 6} Q ${x - (currentKnotWidth/2 - 6) - 4} ${y + knotSize * 0.45} ${x - (currentKnotWidth/2 - 6) + 4} ${y + knotSize * 0.45 + 6}`} stroke={knot.outColor2} strokeWidth="6" strokeLinecap="round" fill="none" />
                      
                      <text x={x} y={y} fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle" dominantBaseline="central" style={{ mixBlendMode: 'difference' }}>{knot.type === 'HALF_SQUARE_L' ? 'HL' : knot.type === 'HALF_SQUARE_R' ? 'HR' : 'SQ'}</text>
                    </>
                  ) : (
                    <>
                      <circle cx={x} cy={y} r={knotSize * 0.45} fill={knot.outColor1} />
                      <circle cx={x} cy={y} r={knotSize * 0.45} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                      <g style={{ color: '#fff', mixBlendMode: 'difference' }}>
                        {renderArrow(knot.type, x, y, knotSize * 0.45)}
                      </g>
                    </>
                  )}
                </g>
              );
              
              xOffset += currentKnotWidth;
              return element;
            });
          })}
        </g>
      </svg>
    </div>
  );
}

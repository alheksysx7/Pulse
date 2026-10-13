import { useState, type ReactNode } from 'react';
import { ChevronDown, Lock, Sparkles, X } from 'lucide-react';
import { useDesignStore, MAX_DIVISIONS } from '../../store/useDesignStore';
import { PREDEFINED_PALETTES } from '../../core/palettes';
import styles from './ThreadControls.module.css';
import { PATTERNS } from '../../core/patterns';
import { PatternPicker } from '../PatternPicker/PatternPicker';
import { TRANSLATIONS } from '../../core/i18n';
import type { SelectedKnotInfo } from '../../core/types';

function SelectedKnotCardContent({ knot, onClose }: { knot: SelectedKnotInfo; onClose: () => void }) {
  const { segments, addDivision, language, colors } = useDesignStore();
  const t = TRANSLATIONS[language];

  const [selectedThreadIndex, setSelectedThreadIndex] = useState<number>(0);
  const activeThreadId = knot.inThreadIds[selectedThreadIndex] ?? knot.inThreadIds[0];
  const currentThreadColor = knot.inColors[selectedThreadIndex] ?? '#000000';
  const [newColor, setNewColor] = useState<string>(currentThreadColor);

  const activeThreadSegments = segments[activeThreadId] || [];
  const divisionsCount = Math.max(0, activeThreadSegments.length - 1);
  const isMaxReached = divisionsCount >= MAX_DIVISIONS;

  const isForward = knot.knotType === 'F' || knot.knotType === 'F_NO_SWAP';
  const getThreadRole = (idx: number) => {
    if (isForward) {
      return idx === 0 ? t.knottedThread : t.guideThread;
    } else {
      return idx === 1 ? t.knottedThread : t.guideThread;
    }
  };

  const quickPalette = Array.from(new Set(colors));

  const handleApply = () => {
    if (isMaxReached) return;
    addDivision(activeThreadId, knot.rowIndex, newColor);
    onClose();
  };

  return (
    <section className={styles.knotCard} aria-label={t.addDivisionTitle}>
      <div className={styles.knotCardHeader}>
        <div className={styles.knotCardTitleRow}>
          <Sparkles size={15} className={styles.knotSparkleIcon} />
          <h4 className={styles.knotCardTitle}>{t.knotSelectedTitle}</h4>
          <span className={styles.knotRowBadge}>{t.knotRowLabel(knot.rowIndex)}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={styles.knotCardCloseBtn}
          aria-label={t.dismissNotice}
          title={t.dismissNotice}
        >
          <X size={15} />
        </button>
      </div>

      <div className={styles.knotCardBody}>
        <label className={styles.knotCardLabel}>{t.selectThreadToChange}</label>
        <div className={styles.knotThreadSelector}>
          {knot.inThreadIds.map((tId, idx) => {
            const isSelected = selectedThreadIndex === idx;
            const threadColor = knot.inColors[idx];
            const role = getThreadRole(idx);
            return (
              <button
                key={idx}
                type="button"
                className={`${styles.knotThreadOption} ${isSelected ? styles.knotThreadOptionSelected : ''}`}
                onClick={() => {
                  setSelectedThreadIndex(idx);
                  setNewColor(knot.inColors[idx]);
                }}
              >
                <span
                  className={styles.knotThreadSwatch}
                  style={{ backgroundColor: threadColor }}
                />
                <span className={styles.knotThreadText}>
                  <strong>#{tId + 1}</strong> ({role})
                </span>
              </button>
            );
          })}
        </div>

        <div className={styles.knotColorPickerSection}>
          <label className={styles.knotCardLabel}>{t.newColorLabel}</label>
          <div className={styles.knotColorInputRow}>
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className={styles.knotColorInput}
            />
            <span className={styles.knotHexCode}>{newColor.toUpperCase()}</span>
          </div>

          <div className={styles.knotQuickPalette}>
            {quickPalette.map((c, i) => (
              <button
                key={i}
                type="button"
                className={styles.knotQuickColor}
                style={{ backgroundColor: c }}
                onClick={() => setNewColor(c)}
              />
            ))}
          </div>
        </div>

        {isMaxReached ? (
          <div className={styles.knotWarningMessage}>
            {t.maxDivisionsReached}
          </div>
        ) : (
          <button
            type="button"
            className={styles.knotSubmitBtn}
            onClick={handleApply}
          >
            {t.changeColorFromHere}
          </button>
        )}
      </div>
    </section>
  );
}

function SelectedKnotCard({ knot, onClose }: { knot: SelectedKnotInfo; onClose: () => void }) {
  // Key by row and knot coordinates so internal state resets cleanly when selecting another knot
  const knotKey = `${knot.rowIndex}-${knot.canvasX}`;
  return <SelectedKnotCardContent key={knotKey} knot={knot} onClose={onClose} />;
}

function Accordion({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={`${styles.accordion} ${open ? styles.open : ''}`}>
      <button
        type="button"
        className={styles.accordionHeader}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className={styles.accordionTitle}>{title}</span>
        <ChevronDown size={16} className={styles.chevron} />
      </button>
      <div className={styles.accordionBody}>
        <div className={styles.accordionInner}>{children}</div>
      </div>
    </section>
  );
}

export function ThreadControls() {
  const {
    threadsCount, setThreadsCount,
    colors, setColor,
    segments, updateSegmentColor, removeDivision,
    setHighlightedThreadId,
    selectedKnot, setSelectedKnot,
    applyPalette,
    patternId,
    verticalSpacing, setVerticalSpacing,
    showBeads, setShowBeads,
    beadType, setBeadType,
    knotSize, setKnotSize,
    setAllColors,
    activePaletteName,
    language
  } = useDesignStore();

  const t = TRANSLATIONS[language];
  const pattern = PATTERNS[patternId];
  const isThreadCountFixed = pattern.maxThreads !== undefined && pattern.minThreads >= pattern.maxThreads;

  return (
    <div className={styles.container}>
      {selectedKnot && (
        <SelectedKnotCard
          knot={selectedKnot}
          onClose={() => setSelectedKnot(null)}
        />
      )}
      <Accordion title={t.sectionBaseStructure}>
        <PatternPicker />
        <div className={styles.field}>
          <div className={styles.headerWithBadge}>
            <h3 className={styles.title}>{t.threadsLabel}: {threadsCount}</h3>
            {isThreadCountFixed && (
              <span className={styles.fixedBadge} title={t.fixedBadgeTitle}>
                <Lock size={12} className={styles.lockIcon} />
                {t.fixedBadge}
              </span>
            )}
          </div>
          <input
            type="range"
            min={pattern.minThreads}
            max={pattern.maxThreads || 16}
            step={pattern.evenOnly ? 2 : 1}
            value={threadsCount}
            onChange={(e) => setThreadsCount(Number(e.target.value))}
            disabled={isThreadCountFixed}
            className={`${styles.slider} ${isThreadCountFixed ? styles.disabledSlider : ''}`}
          />
          {isThreadCountFixed && (
            <p className={styles.fixedHint}>
              {t.fixedHint(pattern.minThreads)}
            </p>
          )}
        </div>
      </Accordion>

      <Accordion title={t.sectionGeometry}>
        <div className={styles.field}>
          <h3 className={styles.title}>{t.verticalSpacingLabel}: {verticalSpacing.toFixed(1)}x</h3>
          <input
            type="range"
            min={pattern.minVerticalSpacing ?? 0.6}
            max={pattern.maxVerticalSpacing ?? 2.0}
            step={0.1}
            value={verticalSpacing}
            onChange={(e) => setVerticalSpacing(Number(e.target.value))}
            className={styles.slider}
          />
        </div>

        <div className={styles.field}>
          <h3 className={styles.title}>{t.knotSizeLabel}: {knotSize}px</h3>
          <input
            type="range"
            min={10}
            max={40}
            step={1}
            value={knotSize}
            onChange={(e) => setKnotSize(Number(e.target.value))}
            className={styles.slider}
          />
        </div>

        {patternId === 'jumping-festoon' && (
          <div className={styles.field}>
            <div className={styles.toggleRow}>
              <span className={styles.toggleLabel} id="beads-label">{t.addBeadsLabel}</span>
              <button
                type="button"
                role="switch"
                aria-checked={showBeads}
                aria-labelledby="beads-label"
                className={`${styles.switch} ${showBeads ? styles.switchOn : ''}`}
                onClick={() => setShowBeads(!showBeads)}
              >
                <span className={styles.switchThumb} />
              </button>
            </div>
            {showBeads && (
              <select
                value={beadType}
                onChange={(e) => setBeadType(e.target.value as any)}
                className={styles.select}
              >
                <option value="gold">{t.beadGold}</option>
                <option value="silver">{t.beadSilver}</option>
                <option value="wood">{t.beadWood}</option>
              </select>
            )}
          </div>
        )}
      </Accordion>

      <Accordion title={t.sectionColorStyle}>
        <div className={styles.field}>
          <h3 className={styles.title}>{t.colorsLabel}</h3>
          <div className={styles.colorRow}>
            {Array.from({ length: threadsCount }, (_, index) => {
              const threadSegs = segments[index] || [{ fromRow: 0, color: colors[index] || '#ea580c' }];
              return (
                <div
                  key={index}
                  className={styles.colorItem}
                  onMouseEnter={() => setHighlightedThreadId(index)}
                  onMouseLeave={() => setHighlightedThreadId(null)}
                >
                  <div className={styles.segmentList}>
                    {threadSegs.map((seg, sIdx) => (
                      <div
                        key={sIdx}
                        className={styles.segmentWrapper}
                        onDoubleClick={() => sIdx === 0 && setAllColors(seg.color)}
                        title={sIdx === 0 ? t.colorItemTooltip : undefined}
                      >
                        <input
                          type="color"
                          value={seg.color}
                          onChange={(e) => {
                            if (sIdx === 0) {
                              setColor(index, e.target.value);
                            } else {
                              updateSegmentColor(index, sIdx, e.target.value);
                            }
                          }}
                          className={styles.colorInput}
                          aria-label={t.colorInputAria(index + 1)}
                        />
                        {sIdx > 0 && (
                          <button
                            type="button"
                            className={styles.removeSegmentBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeDivision(index, sIdx);
                            }}
                            aria-label={t.removeDivisionAria}
                            title={t.removeDivisionAria}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <span className={styles.colorLabel}>{index + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.field}>
          <h3 className={styles.title}>{t.palettesLabel}</h3>
          <p className={styles.subtitle}>{t.palettesSubtitle}</p>
          <div className={styles.paletteGrid}>
            {PREDEFINED_PALETTES.map((palette) => {
              const isActive = activePaletteName === palette.name;
              const paletteDisplayName = t.palettes[palette.name] || palette.name;
              return (
                <button
                  key={palette.name}
                  className={`${styles.paletteButton} ${isActive ? styles.paletteButtonActive : ''}`}
                  onClick={() => applyPalette(palette.name, palette.colors)}
                  title={paletteDisplayName}
                >
                  <div className={styles.palettePreview}>
                    {palette.colors.map((c, i) => (
                      <div key={i} className={styles.paletteColor} style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className={styles.paletteName}>{paletteDisplayName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Accordion>
    </div>
  );
}

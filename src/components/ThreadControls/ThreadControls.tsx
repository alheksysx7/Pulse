import { useState, type ReactNode } from 'react';
import { ChevronDown, Lock } from 'lucide-react';
import { useDesignStore } from '../../store/useDesignStore';
import { PREDEFINED_PALETTES } from '../../core/palettes';
import styles from './ThreadControls.module.css';
import { PATTERNS } from '../../core/patterns';
import { PatternPicker } from '../PatternPicker/PatternPicker';

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
    applyPalette,
    patternId,
    verticalSpacing, setVerticalSpacing,
    showBeads, setShowBeads,
    beadType, setBeadType,
    knotSize, setKnotSize,
    setAllColors,
    activePaletteName
  } = useDesignStore();

  const pattern = PATTERNS[patternId];
  const isThreadCountFixed = pattern.maxThreads !== undefined && pattern.minThreads >= pattern.maxThreads;

  return (
    <div className={styles.container}>
      <Accordion title="Estructura Base">
        <PatternPicker />
        <div className={styles.field}>
          <div className={styles.headerWithBadge}>
            <h3 className={styles.title}>Threads: {threadsCount}</h3>
            {isThreadCountFixed && (
              <span className={styles.fixedBadge} title="Este patrón tiene un número fijo de hilos">
                <Lock size={12} className={styles.lockIcon} />
                Fijo
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
              Este patrón requiere exactamente {pattern.minThreads} hilos para su estructura.
            </p>
          )}
        </div>
      </Accordion>

      <Accordion title="Geometría">
        <div className={styles.field}>
          <h3 className={styles.title}>Vertical Spacing: {verticalSpacing.toFixed(1)}x</h3>
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
          <h3 className={styles.title}>Knot Size: {knotSize}px</h3>
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
              <span className={styles.toggleLabel} id="beads-label">Agregar Balines (Abalorios)</span>
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
                <option value="gold">Dorado</option>
                <option value="silver">Plateado</option>
                <option value="wood">Madera</option>
              </select>
            )}
          </div>
        )}
      </Accordion>

      <Accordion title="Color y Estilo">
        <div className={styles.field}>
          <h3 className={styles.title}>Colors</h3>
          <div className={styles.colorRow}>
            {colors.map((color, index) => (
              <div
                key={index}
                className={styles.colorItem}
                onDoubleClick={() => setAllColors(color)}
                title="Doble clic para aplicar este color a todos los hilos"
              >
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(index, e.target.value)}
                  className={styles.colorInput}
                  aria-label={`Color del hilo ${index + 1}`}
                />
                <span className={styles.colorLabel}>{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <h3 className={styles.title}>Palettes</h3>
          <p className={styles.subtitle}>Click para aplicar. Click otra vez para rotar colores.</p>
          <div className={styles.paletteGrid}>
            {PREDEFINED_PALETTES.map((palette) => {
              const isActive = activePaletteName === palette.name;
              return (
                <button
                  key={palette.name}
                  className={`${styles.paletteButton} ${isActive ? styles.paletteButtonActive : ''}`}
                  onClick={() => applyPalette(palette.name, palette.colors)}
                  title={palette.name}
                >
                  <div className={styles.palettePreview}>
                    {palette.colors.map((c, i) => (
                      <div key={i} className={styles.paletteColor} style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className={styles.paletteName}>{palette.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Accordion>
    </div>
  );
}

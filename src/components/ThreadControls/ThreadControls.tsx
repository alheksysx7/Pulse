import { useDesignStore } from '../../store/useDesignStore';
import { PREDEFINED_PALETTES } from '../../core/palettes';
import styles from './ThreadControls.module.css';
import { PATTERNS } from '../../core/patterns';

export function ThreadControls() {
  const {
    threadsCount, setThreadsCount,
    colors, setColor,
    applyPalette,
    patternId,
    verticalSpacing, setVerticalSpacing
  } = useDesignStore();

  const pattern = PATTERNS[patternId];

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.title}>Threads: {threadsCount}</h3>
        <input
          type="range"
          min={pattern.minThreads}
          max={pattern.maxThreads || 16}
          step={pattern.evenOnly ? 2 : 1}
          value={threadsCount}
          onChange={(e) => setThreadsCount(Number(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.section}>
        <h3 className={styles.title}>Vertical Spacing: {verticalSpacing.toFixed(1)}x</h3>
        <input
          type="range"
          min={0.5}
          max={2.0}
          step={0.1}
          value={verticalSpacing}
          onChange={(e) => setVerticalSpacing(Number(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.section}>
        <h3 className={styles.title}>Colors</h3>
        <div className={styles.colorGrid}>
          {colors.map((color, index) => (
            <div key={index} className={styles.colorItem}>
              <span className={styles.colorLabel}>{index + 1}</span>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(index, e.target.value)}
                className={styles.colorInput}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.title}>Palettes</h3>
        <p className={styles.subtitle}>Click a palette to apply it. Click again to cycle colors.</p>
        <div className={styles.paletteGrid}>
          {PREDEFINED_PALETTES.map((palette) => (
            <button
              key={palette.name}
              className={styles.paletteButton}
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
          ))}
        </div>
      </div>
    </div>
  );
}

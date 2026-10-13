import { PATTERN_LIST } from '../../core/patterns';
import { useDesignStore } from '../../store/useDesignStore';
import { TRANSLATIONS } from '../../core/i18n';
import styles from './PatternPicker.module.css';

export function PatternPicker() {
  const { patternId, setPatternId, language } = useDesignStore();
  const t = TRANSLATIONS[language];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t.patternLabel}</h3>
      <div className={styles.grid}>
        {PATTERN_LIST.map((pattern) => {
          const displayName = t.patterns[pattern.id] || pattern.name;
          return (
            <button
              key={pattern.id}
              className={`${styles.button} ${patternId === pattern.id ? styles.active : ''}`}
              onClick={() => setPatternId(pattern.id)}
            >
              {displayName}
            </button>
          );
        })}
      </div>
    </div>
  );
}

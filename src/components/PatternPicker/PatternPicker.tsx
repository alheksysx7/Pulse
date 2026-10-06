import { PATTERN_LIST } from '../../core/patterns';
import { useDesignStore } from '../../store/useDesignStore';
import styles from './PatternPicker.module.css';

export function PatternPicker() {
  const { patternId, setPatternId } = useDesignStore();

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Pattern</h3>
      <div className={styles.grid}>
        {PATTERN_LIST.map((pattern) => (
          <button
            key={pattern.id}
            className={`${styles.button} ${patternId === pattern.id ? styles.active : ''}`}
            onClick={() => setPatternId(pattern.id)}
          >
            {pattern.name}
          </button>
        ))}
      </div>
    </div>
  );
}

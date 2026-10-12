import { useState, Suspense, lazy } from 'react';
import styles from './Layout.module.css';
import { ThreadControls } from '../ThreadControls/ThreadControls';

// Code split the views for performance
const BraceletCanvas = lazy(() => import('../BraceletCanvas/BraceletCanvas').then(m => ({ default: m.BraceletCanvas })));
const Instructions = lazy(() => import('../Instructions/Instructions').then(m => ({ default: m.Instructions })));

type Theme = 'light' | 'dark' | 'nature';

// Each theme is represented by the same festoon knot (forward "F" knot, as in the simulation),
// differing only in color.
const THEMES: { id: Theme; label: string; color: string }[] = [
  { id: 'nature', label: 'Ambiente naturaleza', color: '#4ade80' },
  { id: 'dark', label: 'Ambiente oscuro', color: '#52525b' },
  { id: 'light', label: 'Ambiente claro', color: '#fdba74' },
];

function FestoonKnot({ color }: { color: string }) {
  // Forward knot: leans left, thread crosses bottom-left to top-right (same as drawFestoonKnot)
  const thread = 'M-2.5 5.5 L2.5 -5.5';
  return (
    <svg viewBox="-14 -12 28 24" width="17" height="15" aria-hidden="true" focusable="false">
      <g transform="rotate(-35)">
        <rect x="-10" y="-3" width="20" height="9" rx="4.5" fill="rgba(0,0,0,0.25)" />
        <rect x="-10" y="-4.5" width="20" height="9" rx="4.5" fill={color} stroke="rgba(0,0,0,0.25)" strokeWidth="0.8" />
        <path d={thread} stroke="rgba(0,0,0,0.35)" strokeWidth="4" strokeLinecap="round" />
        <path d={thread} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M-7 -2.2 L-3 -2.2 M3 -2.2 L7 -2.2" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem('pulse-theme');
  return saved === 'light' || saved === 'dark' || saved === 'nature' ? saved : 'dark';
};

export function Layout() {
  const [activeView, setActiveView] = useState<'simulation' | 'instructions'>('simulation');
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const changeTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem('pulse-theme', t);
  };

  return (
    <div className={styles.appContainer} data-theme={theme}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.brandRow}>
            <h1 className={styles.logo}>Pulse</h1>
            <div className={styles.themeSwitcher} role="radiogroup" aria-label="Ambiente de fondo">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={theme === t.id}
                  aria-label={t.label}
                  title={t.label}
                  className={`${styles.knotButton} ${theme === t.id ? styles.knotActive : ''}`}
                  onClick={() => changeTheme(t.id)}
                >
                  <FestoonKnot color={t.color} />
                </button>
              ))}
            </div>
          </div>
          <p className={styles.subtitle}>Macramé Studio</p>
        </div>
      </header>

      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <div className={styles.controlsPanel}>
            <ThreadControls />
          </div>
        </aside>

        <section className={styles.workspace}>
          <div className={styles.viewTabs}>
            <button 
              className={`${styles.tab} ${activeView === 'simulation' ? styles.activeTab : ''}`}
              onClick={() => setActiveView('simulation')}
            >
              Simulation
            </button>
            <button 
              className={`${styles.tab} ${activeView === 'instructions' ? styles.activeTab : ''}`}
              onClick={() => setActiveView('instructions')}
            >
              Instrucciones
            </button>
          </div>

          <div className={styles.viewContent}>
            <Suspense fallback={<div className={styles.loading}>Loading view...</div>}>
              {activeView === 'simulation' && <BraceletCanvas />}
              {activeView === 'instructions' && <Instructions />}
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  );
}

import { useState, Suspense, lazy } from 'react';
import styles from './Layout.module.css';
import { ThreadControls } from '../ThreadControls/ThreadControls';
import { useDesignStore } from '../../store/useDesignStore';
import { TRANSLATIONS } from '../../core/i18n';

// Code split the views for performance
const BraceletCanvas = lazy(() => import('../BraceletCanvas/BraceletCanvas').then(m => ({ default: m.BraceletCanvas })));
const Instructions = lazy(() => import('../Instructions/Instructions').then(m => ({ default: m.Instructions })));

type Theme = 'light' | 'dark' | 'nature';

// Each theme is represented by the same festoon knot (forward "F" knot, as in the simulation),
// differing only in color.
const THEMES: { id: Theme; color: string; labelKey: 'themeNature' | 'themeDark' | 'themeLight' }[] = [
  { id: 'nature', color: '#4ade80', labelKey: 'themeNature' },
  { id: 'dark', color: '#52525b', labelKey: 'themeDark' },
  { id: 'light', color: '#fdba74', labelKey: 'themeLight' },
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
  const { language, setLanguage } = useDesignStore();
  const t = TRANSLATIONS[language];

  const changeTheme = (tId: Theme) => {
    setTheme(tId);
    localStorage.setItem('pulse-theme', tId);
  };

  return (
    <div className={styles.appContainer} data-theme={theme}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.brandRow}>
            <h1 className={styles.logo}>{t.appTitle}</h1>
            <div className={styles.themeSwitcher} role="radiogroup" aria-label={t.themeAria}>
              {THEMES.map(th => {
                const label = t[th.labelKey];
                return (
                  <button
                    key={th.id}
                    type="button"
                    role="radio"
                    aria-checked={theme === th.id}
                    aria-label={label}
                    title={label}
                    className={`${styles.knotButton} ${theme === th.id ? styles.knotActive : ''}`}
                    onClick={() => changeTheme(th.id)}
                  >
                    <FestoonKnot color={th.color} />
                  </button>
                );
              })}
            </div>
          </div>
          <p className={styles.subtitle}>{t.appSubtitle}</p>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.langSwitcher} role="group" aria-label={t.languageAria}>
            <button
              type="button"
              className={`${styles.langBtn} ${language === 'es' ? styles.langBtnActive : ''}`}
              onClick={() => setLanguage('es')}
              aria-pressed={language === 'es'}
            >
              ES
            </button>
            <button
              type="button"
              className={`${styles.langBtn} ${language === 'en' ? styles.langBtnActive : ''}`}
              onClick={() => setLanguage('en')}
              aria-pressed={language === 'en'}
            >
              EN
            </button>
          </div>
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
              {t.tabSimulation}
            </button>
            <button 
              className={`${styles.tab} ${activeView === 'instructions' ? styles.activeTab : ''}`}
              onClick={() => setActiveView('instructions')}
            >
              {t.tabInstructions}
            </button>
          </div>

          <div className={styles.viewContent}>
            <Suspense fallback={<div className={styles.loading}>{t.loadingView}</div>}>
              {activeView === 'simulation' && <BraceletCanvas />}
              {activeView === 'instructions' && <Instructions />}
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  );
}

import { useState, useEffect, Suspense, lazy } from 'react';
import { ChevronUp, SlidersHorizontal } from 'lucide-react';
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
  { id: 'nature', color: '#e07a5f', labelKey: 'themeNature' },
  { id: 'light', color: '#e8ae4c', labelKey: 'themeLight' },
  { id: 'dark', color: '#0f7c90', labelKey: 'themeDark' }
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
  const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(true);
  const { language, setLanguage, divisionsResetNotice, clearDivisionsResetNotice } = useDesignStore();
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (divisionsResetNotice) {
      const timer = setTimeout(() => {
        clearDivisionsResetNotice();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [divisionsResetNotice, clearDivisionsResetNotice]);

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

      <main className={`${styles.main} ${isMobileControlsOpen ? styles.splitOpen : styles.splitCollapsed}`}>
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

        <aside className={`${styles.sidebar} ${isMobileControlsOpen ? styles.sheetOpen : ''}`}>
          <button
            type="button"
            className={styles.sheetHandleBtn}
            onClick={() => setIsMobileControlsOpen(prev => !prev)}
            aria-expanded={isMobileControlsOpen}
            aria-label={isMobileControlsOpen ? t.controlsSheetCollapse : t.controlsSheetExpand}
          >
            <div className={styles.sheetHandlePill} />
            <div className={styles.sheetHandleLeft}>
              <SlidersHorizontal size={15} className={styles.sheetIcon} />
              <span className={styles.sheetHandleTitle}>{t.controlsSheetTitle}</span>
            </div>
            <div className={styles.sheetHandleRight}>
              <span className={styles.sheetHandleAction}>
                {isMobileControlsOpen ? t.controlsSheetCollapse : t.controlsSheetExpand}
              </span>
              <ChevronUp className={`${styles.sheetChevron} ${isMobileControlsOpen ? styles.sheetChevronDown : ''}`} size={18} />
            </div>
          </button>

          <div className={styles.controlsPanel}>
            <ThreadControls />
          </div>
        </aside>
      </main>

      {divisionsResetNotice && (
        <div className={styles.toast} role="status" aria-live="polite">
          <span>{t.divisionsResetNotice}</span>
          <button
            type="button"
            className={styles.toastCloseBtn}
            onClick={clearDivisionsResetNotice}
            aria-label={t.dismissNotice}
          >
            {t.dismissNotice}
          </button>
        </div>
      )}
    </div>
  );
}

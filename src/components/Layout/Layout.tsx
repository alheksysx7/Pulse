import { ReactNode, useState, Suspense, lazy } from 'react';
import styles from './Layout.module.css';
import { PatternPicker } from '../PatternPicker/PatternPicker';
import { ThreadControls } from '../ThreadControls/ThreadControls';

// Code split the views for performance
const BraceletCanvas = lazy(() => import('../BraceletCanvas/BraceletCanvas').then(m => ({ default: m.BraceletCanvas })));
const KnotDiagram = lazy(() => import('../KnotDiagram/KnotDiagram').then(m => ({ default: m.KnotDiagram })));

export function Layout() {
  const [activeView, setActiveView] = useState<'simulation' | 'diagram'>('simulation');

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Pulse</h1>
        <p className={styles.subtitle}>Macramé Studio</p>
      </header>

      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <div className={styles.controlsPanel}>
            <PatternPicker />
            <div className={styles.divider} />
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
              className={`${styles.tab} ${activeView === 'diagram' ? styles.activeTab : ''}`}
              onClick={() => setActiveView('diagram')}
            >
              Technical Diagram
            </button>
          </div>

          <div className={styles.viewContent}>
            <Suspense fallback={<div className={styles.loading}>Loading view...</div>}>
              {activeView === 'simulation' ? <BraceletCanvas /> : <KnotDiagram />}
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  );
}

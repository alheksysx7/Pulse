# Pulse – Macramé Bracelet Studio · Plan del Proyecto

## 1. Objetivo
Aplicación web ligera y rápida para diseñar pulseras de hilos (friendship bracelets / macramé). El usuario elige el **tipo de nudo/patrón**, el **número de hilos** y el **color de cada hilo**, y ve en tiempo real:
1. Una **simulación tejida** de la pulsera terminada.
2. Un **diagrama técnico** de nudos (flechas adelante/atrás) para tejerla a mano.

## 2. Alcance (v1)
### Patrones
- Diagonal (Candy Stripe)
- Chevron (V) y Chevron invertido
- Zig-Zag
- Diamantes (rombo)

### Configuración
- Número de hilos configurable (4–14; se ajusta a pares para patrones simétricos).
- Selector de color individual por hilo.
- Paletas temáticas: Boho, Pastel, Tierra, Atardecer, Neón, Océano.

### Visualización
- Simulación tejida (Canvas 2D) con relieve, curvatura y textura de hilo.
- Diagrama esquemático con nodos y flechas por nudo.
- Pestañas/alternancia entre ambas vistas (en desktop, lado a lado).

### Fuera de alcance v1
Intercalar patrones y cambios de hilo (planificados en v2 y v3, ver sección 7), exportación PNG, animación paso a paso, cuentas de usuario, backend.

## 3. Stack tecnológico

| Área | Elección | Motivo |
|---|---|---|
| UI | **React 18** | Base solicitada |
| Bundler | **Vite** | Arranque/HMR instantáneo, build optimizado con Rollup |
| Lenguaje | **TypeScript** | Seguridad de tipos en la lógica de patrones |
| Estado | **Zustand** (~1 KB) | Estado global mínimo, sin boilerplate |
| Estilos | **CSS Modules + variables CSS** (vanilla) | Cero runtime, tema claro/oscuro simple |
| Render | **Canvas 2D** nativo | Sin librerías gráficas; muy rápido para mallas de nudos |
| Diagrama | **SVG** generado en React | Nítido, escalable, ligero |
| Selector color | `<input type="color">` nativo | 0 KB de dependencias |
| Tipografía | Fuente variable (Outfit/Inter) autoalojada, `font-display: swap` | Sin bloqueo de render |
| Persistencia | `localStorage` (diseño actual) + URL hash para compartir | Sin backend |
| Calidad | ESLint + Prettier + Vitest | Tests de la lógica de patrones |
| Deploy | Netlify / Vercel / GitHub Pages (estático) | Gratis y con CDN |

### Principio rector: experiencia de uso fluida
La prioridad es que la interacción se sienta fluida, no tener el bundle más pequeño. **Se puede usar cualquier librería que mejore la experiencia o acelere el desarrollo**, siempre que no degrade la fluidez (animaciones a ~60 fps, respuesta inmediata a los controles, carga inicial razonable).

Librerías candidatas (se incorporan en la fase donde aportan valor):

| Necesidad | Candidata | Cuándo |
|---|---|---|
| Animaciones y transiciones de UI | Framer Motion | v1, microanimaciones |
| Arrastrar para reordenar tramos | dnd-kit | v2 |
| Gestos (zoom/pan del diagrama) | @use-gesture/react | v2–v3 |
| Render si Canvas 2D no alcanza | PixiJS (WebGL) | Solo si se mide un problema de fluidez |
| Selector de color avanzado | react-colorful (~3 KB) | v1, si el nativo resulta incómodo |
| Deshacer/rehacer | Zustand middleware (zundo) | v3 |

### Estrategias para mantener la fluidez
- Lógica de patrones pura y separada de la UI (testeable, memoizable).
- Redibujo de Canvas con `requestAnimationFrame`; debounce o throttle al arrastrar el color.
- Cálculos pesados fuera del hilo principal (Web Worker) si las pulseras largas lo requieren.
- Code-splitting de vistas secundarias con `React.lazy` (sin sacrificar la carga inicial).
- `devicePixelRatio` controlado para evitar canvas excesivos.
- Medir antes de optimizar: perfilar con React Profiler y Chrome Performance.
- Metas orientativas: interacción < 100 ms, animaciones ~60 fps, LCP < 2 s, Lighthouse Performance > 90. El tamaño del bundle se vigila pero no es un criterio bloqueante.

## 4. Modelo de dominio
```ts
type Knot = 'F' | 'B' | 'FB' | 'BF';      // forward, backward, forward-backward, backward-forward
interface Pattern {
  id: string; name: string;
  minThreads: number; evenOnly: boolean;
  generate(threads: string[], rows: number): KnotGrid; // devuelve nudos y orden de hilos por fila
}
```
Algoritmo: cada fila recorre pares de hilos adyacentes; un nudo `F` mueve el hilo activo a la derecha, `B` a la izquierda. Se simula el intercambio de posiciones para obtener el color final de cada nudo. Cada patrón solo define la secuencia de nudos por fila.

## 5. Estructura de carpetas
```
Pulse/
├─ index.html
├─ vite.config.ts
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ store/useDesignStore.ts
│  ├─ core/
│  │  ├─ patterns/ (diagonal, chevron, zigzag, diamond).ts
│  │  ├─ simulate.ts        # cálculo de colores por nudo
│  │  └─ palettes.ts
│  ├─ components/
│  │  ├─ PatternPicker/
│  │  ├─ ThreadControls/    # slider + colores + paletas
│  │  ├─ BraceletCanvas/    # simulación tejida
│  │  ├─ KnotDiagram/       # SVG técnico
│  │  └─ Layout/
│  ├─ styles/ (tokens.css, global.css)
│  └─ utils/ (hashShare.ts, color.ts)
└─ tests/
```

## 6. Diseño UI/UX
- Estética artesanal contemporánea: fondo crema/oscuro suave, acentos terracota y verde salvia, glassmorphism sutil en paneles.
- Layout: panel de controles (izq.) + visualización (der.); en móvil, apilado con controles colapsables.
- Microanimaciones: transición de hover en tarjetas de patrón, cambio suave de color.
- Accesibilidad: contraste AA, controles con etiquetas, navegación por teclado.
- SEO: título, meta description, un solo `h1`, HTML semántico, IDs únicos.

## 7. Hoja de ruta por versiones

El producto evoluciona en 3 iteraciones. Cada versión es utilizable por sí sola y reutiliza el núcleo de la anterior.

| Versión | Meta | Capacidad nueva |
|---|---|---|
| **v1** | Patrón único | Un patrón, nº de hilos, colores y paletas |
| **v2** | Pulsera por tramos | Intercalar distintos tipos de nudo en una misma pulsera |
| **v3** | Editor completo | Cambiar o agregar colores de hilo durante el tejido |

### v1 – Patrón único (Fases 0 a 6)

| Fase | Contenido | Resultado |
|---|---|---|
| 0 | Scaffold Vite + React + TS, tokens CSS, fuentes | Proyecto corriendo |
| 1 | `core/`: patrones, simulación, paletas + tests | Lógica validada |
| 2 | Store + panel de controles (patrón, hilos, colores, paletas) | Configuración funcional |
| 3 | `BraceletCanvas` con render tejido | Simulación en vivo |
| 4 | `KnotDiagram` SVG | Diagrama técnico |
| 5 | Pulido visual, responsive, persistencia y URL compartible | UX final de v1 |
| 6 | Auditoría Lighthouse, optimización, deploy | v1 en producción |

> [!NOTE]
> La lógica de `core/` en v1 debe diseñarse ya pensando en tramos: `simulate` recibe el estado de hilos de entrada y devuelve el de salida, para encadenar tramos sin reescribirla.

### v2 – Pulsera por tramos (intercalar nudos)

**Idea:** la pulsera es una lista ordenada de **tramos**. Cada tramo tiene un patrón y un número de filas. El orden de los hilos al final de un tramo es el orden de entrada del siguiente.

| Fase | Contenido | Resultado |
|---|---|---|
| 7 | Modelo de datos `Section[]` y `simulateSequence` (encadena tramos propagando el orden de hilos) + tests | Lógica de secuencia validada |
| 8 | Store: acciones añadir, duplicar, reordenar y eliminar tramos | Estado de secuencia |
| 9 | UI de tramos: lista con patrón + filas por tramo (arrastrar para reordenar) | Edición de secuencia |
| 10 | Render continuo de todos los tramos en Canvas y SVG, con marcadores de cambio de tramo | Visualización unificada |
| 11 | Transiciones entre patrones (validar compatibilidad de hilos y avisar si hay incompatibilidad) | Secuencias robustas |
| 12 | Persistencia y URL compartible del nuevo formato; migración desde v1 | v2 en producción |

**Criterios de aceptación v2:**
- Se puede armar, por ejemplo, 12 filas de Chevron + 8 de Diagonal + 12 de Diamante en una pulsera.
- Reordenar un tramo recalcula todos los colores posteriores correctamente.
- Los diseños v1 guardados siguen abriéndose como pulsera de un solo tramo.

### v3 – Editor completo (cambios de hilo durante el tejido)

**Idea:** además de los tramos, se añaden **eventos de hilo** en una fila concreta, como cambiar el color de hilos mientras avanza el tejido. Por ejemplo, en un chevron un lado empieza con unos colores y termina con otros.

**Decisión de diseño:** los eventos se pueden aplicar **en cualquier posición**, y el usuario la elige. No se limitan a los bordes ni al centro.

Tipos de evento:
- **Cambio de color:** en la fila N, el hilo en la posición P pasa a otro color (o varios hilos a la vez).
- **Transición:** el cambio puede ser seco (de una fila a otra) o gradual (varias filas).

| Fase | Contenido | Resultado |
|---|---|---|
| 13 | Modelo `ThreadEvent { row, position, color }` y aplicación en `simulateSequence` + tests | Lógica de eventos validada |
| 14 | UI para añadir eventos: clic en una fila/posición del diagrama + selector de color | Edición directa sobre el diagrama |
| 15 | Panel de eventos (lista ordenada, editar y eliminar) y marcadores visuales en la simulación | Gestión de eventos |
| 16 | Soporte para acabar el hilo viejo: mostrar un extremo y el nuevo hilo entrando en la simulación | Realismo del cambio |
| 17 | Deshacer/rehacer y plantillas de ejemplo (chevron con cambio de color) | UX de editor |
| 18 | Optimización (memoización por tramo, recálculo incremental), Lighthouse y deploy | v3 en producción |

**Criterios de aceptación v3:**
- Reproducir el caso de referencia: un chevron donde los hilos de un lado cambian de color a mitad de la pulsera.
- Añadir un evento recalcula solo las filas posteriores (< 100 ms).
- Deshacer/rehacer funcionan sobre tramos y eventos.

### Modelo de datos objetivo (v2 + v3)
```ts
interface Section { id: string; patternId: string; rows: number; }
interface ThreadEvent { id: string; row: number; position: number; color: string; }
interface Design {
  version: 3;
  threads: string[];            // colores iniciales por posición
  sections: Section[];          // v2
  events: ThreadEvent[];        // v3
}
simulateSequence(design): KnotGrid  // recorre tramos, aplica eventos por fila
```

### Nuevos componentes por versión
- **v2:** `SectionList`, `SectionCard`, `SectionDivider` (marcador en las vistas).
- **v3:** `EventLayer` (capa interactiva sobre el diagrama), `EventPanel`, `HistoryControls`.



## 8. Criterios de aceptación
- Cambiar patrón, nº de hilos o un color actualiza ambas vistas en < 100 ms.
- Los 5 patrones producen resultados correctos verificados con tests.
- Funciona fluido en móvil de gama media (animaciones ~60 fps, sin bloqueos al arrastrar).
- Lighthouse Performance > 90 y LCP < 2 s. El peso del bundle es una métrica de seguimiento, no un límite.

## 9. Riesgos
- **Realismo del render:** empezar con segmentos curvos + sombreado; iterar la textura después.
- **Patrones con hilos impares:** restringir/ajustar el número según el patrón.
- **Validez de nudos:** definir y probar la tabla de movimientos de hilos antes de dibujar.

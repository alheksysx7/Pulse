# Plan de implementación: Divisiones de color por hilo

Permite cambiar el color de un hilo a partir de un nudo festón (corte limpio), con un máximo de **2 divisiones por hilo** (3 tramos). Se trabaja primero la versión web (escritorio) y después la adaptación responsive para móvil.

## Reglas funcionales

- Solo los nudos festón (`F`, `B`, `F_NO_SWAP`, `B_NO_SWAP`) son interactivos. En los demás patrones no se muestra nada de esta función.
- El nuevo color empieza en el nudo tocado y continúa hacia abajo. Es un corte limpio, sin marca de empalme.
- Máximo 2 divisiones por hilo. Al llegar al límite, no se pueden crear más, solo editar o eliminar las existentes.
- Los colores siguen al **hilo** (no a la columna): si un nudo mueve el hilo de columna, la división lo acompaña.
- Al cambiar de patrón o de número de hilos, las divisiones se reinician a un color por hilo y se muestra un aviso (toast).
- En un nudo festón entran dos hilos: el **anudador** (visible al frente) y la **guía** (oculta dentro del nudo). El usuario elige cuál cambiar y se indica cuál es cada uno.

## Modelo de datos

```ts
// src/core/types.ts
export interface ThreadSegment {
  fromRow: number;   // fila donde empieza el tramo (0 para el tramo inicial)
  color: string;
}

// useDesignStore: un arreglo de tramos por hilo (identificado por su índice inicial)
// segments[threadId] = [{ fromRow: 0, color }, { fromRow: n, color }?, { fromRow: m, color }?]
```

- `threadId` es el índice del hilo en la fila 0 (su posición original), y no cambia aunque el hilo se mueva de columna.
- Constante `MAX_DIVISIONS = 2` (máximo 3 tramos por hilo).
- Los tramos se mantienen ordenados por `fromRow`.

---

# Fase 1: Web (escritorio)

## 1.1 Núcleo: identidad del hilo en la simulación

**Archivo:** [`src/core/simulate.ts`](src/core/simulate.ts)

- Cambiar la simulación para rastrear el `threadId` de cada posición, en lugar de intercambiar colores directamente.
- Cada `Knot` pasa a exponer `inThreadIds: number[]` (junto a `inColors`).
- Añadir un resolvedor `getThreadColor(threadId, row, segments)` que devuelva el color del tramo vigente.
- Mantener `inColors`, `outColor1/2` y `color1/2` calculados con el resolvedor para no romper los renderizadores actuales.
- `simulateSequence` recibe `segments` además de `initialColors`.

**Archivo:** [`src/core/types.ts`](src/core/types.ts)

- Añadir `ThreadSegment` y el campo `inThreadIds` en `Knot`.

**Criterio de aceptación:** con `segments` vacío o de un solo tramo, el resultado visual es idéntico al actual en todos los patrones.

## 1.2 Estado global

**Archivo:** [`src/store/useDesignStore.ts`](src/store/useDesignStore.ts)

- Sustituir/complementar `colors: string[]` por `segments: ThreadSegment[][]`. Mantener `colors` como vista derivada del tramo inicial para no romper los componentes existentes.
- Acciones nuevas:
  - `addDivision(threadId, fromRow, color)`: valida el máximo, evita `fromRow` duplicado o igual a otro tramo.
  - `updateSegmentColor(threadId, segmentIndex, color)`.
  - `removeDivision(threadId, segmentIndex)`: no permite eliminar el tramo 0.
  - `resetDivisions()`.
- `setPatternId` y `setThreadsCount` llaman a `resetDivisions()` y activan una bandera `divisionsResetNotice` para mostrar el aviso.
- `setColor` y `setAllColors` actualizan el tramo inicial; `applyPalette` reinicia las divisiones.

## 1.3 Hit-testing de nudos en el lienzo

**Archivo:** [`src/components/BraceletCanvas/BraceletCanvas.tsx`](src/components/BraceletCanvas/BraceletCanvas.tsx)

- Guardar en una referencia (`useRef`) la lista de nudos dibujados: `{ rowIndex, knot, x, y, width, height }`, solo para nudos festón.
- Manejar `onPointerMove` y `onPointerDown` sobre el canvas, convirtiendo coordenadas a espacio lógico (considerar `devicePixelRatio` y el escalado CSS).
- En `pointermove`: resaltar el nudo bajo el cursor (cursor `pointer` y halo suave). Solo en dispositivos con ratón.
- En `pointerdown`: abrir el selector con el nudo seleccionado y su posición en pantalla.
- Dibujar el resaltado del nudo seleccionado (anillo) durante el redibujado.

## 1.4 Uso del color por tramo al dibujar

**Archivos:** [`BraceletCanvas.tsx`](src/components/BraceletCanvas/BraceletCanvas.tsx), [`src/core/renderers/knotRenderers.ts`](src/core/renderers/knotRenderers.ts)

- Los segmentos de hilo entre filas usan el color vigente en la fila de destino (corte limpio en el nudo).
- Las colas inferiores usan el último tramo del hilo.
- Los bucles de la guía en las esquinas del zigzag usan el color de la guía en esa fila.
- Verificar el comportamiento con `innerThreadAlpha` y `applyAlphaToEdges`.

## 1.5 Popover de selección (escritorio)

**Nuevos archivos:** `src/components/KnotColorPopover/KnotColorPopover.tsx` y `.module.css`

- Posicionado junto al nudo, con cierre al hacer clic fuera o al pulsar `Esc`.
- Contenido:
  1. Título "Cambiar color desde este nudo".
  2. Dos muestras de hilo (izquierdo/derecho) etiquetadas como **Anudador** o **Guía**, con su color actual. Una queda seleccionada.
  3. Selector de color (`<input type="color">` más paleta rápida con los colores actuales de los hilos).
  4. Botón **"Cambiar color desde aquí"**.
  5. Si el hilo ya tiene 2 divisiones: botón desactivado y mensaje "Máximo 2 divisiones por hilo".
- Estilos con los tokens de [`tokens.css`](src/styles/tokens.css) y soporte de modo oscuro.
- Accesibilidad: foco inicial, `role="dialog"`, `aria-label` y navegación por teclado.

## 1.6 Panel de hilos con tramos

**Archivos:** [`src/components/ThreadControls/ThreadControls.tsx`](src/components/ThreadControls/ThreadControls.tsx) y su `.module.css`

- Cada hilo muestra 1 a 3 círculos en fila (sus tramos).
- Tocar un círculo abre el selector de color del tramo (`updateSegmentColor`).
- Botón **✕** en los tramos 2 y 3 para eliminar la división (`removeDivision`).
- Al pasar el cursor por un tramo, se resalta en el lienzo (estado `highlightedSegment` en el store o contexto).
- Mantener el doble clic existente para aplicar un color a todos los hilos.

## 1.7 Aviso de reinicio

- Componente `Toast` simple (o reutilizar uno existente si lo hay): "Las divisiones de color se reiniciaron al cambiar de patrón".
- Se muestra cuando `divisionsResetNotice` es verdadero y existían divisiones, y se limpia solo tras unos segundos.

## 1.8 Documentación y verificación de la fase web

- Actualizar [`README.md`](README.md) (características y controles) y [`MACRAME_KNOTS.md`](MACRAME_KNOTS.md) (cómo se cambian los colores).
- Ejecutar `npm run lint`, `npx tsc --noEmit` y `npm run build`.
- Aplicar la regla de mantenimiento de `GEMINI.md`: limpieza de código muerto, tipos y documentación tras los cambios.

### Verificación manual (web)

| # | Caso | Resultado esperado |
|---|------|--------------------|
| 1 | Tocar un nudo festón | Se abre el popover con los 2 hilos |
| 2 | Cambiar color del anudador desde un nudo | El hilo cambia de color desde ese nudo hacia abajo |
| 3 | Hilo que cambia de columna por los nudos | La división lo sigue a su nueva columna |
| 4 | Crear 2 divisiones en un hilo | La tercera queda bloqueada con aviso |
| 5 | Eliminar una división desde el panel | El hilo vuelve a su color anterior en ese tramo |
| 6 | Patrón sin nudos festón (nudo plano) | Los nudos no son interactivos |
| 7 | Cambiar de patrón o de número de hilos | Divisiones reiniciadas con aviso |
| 8 | Zigzag: bucles de guía en esquinas | Usan el color vigente de la guía |
| 9 | Sin divisiones en ningún patrón | Resultado idéntico al actual (sin regresiones) |

---

# Fase 2: Responsive (móvil)

> Requisito previo: la Fase 1 completa y verificada.

## 2.1 Interacción táctil en el lienzo

**Archivo:** [`BraceletCanvas.tsx`](src/components/BraceletCanvas/BraceletCanvas.tsx)

- Usar Pointer Events con `touch-action` adecuado para que el toque sobre un nudo no bloquee el desplazamiento del contenedor. Si hay conflicto, distinguir toque (movimiento menor a ~8 px y duración corta) de arrastre.
- Ampliar el área táctil de cada nudo (mínimo ~44×44 px lógicos) sin cambiar el dibujo.
- No depender de `hover`: en táctil se resalta el nudo solo al seleccionarlo.
- Evitar el retraso de 300 ms y el zoom por doble toque en el lienzo.

## 2.2 Bottom sheet en lugar de popover

**Archivos:** `KnotColorPopover` (adaptar) o nuevo `KnotColorSheet`

- Por debajo de un breakpoint (por ejemplo `max-width: 768px`), el selector se presenta como bottom sheet anclado abajo:
  - Fondo semitransparente que cierra al tocar fuera.
  - Asa superior y cierre por gesto de arrastrar hacia abajo (opcional) o botón de cerrar.
  - Respeta `env(safe-area-inset-bottom)`.
- Controles con tamaño táctil (mínimo 44 px), muestras de hilo grandes y paleta rápida en fila desplazable.
- El selector de color nativo móvil se abre desde un botón explícito, ya que `<input type="color">` varía según el sistema.
- Mientras el sheet está abierto, el nudo seleccionado queda resaltado y visible (desplazar el lienzo si queda tapado).

## 2.3 Panel de hilos en móvil

**Archivos:** [`ThreadControls.tsx`](src/components/ThreadControls/ThreadControls.tsx), [`Layout.module.css`](src/components/Layout/Layout.module.css)

- Revisar cómo se organiza el panel en pantallas pequeñas (colapsable o debajo del lienzo).
- Círculos de tramo y botón ✕ con área táctil suficiente, sin solaparse.
- Sustituir la interacción de "hover para resaltar" por "toque para resaltar".
- Evitar desbordes horizontales con 3 tramos por hilo y muchos hilos (envolver filas o desplazamiento horizontal).

## 2.4 Aviso y mensajes

- El toast no debe quedar tapado por el bottom sheet ni por la barra del navegador móvil.
- Mensajes cortos y legibles en pantallas estrechas.

## 2.5 Verificación de la fase móvil

- Probar con las herramientas de emulación de dispositivos (viewport 360, 390 y 768) y, si es posible, en un dispositivo real.
- Ejecutar `npm run lint`, `npx tsc --noEmit` y `npm run build`.
- Actualizar [`README.md`](README.md) si cambian los controles descritos.

### Verificación manual (móvil)

| # | Caso | Resultado esperado |
|---|------|--------------------|
| 1 | Tocar un nudo festón | Se abre el bottom sheet |
| 2 | Desplazar el lienzo con el dedo | No abre el sheet por accidente |
| 3 | Elegir hilo y color con el dedo | Controles cómodos, sin errores de toque |
| 4 | Sheet abierto con teclado de color nativo | Sin solapamientos ni pérdida del nudo seleccionado |
| 5 | Panel con 3 tramos en 360 px de ancho | Sin desbordes horizontales |
| 6 | Rotar el dispositivo | Layout y sheet se adaptan |
| 7 | Toast de reinicio | Visible y no tapado |

---

## Orden sugerido de entrega

1. **Hito 1:** núcleo (1.1) y estado (1.2), sin interfaz. Verificar que no hay regresiones visuales.
2. **Hito 2:** dibujo con color por tramo (1.4) y panel de hilos (1.6).
3. **Hito 3:** hit-testing (1.3) y popover (1.5), más aviso (1.7).
4. **Hito 4:** documentación y verificación web (1.8).
5. **Hito 5:** fase móvil completa (2.1 a 2.5).

## Riesgos y decisiones abiertas

- **Rendimiento:** redibujar el lienzo en cada `pointermove` solo para el resaltado puede ser costoso. Alternativa: capa superpuesta (segundo canvas o elemento absoluto) para el resaltado.
- **Cambio de `simulate.ts`:** es el punto de mayor riesgo, porque todos los patrones dependen de él. Conviene proteger con pruebas (Vitest ya está en las dependencias) comparando el resultado antes y después sin divisiones.
- **Guía oculta:** el color de la guía solo se ve donde asoma (por ejemplo, bucles de esquina). Se deja claro en el popover con una pista corta.
- **Persistencia:** fuera de alcance por ahora. Las divisiones viven en memoria y no se guardan al recargar.

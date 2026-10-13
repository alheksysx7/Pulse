# Pulse 🪢

**Pulse** es un simulador y diseñador interactivo de macramé y pulseras de nudos en tiempo real, construido con React, TypeScript y Canvas 2D. Diseñado para ofrecer una representación fotorrealista de la tensión física, textura de hilos, capas de entrelazado tridimensional y guías paso a paso para aprender a tejer en la vida real.

---

## ✨ Características Principales

- **🎨 Renderizado Fotorrealista en Canvas 2D:**
  - Simulación de texturas de fibra y torsión de hilo con patrones procedurales.
  - Sombras de profundidad proyectadas sobre hilos internos y de fondo.
  - Entrelazado multicapa (fondo, hilos centrales y codos frontales de bloqueo).
  - Dinámica física en el espaciado vertical (por ejemplo, los nudos festón se vuelven completamente horizontales al tensar el espaciado).
  - Bucles continuos del hilo guía en las esquinas para patrones de vaivén (zigzag).

- **📐 Catálogo de Patrones de Macramé:**
  - **Tejido Nudo Plano (Flat Square Knot):** 2, 3 o 4 hilos con capas 3D y bloqueo de codos.
  - **Festón Simétrico de 4 Hilos:** Entrelazado central que abraza hilos guía exteriores en vaivén.
  - **Diagonal y Pares Entrelazados (6 Hilos):** Diagonales continuas combinadas con pares adheridos.
  - **Pulsera de 2 Hilos con Intercambio:** Medio festón alternado con núcleo dinámico y lazos laterales.
  - **Festón Zigzag Alterno (3 Hilos):** Tejido continuo con hilo guía en U en las esquinas y rotación dinámica a horizontal.
  - **Festón Diagonal / En Cadena:** Franjas multicolores oblicuas clásicas.
  - **Festón con Salto y Balines (Abalorios):** Inserción interactiva de cuentas de oro, plata o madera.
  - **Medio Festón Alternado:** Estructura cilíndrica y compacta en espiral.
  - **Festón en V (Chevron):** Variantes clásicas y flechas simétricas en ángulo.

- **🎛️ Controles en Tiempo Real:**
  - Cantidad de hilos personalizable con validación par/impar según el patrón.
  - **Divisiones de Color Interactivas en Nudos Festón (Corte Limpio):** Haz clic sobre cualquier nudo festón para abrir el popover interactivo, elegir anudador o guía y cambiar su color a partir de ese punto (hasta 2 divisiones por hilo / 3 tramos de color).
  - Cronología visual de tramos por hilo en el panel de control con selector por segmento, eliminación rápida (`×`) y resaltado sincronizado al pasar el cursor.
  - Selector interactivo de color por hilo y paletas predefinidas con rotación cíclica al hacer clic.
  - Control de espaciado vertical (`Vertical Spacing`) y tamaño de nudos (`Knot Size`).
  - Activación de abalorios y selección de materiales metálicos o maderas.
  - Detección automática de contraste con modo oscuro adaptativo para paletas claras.

- **📖 Guía e Instrucciones Paso a Paso:**
  - Pestaña integrada con instrucciones claras, preparación de materiales y fases de tejido para replicar cada pulsera en el mundo real.
  - Documentación técnica exhaustiva en [`MACRAME_KNOTS.md`](./MACRAME_KNOTS.md).

---

## 🛠️ Tecnologías

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estado Global:** [Zustand](https://github.com/pmndrs/zustand)
- **Animaciones e Iconos:** [Framer Motion](https://www.framer.com/motion/) & [Lucide React](https://lucide.dev/)
- **Estilos:** CSS Modules
- **Linter & Build:** [Oxlint](https://oxc.rs/) & Vite Compiler

---

## 🚀 Inicio Rápido

### Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- `npm`, `pnpm` o `yarn`

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/alheksysx7/Pulse.git
   cd Pulse
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver la aplicación.

### Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo Vite con Hot Module Replacement (HMR).
- `npm run build`: Compila TypeScript (`tsc -b`) y empaqueta la aplicación para producción con Vite.
- `npm run lint`: Ejecuta el linter ultrarrápido [Oxlint](https://oxc.rs/).
- `npm run preview`: Previsualiza la compilación de producción localmente.

---

## 📂 Estructura del Proyecto

```text
src/
├── components/
│   ├── BraceletCanvas/    # Renderizador 2D en Canvas (hilos, sombras, nudos, abalorios)
│   ├── Instructions/      # Guías paso a paso de tejido para cada patrón
│   ├── Layout/            # Estructura principal de la interfaz
│   ├── PatternPicker/     # Selector visual de patrones
│   └── ThreadControls/    # Controles de hilos, colores, espaciados y abalorios
├── core/
│   ├── palettes.ts        # Paletas de color temáticas predefinidas
│   ├── patterns/          # Definición y generadores de secuencias de cada patrón
│   ├── renderers/         # Renderizadores especializados de cada tipo de nudo
│   ├── simulate.ts        # Motor de simulación y rastreo de posiciones de hilos
│   └── types.ts           # Interfaces de TypeScript (Pattern, Knot, KnotType)
├── store/
│   └── useDesignStore.ts  # Estado global con Zustand
├── App.tsx
└── main.tsx
```

---

## 📚 Documentación de Nudos

Para conocer los detalles matemáticos de renderizado, envergadura de hilos (`threadSpan`), capas de simulación e instrucciones de confección manual, consulta [**`MACRAME_KNOTS.md`**](./MACRAME_KNOTS.md).

---

## 📄 Licencia

Este proyecto está disponible bajo uso privado o según los términos del repositorio.

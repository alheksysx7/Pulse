export type Language = 'es' | 'en';

export const TRANSLATIONS = {
  es: {
    // Header & Brand
    appTitle: 'Pulse',
    appSubtitle: 'Macramé Studio',
    themeLight: 'Ambiente claro',
    themeDark: 'Ambiente oscuro',
    themeNature: 'Ambiente naturaleza',
    themeAria: 'Ambiente de fondo',
    languageAria: 'Seleccionar idioma',

    // View tabs
    tabSimulation: 'Simulación',
    tabInstructions: 'Instrucciones',
    loadingView: 'Cargando vista...',

    // Mobile Bottom Sheet
    controlsSheetTitle: 'Controles y Ajustes',
    controlsSheetExpand: 'Abrir controles',
    controlsSheetCollapse: 'Pantalla completa',

    // Sidebar Accordions
    sectionBaseStructure: 'Estructura Base',
    sectionGeometry: 'Geometría',
    sectionColorStyle: 'Color y Estilo',

    // Base structure controls
    patternLabel: 'Patrón de tejido',
    threadsLabel: 'Hilos',
    fixedBadge: 'Fijo',
    fixedBadgeTitle: 'Este patrón tiene un número fijo de hilos',
    fixedHint: (min: number) => `Este patrón requiere exactamente ${min} hilos para su estructura.`,

    // Geometry controls
    verticalSpacingLabel: 'Espaciado Vertical',
    knotSizeLabel: 'Tamaño del Nudo',
    addBeadsLabel: 'Agregar Balines (Abalorios)',
    beadGold: 'Dorado',
    beadSilver: 'Plateado',
    beadWood: 'Madera',

    // Color & Style controls
    colorsLabel: 'Colores de los Hilos',
    colorItemTooltip: 'Doble clic para aplicar este color a todos los hilos',
    colorInputAria: (n: number) => `Color del hilo ${n}`,
    palettesLabel: 'Paletas de Colores',
    palettesSubtitle: 'Clic para aplicar. Clic de nuevo para rotar colores.',
    divisionsResetNotice: 'Las divisiones de color se reiniciaron al cambiar la configuración.',
    dismissNotice: 'Cerrar',
    removeDivisionAria: 'Eliminar división de color',
    addDivisionTitle: 'Cambiar color desde este nudo',
    knotSelectedTitle: 'Nudo seleccionado',
    knotRowLabel: (row: number) => `Fila ${row + 1}`,
    knottedThread: 'Anudador',
    guideThread: 'Guía',
    changeColorFromHere: 'Cambiar color desde aquí',
    maxDivisionsReached: 'Máximo 2 divisiones por hilo',
    selectThreadToChange: 'Selecciona qué hilo cambiar:',
    newColorLabel: 'Nuevo color:',

    // Pattern names (translated if needed)
    patterns: {
      'diagonal-festoon': 'Festón Diagonal',
      'feston-simetrico-4': 'Festón Simétrico 4 Hilos',
      'diagonal-pairs-6': 'Diagonal y Pares Entrelazados',
      'alternating-2-thread': '2 Hilos con Intercambio',
      'zigzag-festoon': 'Festón Zigzag',
      'jumping-festoon': 'Festón con Saltos',
      'alternating-half-hitch': 'Medio Festón Alterno',
      'v-festoon-chevron': 'Festón en V (Variante)',
      'chevron': 'Chevron Clásico',
      'square': 'Nudo Plano'
    } as Record<string, string>,

    // Palettes names (Spanish native)
    palettes: {
      'Clásica Marinera': 'Clásica Marinera',
      'Mocha Mousse': 'Mocha Mousse',
      'Terracota y Salvia': 'Terracota y Salvia',
      'Costa Mediterránea': 'Costa Mediterránea',
      'Lavanda y Uva': 'Lavanda y Uva',
      'Cobalto Moderno': 'Cobalto Moderno',
      'Matcha': 'Matcha',
      'Bosque Profundo': 'Bosque Profundo',
      'Cereza Burdeos': 'Cereza Burdeos',
      'Sorbete Vivo': 'Sorbete Vivo',
      'Atardecer Cálido': 'Atardecer Cálido'
    } as Record<string, string>
  },
  en: {
    // Header & Brand
    appTitle: 'Pulse',
    appSubtitle: 'Macramé Studio',
    themeLight: 'Light theme',
    themeDark: 'Dark theme',
    themeNature: 'Nature theme',
    themeAria: 'Background theme',
    languageAria: 'Select language',

    // View tabs
    tabSimulation: 'Simulation',
    tabInstructions: 'Instructions',
    loadingView: 'Loading view...',

    // Mobile Bottom Sheet
    controlsSheetTitle: 'Controls & Settings',
    controlsSheetExpand: 'Open controls',
    controlsSheetCollapse: 'Full screen',

    // Sidebar Accordions
    sectionBaseStructure: 'Base Structure',
    sectionGeometry: 'Geometry',
    sectionColorStyle: 'Color & Style',

    // Base structure controls
    patternLabel: 'Weave Pattern',
    threadsLabel: 'Threads',
    fixedBadge: 'Fixed',
    fixedBadgeTitle: 'This pattern requires a fixed number of threads',
    fixedHint: (min: number) => `This pattern requires exactly ${min} threads for its structure.`,

    // Geometry controls
    verticalSpacingLabel: 'Vertical Spacing',
    knotSizeLabel: 'Knot Size',
    addBeadsLabel: 'Add Beads',
    beadGold: 'Gold',
    beadSilver: 'Silver',
    beadWood: 'Wood',

    // Color & Style controls
    colorsLabel: 'Thread Colors',
    colorItemTooltip: 'Double-click to apply this color to all threads',
    colorInputAria: (n: number) => `Thread color ${n}`,
    palettesLabel: 'Color Palettes',
    palettesSubtitle: 'Click to apply. Click again to cycle colors.',
    divisionsResetNotice: 'Color divisions were reset due to configuration change.',
    dismissNotice: 'Dismiss',
    removeDivisionAria: 'Remove color division',
    addDivisionTitle: 'Change color from this knot',
    knotSelectedTitle: 'Selected Knot',
    knotRowLabel: (row: number) => `Row ${row + 1}`,
    knottedThread: 'Working Thread',
    guideThread: 'Guide',
    changeColorFromHere: 'Change color from here',
    maxDivisionsReached: 'Maximum 2 divisions per thread reached',
    selectThreadToChange: 'Select thread to change:',
    newColorLabel: 'New color:',

    // Pattern names (English)
    patterns: {
      'diagonal-festoon': 'Diagonal Festoon',
      'feston-simetrico-4': '4-Thread Symmetric Festoon',
      'diagonal-pairs-6': 'Diagonal & Interlocked Pairs',
      'alternating-2-thread': '2-Thread Alternating',
      'zigzag-festoon': 'Zigzag Festoon',
      'jumping-festoon': 'Skipping Festoon',
      'alternating-half-hitch': 'Alternating Half-Hitch',
      'v-festoon-chevron': 'V-Festoon Chevron',
      'chevron': 'Classic Chevron',
      'square': 'Square Knot'
    } as Record<string, string>,

    // Palettes names (English translated)
    palettes: {
      'Clásica Marinera': 'Classic Sailor',
      'Mocha Mousse': 'Mocha Mousse',
      'Terracota y Salvia': 'Terracotta & Sage',
      'Costa Mediterránea': 'Mediterranean Coast',
      'Lavanda y Uva': 'Lavender & Grape',
      'Cobalto Moderno': 'Modern Cobalt',
      'Matcha': 'Matcha',
      'Bosque Profundo': 'Deep Forest',
      'Cereza Burdeos': 'Bordeaux Cherry',
      'Sorbete Vivo': 'Vibrant Sorbet',
      'Atardecer Cálido': 'Warm Sunset'
    } as Record<string, string>
  }
};

import { create } from 'zustand';
import { PATTERNS } from '../core/patterns';
import { PREDEFINED_PALETTES } from '../core/palettes';

export interface DesignState {
  patternId: string;
  threadsCount: number;
  rowsCount: number;
  colors: string[];
  activePaletteName: string | null;
  paletteShift: number;
  
  setPatternId: (id: string) => void;
  setThreadsCount: (count: number) => void;
  setRowsCount: (count: number) => void;
  setColor: (index: number, color: string) => void;
  applyPalette: (name: string, colors: string[]) => void;
}

const defaultPatternId = 'chevron';
const defaultThreadsCount = 8;
const defaultColors = PREDEFINED_PALETTES[0].colors;

// Repeat palette colors if we have more threads than palette colors
const getInitialColors = (count: number, palette: string[]) => {
  return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
};

export const useDesignStore = create<DesignState>((set) => ({
  patternId: defaultPatternId,
  threadsCount: defaultThreadsCount,
  rowsCount: 20, // default visible rows
  colors: getInitialColors(defaultThreadsCount, defaultColors),
  activePaletteName: PREDEFINED_PALETTES[0].name,
  paletteShift: 0,

  setPatternId: (id) => set((state) => {
    const pattern = PATTERNS[id];
    let newThreadsCount = state.threadsCount;
    if (pattern.evenOnly && newThreadsCount % 2 !== 0) {
      newThreadsCount += 1;
    }
    newThreadsCount = Math.max(pattern.minThreads, newThreadsCount);
    if (pattern.maxThreads !== undefined) {
      newThreadsCount = Math.min(pattern.maxThreads, newThreadsCount);
    }
    
    let newColors = state.colors;
    if (newThreadsCount !== state.colors.length) {
      newColors = getInitialColors(newThreadsCount, state.colors);
    }
    
    return { patternId: id, threadsCount: newThreadsCount, colors: newColors };
  }),
  
  setThreadsCount: (count) => set((state) => {
    const pattern = PATTERNS[state.patternId];
    let newCount = Math.max(pattern.minThreads, count);
    if (pattern.maxThreads !== undefined) {
      newCount = Math.min(pattern.maxThreads, newCount);
    }
    if (pattern.evenOnly && newCount % 2 !== 0) {
      newCount += 1; // or subtract, but +1 is safer
      if (pattern.maxThreads !== undefined && newCount > pattern.maxThreads) {
        newCount -= 2;
      }
    }
    return { 
      threadsCount: newCount,
      colors: getInitialColors(newCount, state.colors)
    };
  }),
  
  setRowsCount: (count) => set({ rowsCount: count }),
  
  setColor: (index, color) => set((state) => {
    const newColors = [...state.colors];
    newColors[index] = color;
    return { colors: newColors, activePaletteName: null, paletteShift: 0 }; // clear active palette if manually edited
  }),
  
  applyPalette: (name, colors) => set((state) => {
    let newShift = 0;
    if (state.activePaletteName === name) {
      newShift = (state.paletteShift + 1) % colors.length;
    }
    
    const shiftedPalette = [...colors.slice(newShift), ...colors.slice(0, newShift)];
    
    return {
      activePaletteName: name,
      paletteShift: newShift,
      colors: getInitialColors(state.threadsCount, shiftedPalette)
    };
  })
}));

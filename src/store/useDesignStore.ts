import { create } from 'zustand';
import { PATTERNS } from '../core/patterns';
import { PREDEFINED_PALETTES } from '../core/palettes';
import type { ThreadSegment, SelectedKnotInfo } from '../core/types';

export const MAX_DIVISIONS = 2; // max 3 segments per thread

export interface DesignState {
  patternId: string;
  threadsCount: number;
  colors: string[]; // derived/mirror of segment 0 colors for backwards compatibility
  segments: ThreadSegment[][]; // segments per thread ID (original thread index)
  highlightedThreadId: number | null; // For hover highlighting thread across canvas & panel
  selectedKnot: SelectedKnotInfo | null; // Currently clicked knot for editing color divisions
  divisionsResetNotice: boolean;
  activePaletteName: string | null;
  paletteShift: number;
  verticalSpacing: number; // Multiplier for the vertical spacing between rows
  showBeads: boolean;
  beadType: 'gold' | 'silver' | 'wood';
  knotSize: number;
  language: 'es' | 'en';
  
  setPatternId: (id: string) => void;
  setThreadsCount: (count: number) => void;
  setColor: (index: number, color: string) => void;
  setAllColors: (color: string) => void;
  applyPalette: (name: string, colors: string[]) => void;
  setVerticalSpacing: (spacing: number) => void;
  setShowBeads: (show: boolean) => void;
  setBeadType: (type: 'gold' | 'silver' | 'wood') => void;
  setKnotSize: (size: number) => void;
  setLanguage: (lang: 'es' | 'en') => void;

  // Color divisions
  addDivision: (threadId: number, fromRow: number, color: string) => boolean;
  updateSegmentColor: (threadId: number, segmentIndex: number, color: string) => void;
  removeDivision: (threadId: number, segmentIndex: number) => void;
  resetDivisions: () => void;
  clearDivisionsResetNotice: () => void;
  setHighlightedThreadId: (threadId: number | null) => void;
  setSelectedKnot: (knot: SelectedKnotInfo | null) => void;
}

const defaultPatternId = 'diagonal-festoon';
const defaultThreadsCount = PATTERNS[defaultPatternId].defaultThreads ?? 4;
const defaultColors = PREDEFINED_PALETTES[0].colors;

// Repeat palette colors if we have more threads than palette colors
const getInitialColors = (count: number, palette: string[]) => {
  return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
};

const createInitialSegments = (colors: string[]): ThreadSegment[][] => {
  return colors.map((c) => [{ fromRow: 0, color: c }]);
};

const hasAnyDivisions = (segments: ThreadSegment[][]): boolean => {
  return segments.some(segs => segs.length > 1);
};

const initialColorsList = getInitialColors(defaultThreadsCount, defaultColors);

export const useDesignStore = create<DesignState>((set) => ({
  patternId: defaultPatternId,
  threadsCount: defaultThreadsCount,
  colors: initialColorsList,
  segments: createInitialSegments(initialColorsList),
  highlightedThreadId: null,
  selectedKnot: null,
  divisionsResetNotice: false,
  activePaletteName: PREDEFINED_PALETTES[0].name,
  paletteShift: 0,
  verticalSpacing: PATTERNS[defaultPatternId].defaultVerticalSpacing ?? 1.0,
  showBeads: false,
  beadType: 'gold' as 'gold' | 'silver' | 'wood',
  knotSize: PATTERNS[defaultPatternId].defaultKnotSize ?? 24,
  language: (localStorage.getItem('pulse-lang') === 'en' ? 'en' : 'es') as 'es' | 'en',

  setLanguage: (lang) => {
    localStorage.setItem('pulse-lang', lang);
    set({ language: lang });
  },

  setHighlightedThreadId: (threadId) => set({ highlightedThreadId: threadId }),

  setSelectedKnot: (knot) => set({ selectedKnot: knot }),

  clearDivisionsResetNotice: () => set({ divisionsResetNotice: false }),

  resetDivisions: () => set((state) => ({
    segments: createInitialSegments(state.colors),
    divisionsResetNotice: false,
    selectedKnot: null
  })),

  addDivision: (threadId, fromRow, color) => {
    let success = false;
    set((state) => {
      const threadSegs = state.segments[threadId];
      if (!threadSegs || threadSegs.length >= MAX_DIVISIONS + 1) {
        return state;
      }
      // Check if fromRow is already used by a segment in this thread
      const existingIdx = threadSegs.findIndex(s => s.fromRow === fromRow);
      let updatedSegs: ThreadSegment[];
      if (existingIdx !== -1) {
        // Update existing segment color
        updatedSegs = threadSegs.map((s, idx) => idx === existingIdx ? { ...s, color } : s);
      } else {
        updatedSegs = [...threadSegs, { fromRow, color }].sort((a, b) => a.fromRow - b.fromRow);
      }
      const newSegments = [...state.segments];
      newSegments[threadId] = updatedSegs;
      success = true;
      return { segments: newSegments };
    });
    return success;
  },

  updateSegmentColor: (threadId, segmentIndex, color) => set((state) => {
    const threadSegs = state.segments[threadId];
    if (!threadSegs || !threadSegs[segmentIndex]) return state;

    const newThreadSegs = threadSegs.map((s, idx) => idx === segmentIndex ? { ...s, color } : s);
    const newSegments = [...state.segments];
    newSegments[threadId] = newThreadSegs;

    // If updating segment 0, keep state.colors in sync
    const newColors = [...state.colors];
    if (segmentIndex === 0) {
      newColors[threadId] = color;
    }

    return {
      segments: newSegments,
      colors: newColors,
      activePaletteName: null,
      paletteShift: 0
    };
  }),

  removeDivision: (threadId, segmentIndex) => set((state) => {
    if (segmentIndex === 0) return state; // Cannot remove initial segment
    const threadSegs = state.segments[threadId];
    if (!threadSegs || !threadSegs[segmentIndex]) return state;

    const newThreadSegs = threadSegs.filter((_, idx) => idx !== segmentIndex);
    const newSegments = [...state.segments];
    newSegments[threadId] = newThreadSegs;
    return { segments: newSegments };
  }),

  setPatternId: (id) => set((state) => {
    const pattern = PATTERNS[id];
    let newThreadsCount = pattern.defaultThreads ?? state.threadsCount;
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

    const hadDivisions = hasAnyDivisions(state.segments);
    
    return { 
      patternId: id, 
      threadsCount: newThreadsCount, 
      colors: newColors,
      segments: createInitialSegments(newColors),
      divisionsResetNotice: hadDivisions,
      verticalSpacing: pattern.defaultVerticalSpacing ?? 1.0,
      knotSize: pattern.defaultKnotSize ?? 24
    };
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
    const newColors = getInitialColors(newCount, state.colors);
    const hadDivisions = hasAnyDivisions(state.segments);

    return { 
      threadsCount: newCount,
      colors: newColors,
      segments: createInitialSegments(newColors),
      divisionsResetNotice: hadDivisions && newCount !== state.threadsCount
    };
  }),
  
  setColor: (index, color) => set((state) => {
    const newColors = [...state.colors];
    newColors[index] = color;
    // Update base segment for that thread
    const newSegments = [...state.segments];
    if (newSegments[index]) {
      newSegments[index] = newSegments[index].map((s, idx) => idx === 0 ? { ...s, color } : s);
    }
    return { colors: newColors, segments: newSegments, activePaletteName: null, paletteShift: 0 };
  }),
  
  setAllColors: (color) => set((state) => {
    const newColors = new Array(state.threadsCount).fill(color);
    return { 
      colors: newColors, 
      segments: createInitialSegments(newColors),
      divisionsResetNotice: false,
      activePaletteName: null, 
      paletteShift: 0 
    };
  }),
  
  applyPalette: (name, colors) => set((state) => {
    let newShift = 0;
    if (state.activePaletteName === name) {
      newShift = (state.paletteShift + 1) % colors.length;
    }
    
    const shiftedPalette = [...colors.slice(newShift), ...colors.slice(0, newShift)];
    const newColors = getInitialColors(state.threadsCount, shiftedPalette);
    
    return {
      activePaletteName: name,
      paletteShift: newShift,
      colors: newColors,
      segments: createInitialSegments(newColors),
      divisionsResetNotice: false
    };
  }),
  
  setVerticalSpacing: (spacing) => set((state) => {
    const pattern = PATTERNS[state.patternId];
    const min = pattern.minVerticalSpacing ?? 0.6;
    const max = pattern.maxVerticalSpacing ?? 2.0;
    return { verticalSpacing: Math.min(max, Math.max(min, spacing)) };
  }),
  setShowBeads: (show) => set({ showBeads: show }),
  setBeadType: (type) => set({ beadType: type }),
  setKnotSize: (size) => set({ knotSize: size })
}));

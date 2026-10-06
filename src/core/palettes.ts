export interface Palette {
  name: string;
  colors: string[];
}

export const PREDEFINED_PALETTES: Palette[] = [
  {
    name: 'Boho Chic',
    colors: ['#D36C50', '#E5D5C5', '#8A9A86', '#E5B181', '#5B6B5D']
  },
  {
    name: 'Pastel Soft',
    colors: ['#FAD4D8', '#F3E1E1', '#D4E2D4', '#E6E6FA', '#FFF0BA']
  },
  {
    name: 'Earth Tones',
    colors: ['#5A3D31', '#8C6239', '#D9A05B', '#C17767', '#3D4A3E']
  },
  {
    name: 'Sunset',
    colors: ['#2A1B38', '#E04A3A', '#F39C12', '#F1C40F', '#E87E04']
  },
  {
    name: 'Neon Cyberpunk',
    colors: ['#FF003C', '#00ff88ff', '#D600FF', '#00B8FF', '#0D0208']
  },
  {
    name: 'Ocean Waves',
    colors: ['#031B33', '#004A7C', '#005691', '#E8F1F5', '#A5D8DD']
  }
];

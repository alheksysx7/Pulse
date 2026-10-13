export interface Palette {
  name: string;
  colors: string[];
}

// Paletas de 5 colores pensadas para hilo encerado: tonos reales de carta de color
// (sin neones ni pasteles casi blancos); los claros son crema/marfil, los oscuros
// negro/chocolate/azul marino, como se consiguen en hilo encerado.
// La primera es la paleta por defecto del diseño.
export const PREDEFINED_PALETTES: Palette[] = [
  {
    name: 'Clásica Marinera',
    colors: ['#1B2A49', '#005C97', '#F4F4F0', '#A1232B', '#D7C4A5']
  },
  {
    name: 'Mocha Mousse',
    colors: ['#A47864', '#6F4E37', '#D9B99B', '#F1E3D3', '#3E2A22']
  },
  {
    name: 'Terracota y Salvia',
    colors: ['#C96F4A', '#E3AB90', '#8FA37E', '#5E6B4F', '#EFE4D3']
  },
  {
    name: 'Costa Mediterránea',
    colors: ['#0F7C90', '#5FB8C4', '#F2E8D5', '#E07A5F', '#E8AE4C']
  },
  {
    name: 'Lavanda y Uva',
    colors: ['#B39DDB', '#8E6FD1', '#CDBDE6', '#5B4B8A', '#EFE9E1']
  },
  {
    name: 'Cobalto Moderno',
    colors: ['#1F4FD8', '#0B1E5B', '#EEF0F2', '#E8B53A', '#6F9BD8']
  },
  {
    name: 'Matcha',
    colors: ['#8AA66B', '#B7C98F', '#4E6B3C', '#F1EBD6', '#2F3B28']
  },
  {
    name: 'Bosque Profundo',
    colors: ['#2C4C3B', '#596A48', '#4A3525', '#8B3A33', '#888C8D']
  },
  {
    name: 'Sorbete Vivo',
    colors: ['#F2693F', '#F4B731', '#EE7FA3', '#4DB6D9', '#8A55C9']
  },
  {
    name: 'Atardecer Cálido',
    colors: ['#5B2333', '#9A2A54', '#D96C4A', '#ECA42E', '#E8E3D9']
  }
];

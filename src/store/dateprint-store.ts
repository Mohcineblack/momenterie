import { create } from 'zustand';

interface DatePrintStyle {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}

interface DatePrintState {
  date: Date | null;
  title: string;
  subtitle: string;
  style: DatePrintStyle;

  setDate: (date: Date | null) => void;
  setTitle: (title: string) => void;
  setSubtitle: (subtitle: string) => void;
  setStyle: (style: DatePrintStyle) => void;
  resetEditor: () => void;
}

export const dateStyles: DatePrintStyle[] = [
  {
    id: 'minimal-black',
    name: 'Minimal Black',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    fontFamily: 'Inter',
  },
  {
    id: 'classic-serif',
    name: 'Classic Serif',
    backgroundColor: '#F9FAFB',
    textColor: '#1F2937',
    fontFamily: 'serif',
  },
  {
    id: 'elegant-gold',
    name: 'Elegant Gold',
    backgroundColor: '#1F2937',
    textColor: '#D4AF37',
    fontFamily: 'serif',
  },
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    backgroundColor: '#EFF6FF',
    textColor: '#1E40AF',
    fontFamily: 'Inter',
  },
  {
    id: 'warm-beige',
    name: 'Warm Beige',
    backgroundColor: '#FEF3C7',
    textColor: '#92400E',
    fontFamily: 'serif',
  },
];

const defaultState = {
  date: null,
  title: '',
  subtitle: '',
  style: dateStyles[0],
};

export const useDatePrintStore = create<DatePrintState>((set) => ({
  ...defaultState,

  setDate: (date: Date | null) => set({ date }),
  setTitle: (title: string) => set({ title }),
  setSubtitle: (subtitle: string) => set({ subtitle }),
  setStyle: (style: DatePrintStyle) => set({ style }),
  resetEditor: () => set(defaultState),
}));

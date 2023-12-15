import { create } from 'zustand';
import { GrupoTipo } from '../../../../types/GrupoTipo';

type CountState = {
  count: number;
  divisao: number,
  countIncrement: () => void;
  countDecrement: () => void;
  divisaoIncrement: (x: number) => void;
};

export const useCount = create<CountState>((set) => ({
  count: 0,
  divisao: 1,
  countIncrement: () => set((state) => ({ count: state.count + 1 })),
  countDecrement: () => set((state) => ({ count: state.count > 0 ? state.count - 1 : 0 })),
  divisaoIncrement: (x) => set((state) => ({ divisao: x }))
}));

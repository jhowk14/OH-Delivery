import { create } from 'zustand';

type StringState = {
  token: string;
  setToken: (value: string) => void;
};

export const useToken = create<StringState>((set) => ({
    token: '',
    setToken: (value) => set({ token: value }),
}));

import { create } from 'zustand';
import axios from 'axios';
import { Empresas } from '../../../../types/Empresa';
import { apiUrl } from '@/app/utils/apiUrl';

type EmpresaState = {
  empresa: Empresas | null;
  error: string | null;
  isLoading: boolean;
  getEmpresa: (link: string) => void;
  setEmpresa: (empresa: Empresas | null) => void; // New function to set empresa
};

export const useEmpresaStore = create<EmpresaState>((set) => ({
  empresa: null,
  error: null,
  isLoading: false,
  getEmpresa: async (link) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${apiUrl}/empresa/${link}`);
      set({ empresa: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Erro ao buscar a empresa', isLoading: false });
    }
  },
  setEmpresa: (novaEmpresa) => set({ empresa: novaEmpresa }), // Implementation of setEmpresa
}));

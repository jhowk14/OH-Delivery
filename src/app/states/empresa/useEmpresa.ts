import { create,  Mutate } from 'zustand';
import axios from 'axios';
import { Empresas } from '../../../../types/Empresa';
import { apiUrl } from '@/app/utils/apiUrl';

type EmpresaState = {
  empresa: Empresas | null;
  error: string | null;
  isLoading: boolean;
  getEmpresa: (link: string) => Promise<Empresas | null>; // Return type updated
  setEmpresa: (empresa: Empresas | null) => void;
};

export const useEmpresaStore = create<EmpresaState>((set) => ({
  empresa: null,
  error: null,
  isLoading: false,
  getEmpresa: async (link) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${apiUrl}/empresa/${link}`);
      const empresaData: Empresas = response.data;
      set({ empresa: empresaData, isLoading: false });
      return empresaData; // Return the empresa after successful fetch
    } catch (error) {
      set({ error: 'Erro ao buscar a empresa', isLoading: false });
      return null; // Return null in case of error
    }
  },
  setEmpresa: (novaEmpresa) => set({ empresa: novaEmpresa }),
}));

import { create } from 'zustand';
import axios from 'axios';
import { Grupo } from '../../../../types/Grupos';
import { Produto } from '../../../../types/Produto';
import { apiUrl } from '@/app/utils/apiUrl';

type GrupoState = {
  grupos: { [id: string]: Grupo };
  produtos: { [grupoId: string]: Produto[] };
  complementos: { [grupoId: string]: Produto[] };
  isLoadingGrupo: boolean;
  isLoadingProdutos: boolean;
  isLoadingComplementos: boolean;
  getGrupo: (grupoId: string) => Promise<Grupo>;
  getProdutos: (grupoId: string) => Promise<Produto[]>;
  getComplementos: (grupoId: string) => Promise<Produto[]>;  // Adicione esta função
};

export const useGrupoStore = create<GrupoState>((set) => ({
  grupos: {},
  produtos: {},
  complementos: {},  // Adicione o estado para complementos
  isLoadingGrupo: false,
  isLoadingProdutos: false,
  isLoadingComplementos: false,  // Adicione o estado de carregamento para complementos
  getGrupo: async (grupoId) => {
    set({ isLoadingGrupo: true });
    try {
      const response = await axios.get(`${apiUrl}/grupoid/${grupoId}`);
      const novoGrupo = { [grupoId]: response.data };
      set((state) => ({ grupos: { ...state.grupos, ...novoGrupo }, isLoadingGrupo: false }));
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar o grupo:', error);
      set({ isLoadingGrupo: false });
    }
  },
  getProdutos: async (grupoId) => {
    set({ isLoadingProdutos: true });
    try {
      const response = await axios.get(`${apiUrl}/produtos/${grupoId}`);
      const novoProdutos = { [grupoId]: response.data };
      set((state) => ({ produtos: { ...state.produtos, ...novoProdutos }, isLoadingProdutos: false }));
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar os produtos:', error);
      set({ isLoadingProdutos: false });
    }
  },
  getComplementos: async (grupoId) => {  // Adicione a função para obter complementos
    set({ isLoadingComplementos: true });
    try {
      const response = await axios.get(`${apiUrl}/complementos/${grupoId}`);
      const novoComplementos = { [grupoId]: response.data };
      set((state) => ({ complementos: { ...state.complementos, ...novoComplementos }, isLoadingComplementos: false }));
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar os complementos:', error);
      set({ isLoadingComplementos: false });
    }
  },
}));

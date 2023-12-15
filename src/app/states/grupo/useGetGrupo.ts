import { create } from 'zustand';
import axios from 'axios'; // Replace with your actual Group type
import { apiUrl } from '@/app/utils/apiUrl';
import { Grupo } from '../../../../types/Grupos';

type GrupoState = {
  grupo: Grupo[] | null;
  error: string | null;
  isLoading: boolean;
  getGrupo: (id: string) => void;
};

export const useGrupoStore = create<GrupoState>((set) => ({
  grupo: null,
  error: null,
  isLoading: false,
  getGrupo: async (id) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${apiUrl}/grupo/${id}`);
      set({ grupo: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Error fetching the group', isLoading: false });
    }
  },
}));

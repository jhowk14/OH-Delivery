import { create } from 'zustand'
import { Grupo } from '../../../../types/Grupos'

type ActionStore = {
  addEmpresa: (grupo: Grupo) => void
}

type StoreProps = {
  state: {
    grupo: Grupo | null
  }
  semDivisao: boolean | null,
  actions: ActionStore
}

export const useGrupo = create<StoreProps>()((set) => ({
  state: {
    grupo: null
  },
  semDivisao: null,
  actions:{
    addEmpresa: (grupo) => set((state) => ({
      state: { grupo:  grupo}
    }))
}}))
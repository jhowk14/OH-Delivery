import { create } from 'zustand'
import { GrupoTipo } from '../../../../types/GrupoTipo'

type ActionStore = {
  addEmpresa: (grupo: GrupoTipo| null) => void
}

type StoreProps = {
  state: {
    grupo: GrupoTipo | null
  }
  actions: ActionStore
}

export const useGrupoTipo = create<StoreProps>()((set) => ({
  state: {
    grupo: null
  },
  actions:{
    addEmpresa: (grupo) => set((state) => ({state: { grupo: grupo}})),
  }}))
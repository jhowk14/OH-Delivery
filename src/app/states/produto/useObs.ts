import { create }from 'zustand';

export type Observacao = {
  prodId: number;
  obs: string;
};

type StoreProps = {
  observacoes: Observacao[];
  adicionarObservacao: (novaObservacao: Observacao) => void;
  removerObservacao: (prodId: number) => void;
  resetObs: () => void
};

export const useObservacoes = create<StoreProps>((set) => ({
  observacoes: [],
  adicionarObservacao: (novaObservacao: Observacao) => {
    set((state) => ({
      observacoes: [...state.observacoes, novaObservacao],
    }));
  },
  removerObservacao: (prodId: number) => {
    set((state) => ({
      observacoes: state.observacoes.filter((obs) => obs.prodId !== prodId),
    }));
  },
  resetObs: () =>{
    set((state) => ({
      observacoes: []
    }))
  }
}));

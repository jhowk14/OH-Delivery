import { create } from 'zustand';
import { Produto, ProdutoSubmit } from '../../../../types/Produto';

interface Complemento extends Produto {
  produtoId: number
}

type ActionStore = {
  produtos: Partial<ProdutoSubmit>[];
  Complementos: Complemento[];
  addComplemento: (complemento: Complemento) => void;
  removeComplemento: (id: number) => void
  addProduto: (produto: Partial<Produto>) => void;
  removeProduto: (id: number) => void;
  resetComplementos: () => void
  resetProdutos: () => void
};

export const useProduto = create<ActionStore>((set) => ({
  produtos: [],
  Complementos: [],
  addProduto: (produto: Partial<Produto>) => {
    if (produto.quantidade! > 0) {
      return set((state) => {
        const existingIndex = state.produtos.findIndex((p) => p.ProdID === produto.ProdID);
        const newProdutos = [...state.produtos];
        if (produto.quantidade! > 0) {
          if (existingIndex !== -1) {
            newProdutos[existingIndex] = produto;
          } else {
            newProdutos.push(produto);
          }
        }
        return { produtos: newProdutos };
      });
    }
    return set((state) => ({ produtos: [...state.produtos] }));
  },
  removeProduto: (id: number) => set((state) => ({
    produtos: state.produtos.filter((produto) => produto.ProdID !== id),
  })),
  addComplemento: (complemento: Complemento) => {
    if (complemento.quantidade! > 0) {
      return set((state) => {
        const existingIndex = state.Complementos.findIndex((c) => c.produtoId === complemento.produtoId && c.ProdID === complemento.ProdID);
        const newComplementos = [...state.Complementos];
        
        if (complemento.quantidade! > 0) {
          if (existingIndex !== -1) {
            newComplementos[existingIndex] = complemento;
          } else {
            newComplementos.push(complemento);
          }
        }
  
        return { ...state, Complementos: newComplementos };
      });
    }
    return set((state) => ({ ...state }));
  },
  removeComplemento: (id: number) => {
    return set((state) => ({
      Complementos: state.Complementos.filter((complemento) => complemento.produtoId !== id),
    }));
  },
  resetComplementos: () =>{
    set((state) => ({
      Complementos: []
    }))
  },
  resetProdutos: () =>{
    set((state) => ({
      produtos: []
    }))
  }
}));

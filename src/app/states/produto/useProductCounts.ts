import { create } from 'zustand';

export type ProductCounts = {
  [prodId: number]: { 
    [complementoId: string]: {
      count: number;
      preco: number;
    };
  };
};

type StoreProps = {
  productCounts: ProductCounts;
  incrementCount: (prodId: number, complementoId: string, preco: number) => void;
  decrementCount: (prodId: number, complementoId: string, preco: number) => void;
  deleteCount: (prodId: number) => void
};

export const useProductCounts = create<StoreProps>((set) => ({
  productCounts: {},
  incrementCount: (prodId, complementoId, preco) => {
    set((state) => {
      const prodCounts = { ...state.productCounts };
      prodCounts[prodId] = prodCounts[prodId] || {};
      prodCounts[prodId][complementoId] = {
        count: (prodCounts[prodId][complementoId]?.count || 0) + 1,
        preco: preco,
      };

      return { productCounts: prodCounts };
    });
  },
  deleteCount: (prodId)=>{
    set((state) => {
      const prodCounts = { ...state.productCounts };
      prodCounts[prodId] = {};

      return { productCounts: prodCounts };
    });
  },
  
  decrementCount: (prodId, complementoId,  preco) => {
    set((state) => {
      const prodCounts = { ...state.productCounts };
      prodCounts[prodId] = prodCounts[prodId] || {};
      const currentCount = prodCounts[prodId][complementoId]?.count || 0;
      prodCounts[prodId][complementoId] = {
        count: Math.max(currentCount - 1, 0),
        preco: preco,
      };

      if (prodCounts[prodId][complementoId].count === 0) {
        delete prodCounts[prodId][complementoId];
      }

      return { productCounts: prodCounts };
    });
  }
}));

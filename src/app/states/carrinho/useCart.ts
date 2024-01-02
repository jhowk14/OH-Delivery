import axios from 'axios';
import { create } from 'zustand';
import { CarrinhoData } from '@/app/[link]/carrinho/page';
import { apiUrl } from '@/app/utils/apiUrl';
import { useCookies } from 'next-client-cookies';

type CarrinhoStoreProps = {
    carrinhos: CarrinhoData[];
    addCarrinho: (carrinhos: CarrinhoData[]) => void;
    atualizarCarrinho: (cookie: string) => Promise<void>;
};

export const useCarrinho = create<CarrinhoStoreProps>((set) => ({
    carrinhos: [],
    addCarrinho: (carrinhos) => set({ carrinhos }),
    atualizarCarrinho: async (cookie: string) => {
        try {
            const response = await axios.get(`${apiUrl}/carrinhos/${cookie}`,{
                headers:{
                    Authorization: `Bearer ${cookie}`
                }
              });
            // Atualizar o carrinho com os dados recebidos da API
            set({ carrinhos: response.data });
        } catch (error) {
            console.error('Erro ao atualizar carrinho:', error);
        }
    },
}));

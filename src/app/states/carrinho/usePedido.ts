import { create } from 'zustand';

type StringState = {
  FormPedido: {
    nome: string;
    endereco: string;
    numero: string;
    bairro: string;
    cep: string;
    uf: string;
    complemento: string;
    cidade: string;
    telefone: string;
    metodo: string;
    valorPago: string; // Novo campo para rastrear o valor pago em dinheiro
  };
  setFormPedido: (value: {
    nome: string;
    endereco: string;
    numero: string;
    cidade: string;
    complemento: string;
    uf: string;
    bairro: string;
    cep: string;
    telefone: string;
    metodo: string;
    valorPago: string; // Atualização no tipo da função setFormPedido
  }) => void;
};

export const usePedido = create<StringState>((set) => ({
  FormPedido: {
    bairro: '',
    cidade: '',
    cep: '',
    complemento: '',
    uf: '',
    endereco: '',
    nome: '',
    numero: '',
    telefone: '',
    metodo: '',
    valorPago: '', // Inicializa o valor pago como vazio
  },
  setFormPedido: (value) => set({ FormPedido: value }),
}));

export type Pedido = {
    empresa: string;
    dataHora: Date;
    totalPedido: number;
    taxaEntrega: number;
    formaPagamento: string;
    clienteNome: string;
    clienteCep: string;
    clienteTroco: number
    clienteEndereco: string;
    clienteNumero: string;
    clienteComplemento: string;
    clienteBairro: string;
    clienteCidade: string;
    clienteEstado: string;
    clienteTelefone: string;
    status: number;
    dataHoraImportacao: Date;
  };
  
  export type PedidoItem = {
    produto: string;
    quantidade: number;
    valorUnitario: number;
    valorProduto: number;
    observacoes: string;
    totalComplementos: number;
    valorTotal: number;
    prodID: number;
    agrupamento: number;
    quantidadeAgrupamento: number
  };
  
  
  export type PedidoItemComplemento = {
    produtoComplemento: string;
    quantidadeComplemento: number;
    prodID: number;
    valorUnitarioComplemento: number;
    valorTotalComplemento: number;
  };
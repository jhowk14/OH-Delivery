export type Pedido = {
  id: string
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
    empresaTelefone: string;
    clienteTelefone: string;
    status: number;
    dataHoraImportacao: Date;
    itens: PedidoItem[]
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
    grupoTipo: boolean
    nomeAgrupamento: string
    agrupamento: number;
    quantidadeAgrupamento: number
    complementos: PedidoItemComplemento[]
  };
  
  
  export type PedidoItemComplemento = {
    produtoComplemento: string;
    quantidadeComplemento: number;
    prodID: number;
    valorUnitarioComplemento: number;
    valorTotalComplemento: number;
  };
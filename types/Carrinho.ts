
export type Carrinho = {
  CarID: number
  CarDataHora: Date;
  CarValorTotal: number;
  CarEmpresa: number;
  CarTaxaEntrega: number;
  CarSesToken: string;
  CarQtd: number;
  CarDescricao: string
};

export type CarrinhoItens = {
  CarItensProdID: number;
  CarItensCarrrinhoID: number
  CarItensQuantidade: number;
  CarItensValorUnitario: number;
  CarItensValorProdutos: number;
  CarItensObservacoes: string;
  CarItensComplemento: number;
  CarItensValorTotalGeral: number;
  CarItensAgrupamento: string;
};

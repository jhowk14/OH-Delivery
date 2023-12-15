import { Grupo } from "./Grupos"

export type Produto = {
      ProdID: number
      ProdGrupo: number
      ProdEmpresa: number
      ProdCodigo: number
      ProdEspecificacoes: string
      ProdDescricao:string
      ProdValor:number
      ProdHoraInicial:string
      ProdHoraFinal:string
      ProdClassificacao:number
      quantidade:number
      observacoes: string
      ValoresTipo: ProdutoValoresTipo[]
      Grupo: Grupo
}

export type Complemento = {
      CompID: number;
      CompQuantidade: number;
      CompProdID: number;
      CompCarID: number;
      createdAt: Date;
      updatedAt: Date;
      Produto: Produto
  }

export type ProdutoSubmit = {
      ProdID: number
      ProdGrupo: number
      ProdEmpresa: number
      ProdCodigo: number
      ProdEspecificacoes: string
      ProdDescricao:string
      ProdValor:number
      ProdHoraInicial:string
      ProdHoraFinal:string
      ProdClassificacao:number
      quantidade:number
      observacoes: string
      produtoId?: number
      ValoresTipo: ProdutoValoresTipo[]
      Grupo: Grupo
}

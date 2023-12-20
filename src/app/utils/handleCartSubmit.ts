import axios from "axios";
import { Carrinho } from "../../../types/Carrinho";
import { ProdutoSubmit } from "../../../types/Produto";
import { useEmpresaStore } from "../states/empresa/useEmpresa";
import { apiUrl } from "./apiUrl";
import { CarrinhoData } from "../[link]/carrinho/page";

export default async function handleCartSubmit (produto: Partial<ProdutoSubmit>[], complemento: ProdutoSubmit[], token: string, descricao: string) {

    const produtos = produto.concat(complemento);
    // Calcular o valor total de cada produto e armazenar em um array
    const valoresTotaisProdutos = produtos.map(calcularValorTotalProduto);

    // Calcular o valor total geral somando os valores individuais
    const valorTotalGeral = valoresTotaisProdutos.reduce((total, valorProduto) => total + valorProduto, 0);
    const produtoMaiorValor = encontrarProdutoMaiorValor(produtos);

    var CarValorTotal

    if(useEmpresaStore.getState().empresa?.EmprDivisaoSabores){
        if(produtoMaiorValor.Grupo?.GrupoTipo){
            CarValorTotal = produtoMaiorValor.ProdValor
        }else{
            CarValorTotal = valorTotalGeral
        }
    }else{
        CarValorTotal = valorTotalGeral
    }

    const carrinho: Partial<Carrinho> = {
        CarDataHora: new Date(),
        CarEmpresa: useEmpresaStore.getState().empresa?.EmprCodigo!,
        CarSesToken: token,
        CarTaxaEntrega: 5,
        CarQtd:1,
        CarDescricao: descricao,
        CarValorTotal: CarValorTotal
    }
    try {
        const response = await axios.post(`${apiUrl}/carrinhos`, {
            carrinho: carrinho,
            produtos: produtos,
        });
        const responseData : CarrinhoData[] = response.data.carrinho
        if (response.status === 200) {
            return {carrinho: {...responseData}, OK: true}
        } else {
            return {OK: false}
        }
    } catch (error) {
        return {error: error, OK: false}
    }
}

function calcularValorTotalProduto(produto: Partial<ProdutoSubmit>) {
  const valorProduto = (produto.ProdValor!)*1;
  const quantidade = produto.quantidade!;
  return valorProduto * quantidade;
}

function encontrarProdutoMaiorValor(produtos: Partial<ProdutoSubmit>[]) {
    // Ordenar os produtos pelo valor em ordem decrescente
    const produtosOrdenados = produtos.sort((a, b) => (b!.ProdValor! - a!.ProdValor!));

    // Retornar o primeiro produto da lista ordenada (o de maior valor)
    return produtosOrdenados[0];
}
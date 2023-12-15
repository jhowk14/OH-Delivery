import axios from "axios";
import { Pedido, PedidoItem, PedidoItemComplemento } from "../../../types/pedidos";
import { CarrinhoData } from "../[link]/carrinho/page";
import { apiUrl, apiWhats } from "./apiUrl";

type FormPedido = {
    nome: string;
    endereco: string;
    numero: string;
    bairro: string;
    valorPago: string
    cep: string;
    uf: string;
    complemento: string;
    cidade: string;
    telefone: string;
    metodo: string;
};

type pedidoSubmit = {
  Pedido: Pedido
  PedidoItens: PedidoItem[]
  PedidoComplementos: PedidoItemComplemento[]
}
export const handlePedidoSubmit = async (carrinho: CarrinhoData[], cliente: FormPedido, total: number, empresa: string, taxa: number, cookie: string, message: string) => {
  const complementos: PedidoItemComplemento[] = [];
  const itens: PedidoItem[] = [];

  carrinho.forEach((itemCarrinho) => {
    itemCarrinho.CarrinhoItens.forEach((item)=>{

      const novoItemPedido: PedidoItem = {
        produto: item.Produto.ProdDescricao,
        quantidade: item.CarItensQuantidade*1,
        valorUnitario: item.CarItensValorUnitario,
        valorProduto: item.CarItensValorProdutos,
        observacoes: item.CarItensObservacoes,
        totalComplementos: item.CarItensComplemento,
        valorTotal: item.CarItensValorTotalGeral,
        agrupamento: itemCarrinho.CarID*1,
        prodID: item.Produto.ProdID,
        quantidadeAgrupamento: itemCarrinho.CarQtd*1
      };
  
      itens.push(novoItemPedido);
      item.Complemento.forEach(com => {
        const novoComplemento: PedidoItemComplemento = {
          produtoComplemento: com.Produto.ProdDescricao,
          quantidadeComplemento: com.CompQuantidade*1,
          prodID: item.Produto.ProdID,
          valorUnitarioComplemento: com.Produto.ProdValor,
          valorTotalComplemento: (com.Produto.ProdValor*1) * (com.CompQuantidade*1),
        };
    
        complementos.push(novoComplemento);
      })
    })
  });

  // Criando o objeto do pedido
  const pedido: pedidoSubmit = {
    Pedido: {
      clienteBairro: cliente.bairro,
      clienteCep: cliente.cep,
      clienteCidade: cliente.cidade,
      clienteComplemento: cliente.complemento,
      clienteEndereco: cliente.endereco,
      clienteEstado: cliente.uf,
      clienteTroco: parseFloat(cliente.valorPago.replace(/\./g, '').replace(',', '.')),
      clienteNome: cliente.nome,
      clienteNumero: cliente.numero,
      clienteTelefone: cliente.telefone,
      dataHora: new Date(),
      dataHoraImportacao: new Date(),
      empresa: empresa,
      formaPagamento: cliente.metodo,
      status: 0,
      taxaEntrega: taxa,
      totalPedido: total,
    },
    PedidoComplementos: complementos,
    PedidoItens: itens,
  };

  const response = await axios.post(`${apiUrl}/pedido`,{
    ...pedido
  }, {
    responseType: 'json', // ou 'json' dependendo do tipo de resposta esperado
  })
  if(response.status === 200) {
    await axios.delete(`${apiUrl}/carrinhos/${cookie}`)
  }

  await axios.post(`${apiWhats}/message`,{
    number: `55${cliente.telefone.replace(/[^0-9]/g, '').trim()}`,
    message: message
  })

  await axios.post(`${apiWhats}/message`,{
    number: `55${cliente.telefone.replace(/[^0-9]/g, '').trim()}`,
    message: `Clique no link para confirmar o Pedido http://${window.location.href.split('/')[2]}/${window.location.href.split('/')[3]}/checkout/${response.data.pedido.id}`
  })

  return{data: response.data, conteudo: {...pedido}};
};

import { CarrinhoData } from "@/app/[link]/carrinho/page";
import formatarReal from "./fomatToReal";
import { usePedido } from "../states/carrinho/usePedido";
import { Pedido } from "../../../types/pedidos";

export const buildWhatsAppMessage = (carrinhos: CarrinhoData[], total: number, taxa: number, troco: string = '') => {
  const formPedidoState = usePedido.getState().FormPedido;

  const carrinhosGrupoTipo = carrinhos.filter(carrinho =>
    carrinho.CarrinhoItens.some(item =>
      // @ts-ignore
      item.Produto.Grupo.GrupoTipo.length > 0
    )
  );

  const carrinhosNormal = carrinhos.filter(carrinho =>
    carrinho.CarrinhoItens.some(item =>
      // @ts-ignore
      item.Produto.Grupo.GrupoTipo.length <= 0
    )
  );

  const messageParts: string[] = [
    `Olá! Esse Pedido é Seu?\n\n`,
    `Nome: ${formPedidoState.nome}\n`,
    `Telefone: ${formPedidoState.telefone}\n`,
    `Endereço: ${formPedidoState.endereco} ${formPedidoState.numero} ${formPedidoState.bairro} ${formPedidoState.cep} \n`,
    `Metodo de Pagamento: ${formPedidoState.metodo} ${troco ? `R$ ${troco}` : ''}\n`,
  ];

  carrinhosGrupoTipo.map((carrinho) => {
    const qtdProdutos = carrinho.CarrinhoItens.filter(it => it.Produto.ProdClassificacao == 0);
    messageParts.push(`\n*x${carrinho.CarQtd}* ${carrinho.CarDescricao} *${formatarReal(carrinho.CarValorTotal * carrinho.CarQtd)}*\n`);

    carrinho.CarrinhoItens.map((item) => {
      if (item.Produto.ProdClassificacao == 0) {
        messageParts.push(` *${item.CarItensQuantidade}/${qtdProdutos.length}* ${item.Produto.ProdDescricao} \n`);

        if (item.Complemento && item.Complemento.length > 0) {
          item.Complemento.map((complemento) => {
            messageParts.push(`    *${complemento.CompQuantidade}* ${complemento.Produto.ProdDescricao} ${formatarReal(complemento.Produto.ProdValor)}\n`);
          });
        }

        messageParts.push(`${item.CarItensObservacoes && `  Obs: ${item.CarItensObservacoes}\n`}`);
      }
    });
  });

  carrinhosNormal.map((carrinho) => {
    carrinho.CarrinhoItens.map((item) => {
      if (item.Produto.ProdClassificacao == 0) {
        messageParts.push(`\n *x${item.CarItensQuantidade}* ${item.Produto.ProdDescricao} *${formatarReal(item.CarItensValorUnitario)}*\n`);

        if (item.Complemento && item.Complemento.length > 0) {
          item.Complemento.map((complemento) => {
            messageParts.push(`    *${complemento.CompQuantidade}* ${complemento.Produto.ProdDescricao} ${formatarReal(complemento.Produto.ProdValor)}\n`);
          });
        }

        messageParts.push(`${item.CarItensObservacoes && `    *Obs: ${item.CarItensObservacoes}*\n`}`);
      }
    });
  });

  messageParts.push(`\nTaxa de entrega: ${formatarReal(taxa)}\n`);

  if (troco !== '') {
    messageParts.push(`Troco: ${formatarReal((parseFloat(troco.replace(".", "").replace(",", ".")) - (total + taxa)))}\n`);
  }

  messageParts.push(`*Total: ${formatarReal((total * 1) + (taxa * 1))}*`);

  const message = messageParts.join('');

  return { message, total, taxa };
};

export const calcularTotalETaxa = (carrinhos: CarrinhoData[]) => {
  let total = 0;
  let taxa = 0;

  carrinhos.map((carrinho) => {
    total += carrinho.CarQtd ? carrinho.CarValorTotal * carrinho.CarQtd : carrinho.CarValorTotal;
    taxa = carrinho.CarTaxaEntrega * 1;
  });

  return { total, taxa };
};

export const buildWhatsAppMessagePedido = (pedido: Pedido) => {
  const messageParts: string[] = [
    `*👋 Olá! Vim de ${window.location.href}*\n\n`,
    `Nome: ${pedido.clienteNome}\n`,
    `Telefone: ${pedido.clienteTelefone}\n`,
    `Endereço: ${pedido.clienteEndereco} ${pedido.clienteNumero} ${pedido.clienteBairro} ${pedido.clienteCep}\n`,
    `Método de Pagamento: ${pedido.formaPagamento} ${pedido.clienteTroco ? `${formatarReal(pedido.clienteTroco)}` : ''}\n`,
  ];

  const pedidoAgrupamento = pedido.itens && pedido.itens.filter(item => item.grupoTipo);

  const pedidoSemAgrupamento = pedido.itens && pedido.itens.filter(item => !item.grupoTipo);
  let grupo = 0
  pedidoAgrupamento && pedidoAgrupamento.map((pedido) => {
    if(grupo != pedido.agrupamento){
      messageParts.push(`\n*x${pedido.quantidadeAgrupamento}* ${pedido.nomeAgrupamento} *${formatarReal(pedido.valorUnitario * pedido.quantidadeAgrupamento)}*\n`);
    }
        messageParts.push(` ${pedido.produto} \n`);
        if (pedido.complementos && pedido.complementos.length > 0) {
          pedido.complementos.map((complemento) => {
            messageParts.push(`    *${complemento.quantidadeComplemento}* ${complemento.produtoComplemento} ${formatarReal(complemento.valorUnitarioComplemento)}\n`);
          });
        }

        messageParts.push(`${pedido.observacoes && `    *Obs: ${pedido.observacoes}*\n`}`);
        grupo = pedido.agrupamento
    });

    pedidoSemAgrupamento && pedidoSemAgrupamento.map((pedido) => {
        messageParts.push(`\n *x${pedido.quantidade}* ${pedido.produto} *${formatarReal(pedido.valorUnitario)}*\n`);

        if (pedido.complementos && pedido.complementos.length > 0) {
          pedido.complementos.map((complemento) => {
            messageParts.push(`    *${complemento.quantidadeComplemento}* ${complemento.produtoComplemento} ${formatarReal(complemento.valorUnitarioComplemento)}\n`);
          });
        }

        messageParts.push(`${pedido.observacoes && `    *Obs: ${pedido.observacoes}*\n`}`);
    });


  if (pedido.taxaEntrega > 0) {
    messageParts.push(`\nTaxa de entrega: ${formatarReal(pedido.taxaEntrega)}\n`);
  }

  messageParts.push(`Total: ${formatarReal(pedido.totalPedido)}`);

  const message = messageParts.join('');

  return message;
};

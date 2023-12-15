'use client'
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { CarrinhoData } from "../[link]/carrinho/page";
// @ts-ignore
import { MotionAnimate } from 'react-motion-animate'
import axios from "axios";
import { apiUrl } from "../utils/apiUrl";
import { useCookies } from "next-client-cookies";
import { useCarrinho } from "../states/carrinho/useCart";
import formatarReal from "../utils/fomatToReal";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Dialog, DialogContent } from "@mui/material";

export default function ProdutoGrupoTipo({ carrinhoData }: { carrinhoData: CarrinhoData }) {
  const cookies = useCookies()
  const { addCarrinho: setCarrinhoData} = useCarrinho()
  const [quantidade, setQuantidade] = useState(carrinhoData.CarQtd);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const confirmExcluirPedido = async () => {
    handleClose(); // Close the confirmation dialog
    try {
      await axios.delete(`${apiUrl}/carrinhoID/${carrinhoData.CarID}`);
      const response = await axios.get(`${apiUrl}/carrinhos/${cookies.get('token')}`);
      setCarrinhoData(response.data);
    } catch (error) {
      console.error("Erro ao excluir pedido:", error);
    }
  };

  const incrementQuantidade = async () => {
    const novaQuantidade = quantidade + 1;
    setQuantidade(novaQuantidade);
    await atualizarQuantidade(novaQuantidade);
};

const decrementQuantidade = async () => {
    if (quantidade > 1) {
        const novaQuantidade = quantidade - 1;
        setQuantidade(novaQuantidade);
        await atualizarQuantidade(novaQuantidade);
    }
};

  const atualizarQuantidade = async (novaQuantidade: number) => {
    await axios.put(`${apiUrl}/UpdateCarrinho`, {
        qtd:novaQuantidade,
        carrinho: {
            CarID: carrinhoData.CarID
        },
    });
    const response = await axios.get(`${apiUrl}/carrinhos/${cookies.get('token')}`);
    setCarrinhoData(response.data);
};


const qtdProdutos = carrinhoData.CarrinhoItens.filter(it => it.Produto.ProdClassificacao == 0)

  return (
<MotionAnimate>
  <div className="flex justify-between items-center">
    <div className="bg-gray-200 shadow-sm shadow-gray-400 w-full">
      <div className=" flex items-center">
        <div className="p-3 flex justify-between items-center w-full" >
          <div className="flex items-center">
            <span >{carrinhoData.CarDescricao}</span>
          </div>
          <div className="flex items-center space-x-2">
          <button
              onClick={decrementQuantidade}
              className="text-red-600 focus:outline-none transition-transform transform hover:scale-105"
            >
              <AiOutlineMinus size={20} />
            </button>
            <p className="text-sm select-none">{quantidade}</p>
            <button
              onClick={incrementQuantidade}
              className="text-green-600 focus:outline-none transition-transform transform hover:scale-125"
            >
              <AiOutlinePlus size={20} />
            </button>
            <button
                onClick={handleClickOpen}
                className="text-gray-400 focus:outline-none transition-transform transform hover:scale-105"
              >
                <FaTrash size={18} />
              </button>
          </div>
        </div>
      </div>
          <MotionAnimate>    
            <div className="bg-gray-300 rounded mx-2 p-2">
                <div className="">
                    {carrinhoData.CarrinhoItens.map(it => it.Produto.ProdClassificacao == 0 && (
                      <div key={it.CarItensID}>
                        <p className="text-xs m-1 font-medium" >
                          {carrinhoData.CarrinhoItens.length > 1 && `${it.CarItensQuantidade}/${qtdProdutos.length}`}  {it.Produto.ProdDescricao} {formatarReal(it.CarItensValorUnitario*it.CarItensQuantidade)}
                        </p>
                        {it.Complemento &&
                        it.Complemento.map((com) => (
                          <p key={com.Produto.ProdID} className="pl-4 text-xs">
                            <span>x{com.CompQuantidade}</span>{' '}
                            {com.Produto.ProdDescricao} {formatarReal(com.Produto.ProdValor)}
                          </p>
                        ))}
                      {it.CarItensObservacoes && (
                        <p className="pl-4 text-xs">{`Obs: ${it.CarItensObservacoes}`}</p>
                      )}
                      </div>
                    ))}
                </div>
            </div>
          </MotionAnimate>
        <div className="text-xs text-right mx-5 my-1 font-semibold">{formatarReal(carrinhoData.CarValorTotal*quantidade)}</div>
    </div>
    <Dialog open={open} onClose={handleClose}>
  <DialogContent className="bg-white rounded-lg p-2">
    <span className="font-semibold text-center block mb-2">
      Excluir Item?
    </span>
    <div className="flex justify-center gap-2">
      <button
        onClick={handleClose}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-lg focus:outline-none"
      >
        Cancelar
      </button>
      <button
        onClick={confirmExcluirPedido}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg focus:outline-none"
      >
        Confirmar
      </button>
    </div>
  </DialogContent>
</Dialog>
  </div>
</MotionAnimate>
  );
}

import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { CarrinhoItensData } from "../[link]/carrinho/page";
import axios from "axios";
// @ts-ignore
import { MotionAnimate } from 'react-motion-animate'
import { apiUrl } from "../utils/apiUrl";
import { useCookies } from "next-client-cookies";
import { useCarrinho } from "../states/carrinho/useCart";
import formatarReal from "../utils/fomatToReal";
import { memo, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";

const ProdutoNoGrupo = memo(function ProdutoNoGrupo({ carrinhoData, total }: { carrinhoData: CarrinhoItensData, total: number }) {
    const cookies = useCookies()
    const { addCarrinho: setCarrinhoData } = useCarrinho()
    const [qtd, setQtd] = useState(carrinhoData.CarItensQuantidade * 1)
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const incrementQuantidade = async () => {
        const novaQuantidade = qtd + 1;
        setQtd(novaQuantidade);
        await atualizarQuantidade(novaQuantidade);
    };

    const decrementQuantidade = async () => {
        if (qtd > 1) {
            const novaQuantidade = qtd - 1;
            setQtd(novaQuantidade);
            await atualizarQuantidade(novaQuantidade);
        }
    };

    const atualizarQuantidade = async (novaQuantidade: number) => {
        const newTotal = carrinhoData.CarItensValorProdutos * novaQuantidade;
        const oldValue = total * 1 - carrinhoData.CarItensValorTotalGeral * 1;
        await axios.put(`${apiUrl}/UpdateCarrinho`, {
            carrinhoItens: {
                CarItensID: carrinhoData.CarItensID,
                CarItensQuantidade: novaQuantidade,
                CarItensValorTotalGeral: newTotal,
            },
            carrinho: {
                CarID: carrinhoData.CarItensCarrrinhoID,
                CarValorTotal: oldValue + newTotal,
            },
        });
        const response = await axios.get(`${apiUrl}/carrinhos/${cookies.get('token')}`);
        setCarrinhoData(response.data);
    };

    const excluirItem = async () => {
        handleClose()
        try {
            await axios.delete(`${apiUrl}/carrinhoItens/${carrinhoData.CarItensID}`);
            await axios.put(`${apiUrl}/carrinhos/${carrinhoData.CarItensCarrrinhoID}`, {
                CarValorTotal: total * 1 - carrinhoData.CarItensValorTotalGeral * 1
            })
            const response = await axios.get(`${apiUrl}/carrinhos/${cookies.get('token')}`);
            setCarrinhoData(response.data);
        } catch (error) {
            console.error("Erro ao excluir pedido:", error);
        }
    }

    return (
        <MotionAnimate>
            <div className="flex justify-between items-center">
                <div className="bg-gray-200 shadow-sm shadow-gray-400 w-full">
                    <div className=" flex items-center">
                        <div className="p-3 flex justify-between items-center w-full">
                            <div>
                                <span>{carrinhoData.Produto.ProdDescricao}  </span>
                                <span className="text-xs font-semibold">{formatarReal(carrinhoData.CarItensValorUnitario)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={decrementQuantidade}
                                    className="text-red-600 focus:outline-none transition-transform transform hover:scale-125"
                                >
                                    <AiOutlineMinus size={20} />
                                </button>
                                <p className="text-sm select-none">{qtd}</p>
                                <button
                                    onClick={incrementQuantidade}
                                    className="text-green-600 focus:outline-none transition-transform transform hover:scale-125"
                                >
                                    <AiOutlinePlus size={20} />
                                </button>
                                <button
                                    onClick={handleClickOpen}
                                    className="text-gray-400 focus:outline-none transition-transform transform hover:scale-125"
                                >
                                    <FaTrash size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-300 rounded mx-2">
                    {carrinhoData.Complemento &&
                        carrinhoData.Complemento.map((com) => (
                            <div key={com.Produto.ProdID} className="py-1">
                                <p className="pl-4 text-xs">
                                    <span className="font-bold">{com.CompQuantidade}x</span>{' '}
                                    {com.Produto.ProdDescricao} {formatarReal(com.Produto.ProdValor)}
                                </p>
                            </div>
                        ))}
                    {carrinhoData.CarItensObservacoes && (
                        <p className="pl-4 text-xs py-1">{`Obs: ${carrinhoData.CarItensObservacoes}`}</p>
                    )}
                    </div>
                    <div className="text-xs text-right mx-5 my-1 font-semibold">
                        {formatarReal(carrinhoData.CarItensValorTotalGeral)}
                    </div>
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
                                onClick={excluirItem}
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
})

export default ProdutoNoGrupo
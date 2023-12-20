'use client'
import axios from "axios";
import { useEffect } from "react";
import { apiUrl } from "@/app/utils/apiUrl";
import { useCookies } from "next-client-cookies";
import { Carrinho, CarrinhoItens } from "../../../../types/Carrinho";
import formatarReal from "@/app/utils/fomatToReal";
import { Complemento, Produto } from "../../../../types/Produto";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { useGrupoTipo } from "@/app/states/grupo/useGrupoTipo";
import ModalFinalizarPedido from "@/app/components/FinalizarPedido/ModalFinalizarPedido";
import { useCarrinho } from "@/app/states/carrinho/useCart";
import { useEmpresaStore } from "@/app/states/empresa/useEmpresa";
// @ts-ignore
import { MotionAnimate } from 'react-motion-animate'
import ProdutoGrupoTipo from "@/app/components/CarrinhoProdTipo";
import ProdutoNoGrupo from "@/app/components/CarrinhoProduto";
import { useProductCounts } from "@/app/states/produto/useProductCounts";

export interface CarrinhoItensData extends CarrinhoItens {
  CarItensID: number;
  Produto: Produto;
  Complemento: Complemento[]
}

export interface CarrinhoData extends Carrinho {
  CarID: number;
  CarQtd: number
  CarrinhoItens: CarrinhoItensData[];
}

interface CarrinhoProps {
  params: {
    link: string;
  };
}
function Carrinhos({ params }: CarrinhoProps) {
  const router = useRouter()
  const {carrinhos: carrinhoData, addCarrinho: setCarrinhoData} = useCarrinho()

  const cookies = useCookies();
  useEffect(() => {
    const fetchCarrinho = async () => {
      try {
            const response = await axios.get(`${apiUrl}/carrinhos/${cookies.get('token')}`);
            setCarrinhoData(response.data);
      } catch (error) {
            console.error("Erro ao buscar carrinhos:", error);
      }
    };
    fetchCarrinho();
  }, [cookies, setCarrinhoData]);

useEffect(()=>{
  useEmpresaStore.getState().getEmpresa(params.link)
},[params])
 
var total = 0
var taxaEntrega = 0

carrinhoData.forEach((a)=>{
  taxaEntrega = a.CarTaxaEntrega * 1
  total = a.CarQtd ? total + (a.CarValorTotal * 1)*a.CarQtd : total + (a.CarValorTotal * 1)
})

const carrinhosGrupoTipo = carrinhoData.filter(carrinho =>
  carrinho.CarrinhoItens.some(item =>
      item.Produto.Grupo.GrupoTipo!.length > 0
  )
);

const carrinhosNormal = carrinhoData.filter(carrinho =>
  carrinho.CarrinhoItens.some(item =>
      item.Produto.Grupo.GrupoTipo!.length <= 0
  )
);

useEffect(() => {
  carrinhoData.forEach(async (c) => {
    // Check if CarrinhoItens array is empty or if there are no items with ProdClassificacao == 0
    if (c.CarrinhoItens.length <= 0 || !c.CarrinhoItens.some(item => item.Produto.ProdClassificacao === 0)) {
      try {
        // Delete the cart
        await axios.delete(`${apiUrl}/carrinhoID/${c.CarID}`);
        // Fetch updated cart data
        const response = await axios.get(`${apiUrl}/carrinhos/${cookies.get('token')}`);
        setCarrinhoData(response.data);
      } catch (error) {
        console.error("Erro ao excluir pedido:", error);
      }
    }
  });
}, [carrinhoData, setCarrinhoData, cookies]);

return(
  <MotionAnimate>
  <div className="flex-1 mt-3 lg:mx-20">
  <button 
    onClick={() => {
        router.push(`/${params.link}/pedidos`)
        useGrupoTipo.getState().actions.addEmpresa(null)
        useProductCounts.setState({productCounts: {}})
    }} 
    className="p-3 text-sm flex items-center gap-1 bg-gray-300 mx-6 font-bold rounded-full focus:outline-none transition-transform transform hover:scale-105">
      <BiArrowBack /> Adicionar mais
  </button>
  </div>
  <div className="container mx-auto p-6">
      <h3 className="font-bold text-sm flex gap-2 bg-gray-800 px-3 py-1 mt-1 w-full justify-center rounded-xl text-gray-100 items-center mb-2">Carrinho</h3>
      {/* Cart Items */}
      <div className="grid grid-cols-1 mt-4">
            {/* Carrinhos com GrupoTipo */}
            {carrinhosGrupoTipo.map((carrinho) => (
                <div key={carrinho.CarID} className="m-1">
                        <ProdutoGrupoTipo carrinhoData={carrinho} />
                </div>
            ))}

            {/* Carrinhos sem GrupoTipo */}
            {carrinhosNormal.map((carrinho) => 
                carrinho.CarrinhoItens.map((item) => item.Produto.ProdClassificacao == 0 && (
                        <div  className="m-1" key={item.CarItensID}>
                        <ProdutoNoGrupo carrinhoData={item} total={carrinho.CarValorTotal} />
                        </div>
                )
            ))}
        </div>
        {/* Total and Confirm Button */}
        <div className="bg-gray-200 p-4 text-xs mt-4">
          <div className="text-left">
            <p>Total dos produtos: {formatarReal(total)}</p>
            <p className="">Taxa de entrega: {formatarReal(taxaEntrega)}</p>
            <p className="font-semibold">Total a pagar: {formatarReal(total + taxaEntrega)}</p>
          </div>
        </div>
      </div>
      {
        total > 0 && (
            <ModalFinalizarPedido />
        )
      }
  </MotionAnimate>
  )
}

export default Carrinhos;
import { AiOutlineClose, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import formatarReal from "../utils/fomatToReal";
import { Produto } from "../../../types/Produto";
import { useProductCounts } from "../states/produto/useProductCounts";
import { apiUrl } from "../utils/apiUrl";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { GrupoTipo } from "../../../types/GrupoTipo";
// @ts-ignore
import { MotionAnimate } from 'react-motion-animate'
import { useProduto } from "../states/produto/useProdutos";
import { useEffect } from "react";

const ModalComplementos = ({ 
  onClose,
  grupoId,
  GrupoTipo,
  prodId
}: { 
  onClose: () => void,
  grupoId: string, 
  prodId: number,
  GrupoTipo: GrupoTipo | null,
}) => {

const { data: complementoData, isLoading: isProdutoDataLoading } = useQuery<Produto[]>({
  queryKey: [`Complementos ${grupoId}`],
  queryFn: async () => {
    const response = await axios.get(`${apiUrl}/complementos/${grupoId}`);
    return response.data;
  }
});

const { productCounts, incrementCount, decrementCount } = useProductCounts();

useEffect(() => {
  // This code will execute when productCounts or useProduto state changes
  const productCount = productCounts[prodId];

  const addProducts = (prod: Partial<Produto>, quantidade: number) => {
    useProduto.getState().removeComplemento(prod.ProdID!);
    // @ts-ignore
    useProduto.getState().addComplemento({ ...prod, quantidade: quantidade, produtoId: prodId });
  }

  if (productCount) {
    const produtosToAdd = Object.entries(productCount).map(([prodID, count]) => ({
      ...complementoData?.find(prod => prod.ProdID === parseInt(prodID, 10)),
      quantidade: count.count,
      ProdValor: count.preco
    }));

    // Adicionar produtos
    produtosToAdd.map(p => addProducts(p, p.quantidade));
  } else {
    // Se não houver contagens, remover o produto
    useProduto.getState().removeComplemento(prodId);
  }
}, [productCounts, prodId, complementoData]);


return (

<MotionAnimate>
<div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-70">
    <div className="bg-gray-100 p-4 rounded-lg w-96 mx-1">
    <button onClick={() => {
            onClose();
      }} className="p-3 bg-gray-300 mb-1 font-bold rounded-full  transition-transform transform focus:outline-none hover:scale-125">
        <AiOutlineClose />
      </button>
      <h3 className="font-bold text-sm flex gap-2 bg-gray-800 px-3 py-1 mt-1 w-full justify-center rounded-xl text-gray-100 items-center">Complementos</h3>
      <div className="mt-5 overflow-y-auto max-h-96">
        {complementoData?.map((prod: Produto) => (
          <div key={prod.ProdID} className="text-lg text-gray-800 rounded-lg items-center bg-gray-100 px-3 lg:mb-3 mb-4">
            <div className="flex justify-between mb-1 items-center">
              <div>
                <p className="text-sm">{prod.ProdDescricao}</p>
                <p className="text-sm font-semibold">{formatarReal(prod.ValoresTipo.find(p => p.PrVtGrTpID === GrupoTipo?.GrTpID)?.PrVtValor || prod.ProdValor)}</p>
              </div>
              <div className='flex right-0 items-center text-center'>
                <button 
                onClick={() => {
                  decrementCount(prodId, String(prod.ProdID), prod.ValoresTipo.find(p => p.PrVtGrTpID === GrupoTipo?.GrTpID)?.PrVtValor || prod.ProdValor);
                }}
                className={`text-red-600 focus:outline-none transition-transform transform hover:scale-105`}>
                  <AiOutlineMinus
                    size={20}
                  />
                </button>
                <p className="text-sm px-1 select-none">{productCounts[prodId]?.[prod.ProdID]?.count || 0} {/* Use prodId */}
                </p>
                <button 
                onClick={() => {
                  incrementCount(prodId, String(prod.ProdID), prod.ValoresTipo.find(p => p.PrVtGrTpID === GrupoTipo?.GrTpID)?.PrVtValor || prod.ProdValor);
                }}
                className={`text-green-600 focus:outline-none transition-transform transform hover:scale-125`}>
                  <AiOutlinePlus
                    size={20}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-around mt-2">
        <button
            onClick={()=>{
              onClose()
            }}
          className="bg-green-600 text-sm w-full text-white font-bold py-2 px-4 rounded focus:outline-none transition-transform transform hover:scale-105"
        >
          
          Salvar
        </button>
      </div>
    </div>
  </div>
</MotionAnimate>
);
}
export default ModalComplementos
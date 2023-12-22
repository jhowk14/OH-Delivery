'use client'
import { PiBasketBold } from "react-icons/pi";
import { BiAddToQueue, BiArrowBack, BiCommentAdd, BiCommentCheck } from 'react-icons/bi';
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"
import { useRouter } from "next/navigation";
import { Produto } from "../../../../../types/Produto";
import { useGrupoTipo } from "@/app/states/grupo/useGrupoTipo";
import { useEffect, useState } from "react";
import { useGrupo } from "@/app/states/grupo/useGrupo";
import { useProduto } from "@/app/states/produto/useProdutos";
import ModalObs from "@/app/components/ModalObs";
import ModalComplementos from "@/app/components/ModalComplementos";
import formatarReal from "@/app/utils/fomatToReal";
import { useProductCounts } from "@/app/states/produto/useProductCounts";
import { useObservacoes } from "@/app/states/produto/useObs";
import handleCartSubmit from "@/app/utils/handleCartSubmit";
import { useCookies } from "next-client-cookies";
// @ts-ignore
import { MotionAnimate } from 'react-motion-animate'
import { useEmpresaStore } from "@/app/states/empresa/useEmpresa";
import { getFractionString } from "@/app/utils/getFraction";
import { useGrupoStore } from "@/app/states/grupo/GruposProd";

export default function Grupo({ params }: { params: { grupo: string, link: string }}) {
  const { grupos: grupoState, produtos: produtoState, getGrupo, getProdutos } = useGrupoStore.getState()
  const [grupoData, setGrupoData] = useState(grupoState[params.grupo])
  const [produtoData, setProdutoData] = useState(produtoState[params.grupo])

  useEffect(() => {
    const fetchData = async () => {
      if (!grupoState || !grupoState[params.grupo]) {
        const grupo = await getGrupo(params.grupo)
        setGrupoData(grupo)
      }

      if (!produtoState || !produtoState[params.grupo]) {
        const produtos = await getProdutos(params.grupo);
        setProdutoData(produtos)
      }
    };

    fetchData();
  }, [params.grupo, grupoState, produtoState, getGrupo, getProdutos]);

  const cookies = useCookies();
  const [productCounts, setProductCounts] = useState<{ [productId: string]: number }>({});
  const GrupoTipo = useGrupoTipo.getState().state.grupo;
  const [modalObs , setModalObs] = useState(false)
  const [modalComplementos , setModalComplementos] = useState(false)
  const [addCart , setAddCart] = useState(false)
  const observacoes = useObservacoes.getState().observacoes
  const router = useRouter();

  const totalCount = Object.values(productCounts).reduce((total, count) => total + count, 0);

  const [selectedProdId, setSelectedProdId] = useState<number | null>();

  useEffect(() => {
    const getValor = (prod: Produto, div: number) => {
      let valor;
      if (GrupoTipo?.GrTpDivisao) {
        if (useEmpresaStore.getState().empresa?.EmprDivisaoSabores) {
          valor = (prod.ValoresTipo.find(p => p.PrVtGrTpID === GrupoTipo?.GrTpID)?.PrVtValor || prod.ProdValor);
        } else {
          valor = (prod.ValoresTipo.find(p => p.PrVtGrTpID === GrupoTipo?.GrTpID)?.PrVtValor || prod.ProdValor) / div;
        }
      } else {
        valor = (prod.ValoresTipo.find(p => p.PrVtGrTpID === GrupoTipo?.GrTpID)?.PrVtValor || prod.ProdValor);
      }
    
      return isFinite(valor) ? valor * 1 : 0; // Verificar se o valor é finito antes de retornar
    };
    // Iterate through each product ID in productCounts
    for (const productId in productCounts) {
      const prod = produtoData?.find((p) => p.ProdID === parseInt(productId));
  
      // Check if the product exists and has GrupoTipo
      if (prod && GrupoTipo) {
        const currentCount = productCounts[productId] || 0;
  
        // Update the quantity and value of the product
        useProduto.getState().removeProduto(parseInt(productId));
        useProduto.getState().addProduto({
          ...prod,
          quantidade: currentCount,
          ProdValor: getValor(prod, totalCount),
          observacoes: observacoes.find((o) => o.prodId === prod.ProdID)?.obs,
          Grupo: { ...prod.Grupo, GrupoTipo: GrupoTipo ? [GrupoTipo] : undefined },
        });
      }
    }
  }, [productCounts, totalCount, GrupoTipo, produtoData, observacoes]);

  const handleIncrement = (productId: string) => {
    const prod = produtoData?.find((prod) => prod.ProdID === parseInt(productId));
    if (GrupoTipo?.GrTpDivisao) {
      const division = GrupoTipo.GrTpDivisao;
      const currentCount = productCounts[productId] || 0;
      if (totalCount < division && currentCount < division) {
        setProductCounts((prevCounts) => ({
          ...prevCounts,
          [productId]: currentCount + 1,
        }));
        useProduto.getState().removeProduto(parseInt(productId))
        useProduto.getState().addProduto({...prod , quantidade: currentCount + 1, observacoes: observacoes.find(o => o.prodId == prod!.ProdID)?.obs, Grupo: {...prod!.Grupo, GrupoTipo: GrupoTipo ? [GrupoTipo!] : undefined}})
      }
    } else {
      const currentCount = productCounts[productId] || 0;
      setProductCounts((prevCounts) => ({
        ...prevCounts,
        [productId]: currentCount + 1,
      }));
      useProduto.getState().removeProduto(parseInt(productId))
      useProduto.getState().addProduto({...prod , quantidade: currentCount + 1, observacoes: observacoes.find(o => o.prodId == prod!.ProdID)?.obs, Grupo: {...prod!.Grupo, GrupoTipo: GrupoTipo ? [GrupoTipo!] : undefined}})
    }
  };
  
  const handleDecrement = (productId: string) => {
    setProductCounts((prevCounts: any) => ({
      ...prevCounts,
      [productId]: Math.max((prevCounts[productId] || 0) - 1, 0),
    }));
    useProduto.getState().removeProduto(parseInt(productId))
  };

  useEffect(()=>{
    if(!GrupoTipo && !useGrupo.getState().semDivisao){
      router.push(`/${params.link}/pedidos`);
      useProduto.setState({produtos: []})
      useProductCounts.setState({productCounts: {}})
      useObservacoes.setState({observacoes: []})
    }
  },[GrupoTipo, router, params])

var produtos = produtoData

if(GrupoTipo){
  produtos = produtoData?.filter(p => p.ValoresTipo.find(p => p.PrVtGrTpID === GrupoTipo?.GrTpID))
}

return (
    <>
    <MotionAnimate>
    <div className="flex-1 mt-3 lg:mx-20">
      <button onClick={() => {
        router.back();
        useProductCounts.setState({productCounts: {}})
        useGrupoTipo.getState().actions.addEmpresa(null);
      }} className="p-3 bg-gray-300 mx-6 font-bold rounded-full focus:outline-none transition-transform transform hover:scale-125">
        <BiArrowBack />
      </button>
      <div className="lg:rounded-lg p-5 flex justify-center items-center flex-col">
        <h3 className="font-bold text-sm flex gap-2 bg-gray-800 px-3 py-1 mt-1 w-full justify-center rounded-xl text-gray-100 items-center">
          {grupoData?.GrupDescricao} {GrupoTipo?.GrTpDescricao} {GrupoTipo?.GrTpDivisao && `até ${GrupoTipo?.GrTpDivisao} sabores`} <PiBasketBold />
        </h3>
        <div className="mt-3 w-full lg:mx-30">
        {produtos?.map((prod: Produto) => (
            <div key={prod.ProdID} className="text-lg text-gray-800 rounded-lg items-center bg-gray-100 px-3 lg:mb-3 mb-4">
              <div className="flex justify-between mb-1">
                <p className="">{prod.ProdDescricao}</p>
                <p className="text-sm px-5">{formatarReal((prod.ValoresTipo.find(p => p.PrVtGrTpID === GrupoTipo?.GrTpID)?.PrVtValor || prod.ProdValor))}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs mr-1">{prod.ProdEspecificacoes}</p>
                <div className='flex right-0 items-center text-center mx-1'>
                  <button 
                  onClick={() => {
                    handleDecrement(String(prod.ProdID));
                  }}
                  className={`text-red-600 focus:outline-none transition-transform transform hover:scale-125 ${totalCount == 0 ? "text-red-900": ""}`}>
                    <AiOutlineMinus
                      size={20}
                    />
                  </button>
                  <p className="px-1 select-none">{getFractionString(productCounts[prod.ProdID] || 0, GrupoTipo?.GrTpDivisao || 0 , prod.ProdID,(id)=>delete productCounts[id], totalCount)}</p>
                  <button 
                  onClick={() => {
                    if(GrupoTipo?.GrTpDivisao){
                      if(productCounts[prod.ProdID] && Object.keys(productCounts).length == 1){
                        return
                      }else{
                        handleIncrement(String(prod.ProdID));
                      }
                    }else{
                      handleIncrement(String(prod.ProdID));
                    }
                  }}
                  className={`text-green-600 focus:outline-none transition-transform transform hover:scale-125 ${totalCount === GrupoTipo?.GrTpDivisao ? "text-green-950" : ""}`}>
                    <AiOutlinePlus
                      size={25}
                    />
                  </button>
                </div>
              </div>
              {productCounts[prod.ProdID] > 0 && (<>
                <MotionAnimate>
                <div className="flex justify-around mt-3 gap-1 py-2 m-1 bg-gray-300 rounded">
                  <button 
                  className="bg-gray-300 text-xs rounded shadow-md shadow-gray-400 text-gray-900 p-2 focus:outline-none transition-transform transform hover:scale-105 flex items-center gap-1"
                  onClick={()=>{
                    setSelectedProdId(prod.ProdID)
                    setModalComplementos(true)}
                  }
                  >
                  Complementos 
                  <span className={` flex gap-1 font-bold`}>
                    <BiAddToQueue size={17}/>
                    <span>
                      {useProductCounts.getState().productCounts[prod.ProdID] && Object.keys(useProductCounts.getState().productCounts[prod.ProdID]).length > 0 ? Object.keys(useProductCounts.getState().productCounts[prod.ProdID]).length : null}
                    </span>
                    </span>
                  </button>
                  <button 
                  onClick={()=>{
                    setModalObs(true)
                    setSelectedProdId(prod.ProdID)
                  }}
                  className="bg-gray-300 text-xs rounded shadow-md shadow-gray-400 text-gray-900 p-2 focus:outline-none transition-transform transform hover:scale-105 flex items-center gap-1"
                  >
                    Observações 
                    <span className={`font-bold`}>
                      {
                      observacoes.find(o => o.prodId == prod.ProdID)?.obs ? <BiCommentCheck size={17}/> : 
                      <BiCommentAdd size={17}/>
                      }
                    </span>
                  </button>
                </div>
                              { modalComplementos && (
                <div className="transition-opacity ease-in-out duration-300" key={prod.ProdID}>
                  <ModalComplementos
                    GrupoTipo={GrupoTipo}
                    grupoId={params.grupo}
                    prodId={selectedProdId!}
                    onClose={() => {
                      setModalComplementos(false);
                    }}
                  />
                </div>
              )}
                  { modalObs && (
                  <div className="transition-opacity ease-in-out duration-700" key={prod.ProdID}>
                    <ModalObs
                      prodId={selectedProdId!}
                      onClose={() => {
                        setModalObs(false);
                      }}
                    />
                  </div>
                )}
              </MotionAnimate>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
      {totalCount > 0  && <button
            onClick={async()=>{
              if(!addCart){
                setAddCart(true)
                const descricao = `${useGrupo.getState().state.grupo ? useGrupo.getState().state.grupo?.GrupDescricao : ''} ${useGrupoTipo.getState().state.grupo ? `${useGrupoTipo.getState().state.grupo?.GrTpDescricao} ${totalCount} sabor` : ''}`
                const { OK } = await handleCartSubmit(useProduto.getState().produtos, useProduto.getState().Complementos, cookies.get('token')!, descricao)
                if(OK){
                  router.push(`/${params.link}/pedidos`)
                  useGrupoTipo.getState().actions.addEmpresa(null)
                  useObservacoes.getState().resetObs()
                  useProduto.getState().resetComplementos()
                  useProductCounts.setState({productCounts: {}})
                }
              }
            }}
              className={`bg-gray-600
                          fixed bottom-0
                          w-full text-base
                          opacity-80 
                          text-white 
                          font-bold py-3 
                          px-4 mt-2 lg:mt-0 
                          focus:outline-none 
                          transition-transform 
                          transform 
                          hover:scale-105`}
            >
              Adicionar ao Carrinho
            </button>
      }
    </MotionAnimate>
    </>
  );
}

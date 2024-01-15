'use client'
import { PiBasketBold} from 'react-icons/pi';
import { Grupo } from '../../../../types/Grupos';
import { useRouter } from 'next/navigation';
import { useGrupo } from '@/app/states/grupo/useGrupo';
// @ts-ignore
import { MotionAnimate } from 'react-motion-animate';
import { useEmpresaStore } from '@/app/states/empresa/useEmpresa';
import { useEffect, useState } from 'react';
import { useGrupoStore } from '@/app/states/grupo/useGetGrupo';
import Loading from '@/app/loading';
import { useProduto } from '@/app/states/produto/useProdutos';
import {  AiOutlineArrowRight } from 'react-icons/ai';
import { useCarrinho } from '@/app/states/carrinho/useCart';
import formatarReal from '@/app/utils/fomatToReal';
import axios from 'axios';
import { apiUrl } from '@/app/utils/apiUrl';
import { useCookies } from 'next-client-cookies';
import { CarrinhoData } from '../carrinho/page';
import { BsCart4 } from 'react-icons/bs';

export default function Pedidos({ params }: { params: { link: string } }) {
  const route = useRouter()
  const cookies = useCookies();
  const token = cookies.get('token')
  const {empresa,error,getEmpresa,isLoading} = useEmpresaStore()
  const { error: errorGrupo, getGrupo, grupo: grupoData, isLoading: isLoadingGrupo} = useGrupoStore()
  useProduto.getState().resetComplementos()
  useProduto.getState().resetProdutos()
  const [cart, setCart] = useState<CarrinhoData[]>([])
  const calculateTotal = (cart: CarrinhoData[]) => {
    return cart.reduce((acc, item) => acc + (item.CarQtd ? item.CarValorTotal * item.CarQtd : item.CarValorTotal), 0);
  };

  useEffect(()=>{
    if(empresa){
      if(!grupoData){
        getGrupo(`${empresa?.EmprCodigo}`)
      }
    }else{
      getEmpresa(params.link)
    }
  },[empresa, getEmpresa, params, getGrupo, grupoData])

  useEffect(()=>{
    const getCarrinho = async ()=>{
        const response = await axios.get(`${apiUrl}/carrinhos/${token}`,{
          headers:{
              Authorization: `Bearer ${token}`
          }
        });
        useCarrinho.getState().addCarrinho(response.data)
        setCart(response.data)
    }
    getCarrinho()
  },[token])

  const handleGrupo = (grupo: Grupo) => {
    if(grupo?.GrupoTipo?.length == 0){
      route.push(`/${empresa?.EmprLink}/pedidos/${grupo.GrupID}`)
      useGrupo.getState().actions.addEmpresa(grupo)
      useGrupo.setState({semDivisao: true})
    }else{
      route.push(`pedidos/tipo`)
      useGrupo.getState().actions.addEmpresa(grupo)
    }
  }

  return (<>
  <MotionAnimate>
      <div className="flex-1 mt-1 lg:mx-20zzzz">
      <div className="lg:rounded-lg p-5 flex justify-center items-center flex-col">
        <h3 className="font-bold text-lg flex gap-2 bg-gray-800 px-3 py-1 mt-1 w-full justify-center rounded-xl text-gray-100 items-center">Pedido <PiBasketBold /></h3>
        <div className=" rounded-lg p-5 mt-4 w-full">
          {isLoadingGrupo && (<Loading/>)}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {grupoData && grupoData.map((grupo) => (
              <button style={{background: empresa?.CorSite}}
                   key={grupo.GrupID} 
                   className={`bg-gray-500 p-3 text-gray-100 text-lg rounded flex justify-center shadow-md shadow-gray-500 focus:outline-none transition-transform transform hover:scale-105`}
                   onClick={()=> handleGrupo(grupo)}
              >
                <p>{grupo.GrupDescricao}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      </div> 
      {cart.length > 0 && 
      (
      <button 
      onClick={()=>route.push(`/${params.link}/carrinho`)}
          className="bg-gray-600 fixed bottom-0 w-full text-base opacity-80 text-gray-100 py-3 px-4 mt-2 lg:mt-0 focus:outline-none transition-transform transform hover:scale-105"
      >
        <span className='font-semibold flex justify-center gap-4 items-center'><BsCart4 size={20}/> Total: {formatarReal(calculateTotal(cart))} <AiOutlineArrowRight size={20}/></span>
      </button>
      )}
  </MotionAnimate>
      </>)}

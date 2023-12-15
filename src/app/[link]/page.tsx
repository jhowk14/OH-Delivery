'use client'
import { MdOutlineBorderColor } from "react-icons/md";
import NotFound from '@/app/components/NotFound';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { Empresas } from '../../../types/Empresa';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCookies } from 'next-client-cookies';
import { renderImage } from '../utils/renderImage';
import { apiUrl } from '../utils/apiUrl';
import Loading from '../loading';
import { useEmpresaStore } from '../states/empresa/useEmpresa';
import useVerificarIntervalo from '../hooks/verifyInterval';

const client = new QueryClient()

export default function Empresa({ params }: { params: { link: string } }){

  return (
    <QueryClientProvider client={client}>
      <EmpresaComponent params={params}/>
    </QueryClientProvider>
  )
}

function EmpresaComponent({ params }: { params: { link: string } }) {
  const cookies = useCookies();
  const {empresa,isLoading,setEmpresa} = useEmpresaStore()

  const { data: response, isLoading: isEmpresaLoading } = useQuery<Empresas>({
    queryKey: ["empresa"],
      queryFn: async () =>{
        if(!empresa){
          let newEmpresa: Empresas = (await axios.get(`${apiUrl}/empresa/${params.link}`)).data
          setEmpresa(newEmpresa)
          return newEmpresa
        }else{
          return empresa
        }
      }
  });
  
  const router = useRouter()

  const dentroDoIntervalo = useVerificarIntervalo(
    empresa?.EmprInicioExpediente!,
    empresa?.EmprFimExpediente!
  )

  if(isEmpresaLoading || isLoading){
      return (
      <div className='mt-64'>
        <Loading/>
      </div>)
  }else{
    if(!response)
      return <NotFound/>
  }


 
  const color = response.CorSite || undefined
  const GetSessionToken = async()=>{
    try{
      const Existstoken = cookies.get('token')
      if(Existstoken){
        router.push(`/${response.EmprLink}/pedidos`)
      }else{
      const dataAtual = new Date();
      // Adicione uma hora (3600000 milissegundos) à data atual
      const dataUmaHoraAFrente = new Date(dataAtual.getTime() + 3600000);
      const token = await axios.post(`${apiUrl}/sessionToken`,{
        EmprCodigo: response.EmprCodigo
      });
      cookies.set('token', token.data.token,{
        path: `/${response.EmprLink}`,
        expires: dataUmaHoraAFrente
      })}
    }catch(e){
      console.log(e)
    }
    router.push(`/${response.EmprLink}/pedidos`)
}
  const imageLogo = renderImage(response.EmprLogotipo)
  const imageBG = renderImage(response.EmprImagemCabecalho)

  return (
    <>
      <div className="p-4 sm:p-8 text-center flex-1 bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: `url("${imageBG}")` }}>

        <div className="my-6 flex justify-center">
          <Image src={imageLogo} width={150} height={150} alt="logo da empresa" />
        </div>
        <div className="mt-6">
           {dentroDoIntervalo ? (
            <button style={{ backgroundColor: color }} onClick={GetSessionToken} className="rounded text-lg text-gray-100 font-semibold bg-blue-500 hover:bg-blue-700 py-3 px-6 shadow-md focus:outline-none transition-transform transform hover:scale-105">
              <div className="flex items-center gap-1 justify-center">
                <p>Efetuar um pedido </p><MdOutlineBorderColor />
              </div>
            </button>
          ) : (
            <div className='rounded py-3 px-6 text-lg text-gray-100 font-semibold' style={{ backgroundColor: color }}>
              <p>Horario de pedidos das {empresa?.EmprInicioExpediente.split('T')[1].split('.')[0].slice(0, -3)} às {empresa?.EmprFimExpediente.split('T')[1].split('.')[0].slice(0, -3)} </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

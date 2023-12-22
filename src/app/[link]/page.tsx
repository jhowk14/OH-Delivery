'use client'
import { MdOutlineBorderColor } from "react-icons/md";
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { useCookies } from 'next-client-cookies';
import { renderImage } from '../utils/renderImage';
import { apiUrl } from '../utils/apiUrl';
import { useEmpresaStore } from '../states/empresa/useEmpresa';
import useVerificarIntervalo from '../hooks/verifyInterval';
import { useEffect, useState } from "react";


export default function Empresa({ params }: { params: { link: string } }) {
  const cookies = useCookies();
  const { empresa: EmpresaData, getEmpresa } = useEmpresaStore.getState();
  const [empresa, setEmpresa] = useState(EmpresaData);

  useEffect(() => {
    const fetchData = async () => {
      if (!empresa) {
        setEmpresa(await getEmpresa(params.link));
      }
    };

    fetchData();
  }, [getEmpresa, params, empresa]);

  const router = useRouter();
  const dentroDoIntervalo = useVerificarIntervalo(
    empresa?.EmprInicioExpediente!,
    empresa?.EmprFimExpediente!
  );

  const getSessionToken = async () => {
    try {
      const Existstoken = cookies.get('token');
      if (Existstoken) {
        router.push(`/${empresa?.EmprLink}/pedidos`);
      } else {
        const dataAtual = new Date();
        const dataUmaHoraAFrente = new Date(dataAtual.getTime() + 3600000);
        const token = await axios.post(`${apiUrl}/sessionToken`, {
          EmprCodigo: empresa?.EmprCodigo,
        });
        cookies.set('token', token.data.token, {
          path: `/${empresa?.EmprLink}`,
          expires: dataUmaHoraAFrente,
        });
      }
      router.push(`/${empresa?.EmprLink}/pedidos`);
    } catch (e) {
      console.log(e);
    }
  };

  const imageLogo = empresa?.EmprLogotipo ? renderImage(empresa?.EmprLogotipo!) : ''
  const imageBG = empresa?.EmprImagemCabecalho ? renderImage(empresa?.EmprImagemCabecalho!) : ''

  return (
    <>
    { empresa && (
      
      <div className="p-4 sm:p-8 text-center flex-1 bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: `url("${imageBG}")` }}>
        <div className="my-6 flex justify-center">
          <Image src={imageLogo} width={150} height={150} alt="logo da empresa" />
        </div>
        <div className="mt-6">
          {dentroDoIntervalo ? (
            <button
              style={{ backgroundColor: empresa?.CorSite }}
              onClick={getSessionToken}
              className="rounded text-lg text-gray-100 font-semibold bg-blue-500 hover:bg-blue-700 py-3 px-6 shadow-md focus:outline-none transition-transform transform hover:scale-105"
            >
              <div className="flex items-center gap-1 justify-center">
                <p>Efetuar um pedido </p>
                <MdOutlineBorderColor />
              </div>
            </button>
          ) : (
            <div className="rounded py-3 px-6 text-lg text-gray-100 font-semibold" style={{ backgroundColor: empresa?.CorSite }}>
              <p>Horario de pedidos das {empresa?.EmprInicioExpediente.split('T')[1].split('.')[0].slice(0, -3)} às {empresa?.EmprFimExpediente.split('T')[1].split('.')[0].slice(0, -3)} </p>
            </div>
          )}
        </div>
      </div>
    )}
    </>
  );
}
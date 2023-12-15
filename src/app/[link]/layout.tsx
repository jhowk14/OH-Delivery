import axios from 'axios';
import { Empresas } from '../../../types/Empresa';
import { HiHome } from 'react-icons/hi';
import { BsCart4 } from 'react-icons/bs';
import Link from 'next/link';
import { Metadata } from 'next';
import { apiUrl } from '../utils/apiUrl';
import { useEmpresaStore } from '../states/empresa/useEmpresa';
import NotFound from '../not-found';

export async function generateMetadata({ params }: { params: { link: string } }): Promise<Metadata> {
  try {
    const response = await axios.get(`${apiUrl}/empresa/${params.link}`);
    if (response.status === 200) {
      const responseData: Empresas = response.data;
      useEmpresaStore.setState({ empresa: responseData });
      return {
        title: responseData.EmprNome,
        description: `Empresa ${responseData.EmprNome}`,
      };
    } else {
      return {
        title: 'OH Delivery',
        description: 'Home',
      };
    }
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      title: 'OH Delivery',
      description: 'Home',
    };
  }
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: { link: string } }) {
  try {
    const response = await axios.get(`${apiUrl}/empresa/${params.link}`);
    if (response.status === 200) {
      const responseData: Empresas = response.data;
      useEmpresaStore.setState({ empresa: responseData });

      return (
        <>
        <header style={{ backgroundColor: responseData?.CorSite }} className={`p-4 sm:p-6 flex justify-between shadow-2xl shadow-gray-900 items-center`}>
          <Link href={`/${params.link}`}>
            <div className="flex space-x-2 px-10 text-gray-100 hover:text-gray-400">
              <HiHome size={30} />
              <span className="hidden sm:inline-block">Home</span>
            </div>
          </Link>
          <Link href={`/${params.link}/carrinho`}>
          <div className={`flex space-x-2 px-10 text-gray-100 hover:text-gray-400 relative `}>
            <BsCart4 size={30} />
            <span className="hidden sm:inline-block relative right-1">Carrinho</span>
          </div>
          </Link>
        </header>
      <main className={`min-h-screen flex flex-col bg-gray-100`}>
      {children}
      </main>
      {responseData && (
    
      <footer style={{backgroundColor: responseData.CorSite}} className={` p-4 sm:p-6 text-white`}>
          <div style={{backgroundColor: responseData.CorSite}} className={` rounded-lg p-4 text-xs grid lg:grid-cols-2 mb-16`}>
              <div>
                <p className="font-bold text-gray-100">Endereço:</p>
                <p className="text-gray-950">{responseData?.EmprEndereco}, {responseData?.EmprBairro}</p>
                <p className="text-gray-950">{responseData?.EmprCidade}, {responseData?.EmprNumero}, {responseData?.EmprEstado}</p>
              </div>
              <div>
                <p className="font-bold text-gray-100">Telefone:</p>
                <p className="text-gray-950">{responseData?.EmprTelefone}</p>
              </div>
            </div>
        </footer>
      )}
      </>
      );
    } else {
      return <NotFound />;
    }
  } catch (error) {
    console.error('Error fetching empresa data:', error);
    return <NotFound />;
  }
}

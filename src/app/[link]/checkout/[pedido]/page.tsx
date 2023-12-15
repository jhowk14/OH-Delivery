'use client'
import { FaCheck, FaShippingFast, FaStore, FaClipboardList, FaMapMarkerAlt } from 'react-icons/fa';
import { apiUrl } from '@/app/utils/apiUrl';
import axios from 'axios';
import { useEffect, useState } from 'react';
import formatarReal from '../../../utils/fomatToReal';
import { MdDeliveryDining } from 'react-icons/md';
import { PiCookingPotBold } from 'react-icons/pi';
import { IoMdPerson } from 'react-icons/io';
import { BsTelephoneFill } from 'react-icons/bs';

// ... (imports)

export default function Pedidos({ params }: { params: { pedido: string } }) {
    const [pedido, setPedido] = useState<any>(null);
  
    useEffect(() => {
      const getPedidoById = async () => {
        try {
          let pedido = (await axios.get(`${apiUrl}/pedido/${params.pedido}`)).data.pedido;
          if (pedido.status === 0) {
            pedido = (await axios.put(`${apiUrl}/pedido/${params.pedido}`, { Pedido: { status: 1 } })).data.pedido;
          }
          setPedido(pedido);
        } catch (error) {
          console.error('Erro ao buscar o pedido:', error);
        }
      };
  
      getPedidoById();
    }, [params.pedido]);
  
    const steps = [
      { title: 'Pedido Confirmado', icon: <FaClipboardList size={20} />, status: 1 },
      { title: 'Pedido Recebido', icon: <FaStore size={20} />, status: 2 },
      { title: 'Preparando Pedido', icon: <PiCookingPotBold size={20} />, status: 3 },
      { title: 'Pedido em Entrega', icon: <MdDeliveryDining size={20} />, status: 4 },
    ];
  
    const renderStep = (step: { title: string; icon: JSX.Element; status: number }, index: number) => (
        <>
          <li key={step.title} className='px-1'>
            <div
              className={`p-2 ${
                pedido?.status >= step.status ? 'bg-green-500' : 'bg-gray-800'
              } font-medium text-white rounded-full dark:bg-white dark:text-gray-800`}
            >
              {pedido?.status < step.status ? step.icon : <FaCheck size={20} />}
            </div>
          </li>
          {
            index < steps.length - 1 && <div className="h-[2px] w-full bg-gray-200 items-center m-2"></div>
          }
        </>
      );
  
    return (
      <div className='container mx-auto py-4 px-2'>
        {pedido && (
          <div>
            <div className="col-span-full  shadow-gray-600 mb-4 p-2">
              <h2 className='font-semibold text-center m-2'>{steps.find(s => s.status == pedido?.status)?.title}</h2>
              <ul className="flex justify-around items-center mb-3">
                {steps.map(renderStep)}
              </ul>
            </div>
            <div className="col-span-full sm:col-span-2 lg:col-span-1 xl:col-span-2 mb-4">
              <div className="p-6 dark:bg-gray-800 shadow-md">
                <h2 className="font-semibold mb-4">Detalhes do Pedido</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="flex items-center gap-3"><IoMdPerson /> {pedido.clienteNome}</p>
                    <p className="flex items-center gap-3"><BsTelephoneFill size={13} />{pedido.clienteTelefone}</p>
                    <p className="flex items-center gap-3"><FaMapMarkerAlt />{pedido.clienteEndereco} N°{pedido.clienteNumero}</p>
                    {pedido.clienteComplemento && <p>{pedido.clienteComplemento}</p>}
                  </div>
                  <div>
                    <p className="flex items-center gap-3">Forma de Pagamento: {pedido.formaPagamento}</p>
                    <p>{pedido.id}</p>
                    {pedido.clienteTroco && <p className="flex items-center gap-3">Troco: {formatarReal(pedido.clienteTroco)} </p>}
                    <p className="flex items-center gap-3">Total Pedido: {formatarReal(pedido.totalPedido)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
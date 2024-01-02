'use client'
import { FaCheck, FaStore, FaClipboardList, FaMapMarkerAlt } from 'react-icons/fa';
import { apiUrl } from '@/app/utils/apiUrl';
import axios from 'axios';
import { Fragment, useCallback, useEffect, useState } from 'react';
import formatarReal from '../../../utils/fomatToReal';
import { MdDeliveryDining } from 'react-icons/md';
import { PiCookingPotBold } from 'react-icons/pi';
import { IoMdPerson } from 'react-icons/io';
import { BsTelephoneFill } from 'react-icons/bs';
import Image from 'next/image';
import { buildWhatsAppMessagePedido } from '@/app/utils/MessageWhasapp';
import { Pedido } from '../../../../../types/pedidos';

export default function Pedidos({ params }: { params: { pedido: string } }) {
  const [pedido, setPedido] = useState<Pedido | null>(null);

  const getPedidoById = useCallback(async () => {
    try {
      let fetchedPedido = (await axios.get(`${apiUrl}/pedido/${params.pedido}`)).data.pedido;
      if (fetchedPedido.status === 0) {
        await axios.put(`${apiUrl}/pedido/${params.pedido}`, { Pedido: { status: 1 } })
        fetchedPedido = (await axios.get(`${apiUrl}/pedido/${params.pedido}`)).data.pedido;
      }
      // Only update the state if the status has changed
      if (!pedido || fetchedPedido.status !== pedido.status) {
        setPedido(fetchedPedido);
      }
    } catch (error) {
      console.error('Erro ao buscar o pedido:', error);
    }
  }, [params.pedido, pedido]);

  useEffect(() => {
    // Initial fetch
    getPedidoById();

    // Polling mechanism
    const intervalId = setInterval(() => {
      getPedidoById();
    }, 60000); // 1 minute interval

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [getPedidoById]);

  const steps = [
    { title: 'Pedido Confirmado', icon: <FaClipboardList size={20} />, status: 1 },
    { title: 'Pedido Recebido', icon: <FaStore size={20} />, status: 2 },
    { title: 'Preparando Pedido', icon: <PiCookingPotBold size={20} />, status: 3 },
    { title: 'Pedido em Entrega', icon: <MdDeliveryDining size={20} />, status: 4 },
  ];

  const renderStep = (step: { title: string; icon: JSX.Element; status: number }, index: number) => (
    <Fragment key={step.title}>
      <li className='px-1'>
        <div
          className={`p-2 ${
            pedido &&
            pedido?.status >= step.status ? 'bg-green-500' : 'bg-gray-800'
          } font-medium text-white rounded-full dark:bg-white dark:text-gray-800`}
        >
          {pedido && pedido?.status < step.status ? step.icon : <FaCheck size={20} />}
        </div>
      </li>
      {index < steps.length - 1 && <div className={`h-[2px] w-full ${pedido && pedido?.status < step.status ? "bg-gray-200" : "bg-green-400 animate-pulse"}  items-center m-2`}></div>}
    </Fragment>
  );
const totalGeral = (pedido?.taxaEntrega || 0)*1+(pedido?.totalPedido || 0)*1
  return (
    <>
      <div className='mx-3 py-4 px-2 mt-10 shadow-sm shadow-gray-400'>
          <div>
            <div className="col-span-full mb-4 p-2">
              <h2 className='font-semibold text-center m-2'>{steps.find(s => s.status == pedido?.status)?.title}</h2>
              <ul className="flex justify-around items-center mb-3">
                {steps.map(renderStep!)}
              </ul>
            </div>
            <div className="col-span-full sm:col-span-2 lg:col-span-1 xl:col-span-2 mb-4">
              <div className="p-6 ">
                <h2 className="font-semibold mb-4">Detalhes do Pedido</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="flex items-center gap-3 m-1"><IoMdPerson /> {pedido?.clienteNome}</p>
                    <p className="flex items-center gap-3 m-1"><BsTelephoneFill size={13} />{pedido?.clienteTelefone}</p>
                    <p className="flex items-center gap-3 m-1"><FaMapMarkerAlt />{pedido?.clienteEndereco} N°{pedido?.clienteNumero} {pedido?.clienteBairro} {pedido?.clienteCidade} {pedido?.clienteEstado} {pedido?.clienteCep}</p>
                    {pedido?.clienteComplemento && <p>{pedido?.clienteComplemento}</p>}
                  </div>
                  <div>
                    <p className="flex items-center gap-3">Forma de Pagamento: {pedido?.formaPagamento}</p>
                    {pedido?.clienteTroco && <p className="flex items-center gap-3">Troco: {formatarReal(pedido?.clienteTroco-totalGeral)} </p>}
                    <p className="flex items-center gap-3">Total Pedido: {formatarReal(totalGeral)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
      {pedido && (
        <div className='flex justify-center'>
      <button
        className="bg-green-500 m-2 bottom-0 fixed text-lg text-gray-50 py-3 px-4 rounded-lg custom-bounce"
        onClick={async() => {
            const message = buildWhatsAppMessagePedido(pedido)
            window.open(`https://wa.me/${pedido.empresaTelefone}?text=${encodeURIComponent(message)}`, '_blank');
        }}
      >
        <span className='font-semibold flex justify-center text-xl gap-4 items-center'>Falar com restaurante <Image src='/images/icoWhatsapp.png' height={40} width={40} alt='whatsapp'/></span>
      </button>
        </div>
      )
      }
    </>
  );
}
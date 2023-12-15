import { AiOutlineArrowRight, AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useGrupoTipo } from "../states/grupo/useGrupoTipo";

const ModalAlertPedido = ({ params, onClose }: { params: { link: string }, onClose: () => void }) => {
  const router = useRouter() 
  // Set the value of showObservacoesModal based on the isOpen prop.
  return (
<>
        <button onClick={() => {
            router.push(`/${params.link}/carrinho`)
      }} className="p-3 bg-gray-300 mb-1 font-bold rounded-full  transition-transform transform focus:outline-none hover:scale-125">
        <AiOutlineClose />
      </button>
        <h3 className="font-bold text-sm text-center px-3 py-1 mt-1 w-full items-center">Produto Adicionado com sucesso Deseja...</h3>
          <div className="flex justify-around mt-4 gap-2">
            <button
              onClick={() => {
                router.push(`/${params.link}/pedidos`)
                useGrupoTipo.getState().actions.addEmpresa(null)
                onClose()
              }}
              className="bg-green-600 items-center flex justify-center gap-2 text-sm w-full text-white font-bold py-2 px-4 rounded focus:outline-none transition-transform transform hover:scale-105"
            >
            <span className="font-bold"><AiOutlinePlus size={17} /></span> Adicionar Mais
            
            </button>
            <button
              onClick={() => {
                router.push(`/${params.link}/carrinho`)
                onClose()
              }}
              className="bg-green-600 text-sm w-full items-center flex justify-center gap-2 text-white font-bold py-2 px-4 rounded focus:outline-none transition-transform transform hover:scale-105"
            > Finalizar Pedido <AiOutlineArrowRight size={17} />
            </button>
          </div>
</>
    )
};

export default ModalAlertPedido;

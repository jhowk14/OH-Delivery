import { AiOutlineClose } from "react-icons/ai";
import { useObservacoes } from "../states/produto/useObs";
import { useEffect, useState } from "react";
// @ts-ignore
import { MotionAnimate } from 'react-motion-animate'

const ModalObs = ({ onClose, prodId }: { onClose: ()=> void, prodId: number }) => {

  const ObsProdId = useObservacoes.getState().observacoes.find(o => o.prodId === prodId)?.obs;
  const [obs , setObs] = useState('')
  useEffect(()=>{
    if(ObsProdId){
      setObs(ObsProdId)
    }
  },[ObsProdId])
  // Set the value of showObservacoesModal based on the isOpen prop.
  return (
    // Return the JSX element for the modal when showObservacoesModal is true
    <MotionAnimate>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-80">
        <div className="bg-gray-100 p-4 rounded-lg w-96 mx-1">
        <button onClick={() => {
            onClose();
      }} className="p-3 bg-gray-300 mb-1 font-bold rounded-full  transition-transform transform focus:outline-none hover:scale-125">
        <AiOutlineClose />
      </button>
        <h3 className="font-bold text-sm flex gap-2 bg-gray-800 px-3 py-1 mt-1 w-full justify-center rounded-xl text-gray-100 items-center mb-3">Observações</h3>
          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            className="w-full h-32 p-2 border border-gray-300 rounded"
          />
          <div className="flex justify-around mt-4">
            <button
              onClick={() => {
                    onClose()
                    useObservacoes.getState().removerObservacao(prodId)
                    useObservacoes.getState().adicionarObservacao({prodId: prodId, obs:obs})
              }}
              className="bg-green-600 text-sm w-full text-white font-bold py-2 px-4 rounded focus:outline-none transition-transform transform hover:scale-105"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
      </MotionAnimate>
    )
};

export default ModalObs;

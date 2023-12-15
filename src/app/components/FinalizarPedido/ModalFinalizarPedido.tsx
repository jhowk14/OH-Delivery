import React, { useState } from "react";
import { Box } from "@mui/material";
import StepperComponent from "./StepperComponent";
import { useCarrinho } from "@/app/states/carrinho/useCart";
import { useCookies } from 'next-client-cookies';
import { AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/router";

const ModalFinalizarPedido = ({onChange}: {onChange: ()=>void}) => {
  const cookie = useCookies()
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    useCarrinho.getState().atualizarCarrinho(cookie.get('token')!)
  };

  return (
    <>
    <button
      onClick={handleOpen}
      className="fixed bottom-0 w-full bg-gray-600 text-base opacity-95 text-white font-bold py-3 px-4 mt-2 lg:mt-0 focus:outline-none transition-transform transform hover:scale-105"
    >
      Confirmar
    </button>
    {open && (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-80"
    >
      <div className="">
        <Box className="bg-gray-100 p-4 rounded-lg w-screen h-max">
            <button onClick={()=> {
              onChange()
              handleClose()
            }} className="p-3 right-0 bg-gray-300 font-bold rounded-full focus:outline-none transition-transform transform hover:scale-125">
            <AiOutlineClose />
            </button>
          <StepperComponent />
        </Box>
      </div>
    </div>
    )
    }
  </>
  );
};

export default ModalFinalizarPedido;

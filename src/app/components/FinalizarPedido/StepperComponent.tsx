'use client'
import { FaClipboardCheck } from "react-icons/fa6";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Step,
  StepLabel,
  Stepper
} from "@mui/material";
import { IoMdPerson } from "react-icons/io";
import { BsTelephoneFill } from "react-icons/bs";
import { FaMapMarkerAlt, FaCreditCard, FaMapPin } from "react-icons/fa";
import Endereco from "./FormEndereco";
import Dados from "@/app/components/FinalizarPedido/FormDados";
import { usePedido } from "@/app/states/carrinho/usePedido";
import { useCarrinho } from "@/app/states/carrinho/useCart";
import { buildWhatsAppMessage, calcularTotalETaxa } from "@/app/utils/MessageWhasapp";
import formatarReal from "@/app/utils/fomatToReal";
import { handlePedidoSubmit } from "@/app/utils/handlePedidoSubmit";
import { useEmpresaStore } from "@/app/states/empresa/useEmpresa";
import Metodo from "./Metodo";
import { useCookies } from 'next-client-cookies';

const steps = [<IoMdPerson size={25} key={0}/>, <FaMapMarkerAlt  size={25} key={1}/>, <FaCreditCard size={25} key={2}/> , <FaClipboardCheck size={25} key={3}/>];

const StepperComponent = () => {
  const cookies = useCookies()
  const { FormPedido } = usePedido()
  const { carrinhos } = useCarrinho()
  const [total, setTotal] = useState(0)
  const [taxa, setTaxa] = useState(0)

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const { total, taxa } = calcularTotalETaxa(carrinhos);
    setTotal(total)
    setTaxa(taxa*1)
  }, [carrinhos]);

  const handleNext = () => {
    if (activeStep < steps.length) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const getStepContent = (stepIndex: any) => {

    switch (stepIndex) {
    case 0:
        return <Dados onChange={handleNext}/>;
    case 1:
        return <Endereco onChange={handleNext} onBack={handleBack}/>;
    case 2:
        return <Metodo total={total} taxa={taxa} onChange={handleNext} onBack={handleBack}/>
    case 3:
        return (
        <div>
          <div className="m-3 gap-2 bg-gray-300 p-3 rounded-md shadow-md shadow-gray-400">
            <h3 className="flex items-center gap-3"><IoMdPerson />{FormPedido.nome}</h3>
            <h3 className="flex items-center gap-3"><BsTelephoneFill size={13} />{FormPedido.telefone}</h3>
            <h3><span className="font-bold text-xs">CEP</span> {FormPedido.cep}</h3>
            <h3 className="flex items-center gap-3"><FaMapMarkerAlt /> {FormPedido.endereco} N°{FormPedido.numero}</h3>
            <h3 className="flex items-center gap-3"><FaMapPin />{FormPedido.bairro}</h3>
            <h3 className="flex items-center gap-3"><FaMapPin />{FormPedido.cidade}  {FormPedido.uf}</h3>
            {FormPedido.complemento != '' && (<h3 className="flex items-center gap-3"><FaMapPin />{FormPedido.complemento}</h3>)}
            <h3 className="flex items-center gap-3"><FaCreditCard/> {FormPedido.metodo} {FormPedido.valorPago && `${formatarReal(parseFloat(FormPedido.valorPago.replace(".", "").replace(",", ".")))}`}</h3>
            <h3 className="font-semibold flex items-center gap-3 text-sm mt-3">Taxa de Entrega: {formatarReal(taxa)}</h3>
            <h3 className="font-semibold flex items-center gap-3 text-sm ">Total Itens: {formatarReal(total)}</h3>
            <h3 className="font-semibold flex items-center gap-3 text-sm ">Total Geral: {formatarReal(total*1+taxa*1)}</h3>
            {FormPedido.valorPago && (<h3 className="font-semibold flex items-center gap-3 text-sm ">Troco: {formatarReal((parseFloat(FormPedido.valorPago.replace(".", "").replace(",", ".")) - (total*1+taxa*1)))}</h3>)}
          </div>

        <div className="flex gap-1">
            <Button
              className="bg-green-500 mt-1"
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleBack}
            >
              Voltar
            </Button>
            <Button
              className="bg-green-500 mt-1"
              variant="contained"
              color="primary"
              fullWidth
              onClick={async ()=>{
                handleNext()
                const {message} = buildWhatsAppMessage(carrinhos, total*1, taxa*1, FormPedido.valorPago)
                await handlePedidoSubmit(carrinhos, FormPedido, total*1, useEmpresaStore.getState().empresa!, taxa*1, cookies.get('token')!, message)
              }}
            >
              Finalizar
            </Button>
          </div>
        </div>
        );

      default:
        return "Erro: Etapa desconhecida";
    }
  };

  return (
    <>
    <div className="flex justify-center my-2">
    <Stepper activeStep={activeStep} variant="elevation" alternativeLabel>
    {steps.map((label, index) => (
      <Step key={index}>
          <StepLabel className={`text-xs`}>
            {label as React.ReactNode}
          </StepLabel>
      </Step>
    ))}
    </Stepper>
  </div>
  <div className="mx-auto max-w-md">
    {activeStep === steps.length ? (
          <div className="text-center flex justify-center items-center">
            <Alert severity="success">
            Pedido Enviado Com Sucesso.
            Confirme via WhatsApp
          </Alert>
          </div>
        ) : (
          <div 
        >

        {getStepContent(activeStep)}
      </div>
    )}
  </div>
    </>
  );
};

export default StepperComponent;

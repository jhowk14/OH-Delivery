import { useState, useEffect } from 'react';

const useVerificarIntervalo = (inicioString: string, fimString: string) => {
  const [dentroDoIntervalo, setDentroDoIntervalo] = useState(true);

  useEffect(() => {
    const inicio = new Date(inicioString);
    inicio.setUTCHours(inicio.getUTCHours() + 3);

    const fim = new Date(fimString);
    fim.setUTCHours(fim.getUTCHours() + 3);

    const verificarIntervalo = () => {
      const horaAtualSemData = new Date();
      horaAtualSemData.setFullYear(1970, 0, 1);

      const inicioSemData = new Date(inicio);
      inicioSemData.setFullYear(1970, 0, 1);

      const fimSemData = new Date(fim);
      fimSemData.setFullYear(1970, 0, 1);

      const dentroDoIntervalo =
        horaAtualSemData >= inicioSemData && horaAtualSemData <= fimSemData;
      setDentroDoIntervalo(dentroDoIntervalo);
    };

    // Verificar o intervalo quando o componente é montado
    verificarIntervalo();

    const intervalID = setInterval(() => {
      verificarIntervalo();
    }, 60000);

    return () => clearInterval(intervalID);
  }, [inicioString, fimString]);

  return dentroDoIntervalo;
};

export default useVerificarIntervalo;

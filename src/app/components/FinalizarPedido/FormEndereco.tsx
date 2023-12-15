import { Autocomplete, Button, TextField } from "@mui/material";
import axios from "axios";
import { usePedido } from "../../states/carrinho/usePedido";
import TextMaskCustom from "../../hooks/MaskForm";
import { useState } from "react";

const Endereco = ({onChange, onBack}:{onChange: ()=> void,onBack: ()=> void}) => {
  const { FormPedido, setFormPedido } = usePedido();
  const [error, setError] = useState({
    cep: false
  });
  const [selectedUF, setSelectedUF] = useState<string | null>('SP') // Adicionado estado para rastrear UF selecionado

  const handleCEPChange = async (value: string) => {
    const cep = value.replace(/[^0-9]/g, '').trim();
    if (cep.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const data = response.data;
        if (response.status === 200) {
          if (data.erro) {
            setError({ cep: data?.erro });
          } else {
            setFormPedido({
              ...FormPedido,
              cep: data.cep,
              cidade: FormPedido.cidade === '' ? data.localidade : FormPedido.cidade,
              endereco: FormPedido.endereco === '' ? data.logradouro : FormPedido.endereco,
              bairro: FormPedido.bairro === '' ? data.bairro : FormPedido.bairro,
              uf: data.uf
            });
            setSelectedUF(data.uf || 'SP'); // Atualiza o estado com a UF selecionada
          }
        }
      } catch (error) {
        console.error("Erro ao buscar o endereço:", error);
      }
    }
  };

    const estadosBrasil = [
      { label: 'AC', id: 'Acre' },
      { label: 'AL', id: 'Alagoas' },
      { label: 'AP', id: 'Amapá' },
      { label: 'AM', id: 'Amazonas' },
      { label: 'BA', id: 'Bahia' },
      { label: 'CE', id: 'Ceará' },
      { label: 'DF', id: 'Distrito Federal' },
      { label: 'ES', id: 'Espírito Santo' },
      { label: 'GO', id: 'Goiás' },
      { label: 'MA', id: 'Maranhão' },
      { label: 'MT', id: 'Mato Grosso' },
      { label: 'MS', id: 'Mato Grosso do Sul' },
      { label: 'MG', id: 'Minas Gerais' },
      { label: 'PA', id: 'Pará' },
      { label: 'PB', id: 'Paraíba' },
      { label: 'PR', id: 'Paraná' },
      { label: 'PE', id: 'Pernambuco' },
      { label: 'PI', id: 'Piauí' },
      { label: 'RJ', id: 'Rio de Janeiro' },
      { label: 'RN', id: 'Rio Grande do Norte' },
      { label: 'RS', id: 'Rio Grande do Sul' },
      { label: 'RO', id: 'Rondônia' },
      { label: 'RR', id: 'Roraima' },
      { label: 'SC', id: 'Santa Catarina' },
      { label: 'SP', id: 'São Paulo' },
      { label: 'SE', id: 'Sergipe' },
      { label: 'TO', id: 'Tocantins' }
    ];  

  const handleChange = (e: any) => {
    setError({
      cep: false
    });
    setFormPedido({ ...FormPedido, [e.target.name]: e.target.value });
  };

  const handleUFChange = (event: any, newValue: { id: string; label: string } | null) => {
    if (newValue) {
      setSelectedUF(newValue.label);
    }
  };
  
    return (
      <>
        <form
        className="mt-2"
        onSubmit={(e) => {
          e.preventDefault();
          onChange();
        }}
        >
          <div className="grid grid-cols-1 items-center gap-2">
            <TextField
              label="CEP"
              variant="outlined"
              type="text"
              name="cep"
              value={FormPedido.cep}
              onChange={(e) => {
                handleChange(e);
                handleCEPChange(e.target.value);
              }}
              InputProps={{ inputComponent: TextMaskCustom as any }}
              error={error.cep}
            />
          <TextField
            label="Endereço"
            variant="outlined"
            autoFocus
            required
            fullWidth
            type="text"
            name="endereco"
            value={FormPedido.endereco}
            onChange={handleChange}
          />
          <div className="flex gap-1">
            <TextField
              label="Complemento"
              variant="outlined"
              fullWidth
              type="text"
              name="complemento"
              value={FormPedido.complemento}
              onChange={handleChange}
            />
            <TextField
              label="Numero"
              variant="outlined"
              required
              type="text"
              sx={{ width: 100 }}
              name="numero"
              value={FormPedido.numero}
              onChange={handleChange}
            />
          </div>
            <TextField
              label="Bairro"
              variant="outlined"
              required
              type="text"
              name="bairro"
              value={FormPedido.bairro}
              onChange={handleChange}
            />
          <div className="flex gap-1">
          <TextField
            label="Cidade"
            variant="outlined"
            required
            fullWidth
            type="text"
            name="cidade"
            value={FormPedido.cidade}
            onChange={handleChange}
          />
           <Autocomplete
            disablePortal
            sx={{ width: 100 }}
            id="combo-box-demo"
            options={estadosBrasil}
            value={estadosBrasil.find((estado) => estado.label === selectedUF) || null}
            onChange={handleUFChange}
            renderInput={(params) => <TextField {...params}  label="UF" />}
          />
          </div>
          <div className="flex gap-1">
            <Button
              className="bg-green-500 mt-1"
              variant="contained"
              color="primary"
              fullWidth
              onClick={onBack}
            >
              Voltar
            </Button>
            <Button
              className="bg-green-500 mt-1"
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Proximo
            </Button>
          </div>
          </div>
        </form>
      </>
    );
  }
  export default Endereco;
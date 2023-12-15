import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, TextField, Button } from "@mui/material";
import { usePedido } from "../../states/carrinho/usePedido";
import formatarReal from "@/app/utils/fomatToReal";
import CurrencyMaskCustom from "@/app/hooks/MaskTroco";

const Metodo = ({ total,taxa, onChange, onBack}:{total: number,taxa: number,onChange: () => void, onBack: () => void}) => {

  const { FormPedido, setFormPedido } = usePedido();
  const [error, setError] = useState({
    valorPago: false,
  });

  const [metodo, setMetodo] = useState("Cartão de Crédito");


  const [valorPago, setValorPago] = useState(FormPedido.valorPago);

  const handleChange = (e :any) => {
    setValorPago('')
    setError({ valorPago: false });
    if (e.target.name === "metodo") {
      setMetodo(e.target.value);
    } else if (e.target.name === "valorPago") {
      setValorPago(e.target.value);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (metodo === "Dinheiro") {
      if (!valorPago || parseFloat(valorPago.replace(/\./g, '').replace(',', '.')) < total*1 + taxa*1) {
        setError({ valorPago: true });
        console.log(parseFloat(valorPago))
        return;
      }
    }
  
    setFormPedido({
      ...FormPedido,
      metodo: metodo,
      valorPago: valorPago,
    });
    onChange();
    // Restante da lógica de handleSubmit
  };
  useEffect(()=>{
    if(FormPedido.metodo){
      setMetodo(FormPedido.metodo)
    }
  },[FormPedido, setFormPedido ])

  return (
    <div className="items-center gap-2">
      <form onSubmit={handleSubmit} className=" grid grid-cols-1">
        <FormControl variant="outlined" fullWidth margin="normal" required>
          <InputLabel id="metodo-pagamento-label" >Método de Pagamento</InputLabel>
          <Select
            labelId="metodo-pagamento-label"
            id="metodo-pagamento"
            name="metodo"
            fullWidth
            value={metodo}
            onChange={handleChange}
            label="Método de Pagamento"
          >
            <MenuItem value="Cartão de Crédito">Cartão de Crédito</MenuItem>
            <MenuItem value="Cartão de Débito">Cartão de Débito</MenuItem>
            <MenuItem value="Dinheiro">Dinheiro</MenuItem>
            <MenuItem value="Pix">Pix</MenuItem>
          </Select>
        </FormControl>

      {metodo == 'Dinheiro' && (
            <TextField
              label="Troco Para Quanto?"
              variant="outlined"
              margin="normal"
              required
              type="text"
              name="valorPago"
              value={valorPago}
              onChange={handleChange}
              error={error.valorPago}
              InputProps={{ inputComponent: CurrencyMaskCustom as any }}
              helperText={error.valorPago ? "Informe um valor superior ao total geral" : ""}
            />
      )}
          <div className="p-2 rounded bg-gray-200 text-sm w-full my-2 font-semibold">
            <p>Total Pedido: {formatarReal(total*1+taxa*1)}</p>
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
      </form>
    </div>
  );
};

export default Metodo;

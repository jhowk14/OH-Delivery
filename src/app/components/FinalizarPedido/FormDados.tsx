import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Checkbox, FormControlLabel } from "@mui/material";
import { usePedido } from "../../states/carrinho/usePedido";
import TextMaskCustom from "../../hooks/MaskForm";
import { useState } from "react";

const Dados = ({ onChange }: { onChange: () => void }) => {
  const { FormPedido, setFormPedido } = usePedido();
  const [error, setError] = useState({
    nome: false,
    permitoMensagens: false,
  });

  const [permitoMensagens, setPermitoMensagens] = useState(false);

  const handleChange = (e: any) => {
    setError({
      nome: false,
      permitoMensagens: false,
    });
    setFormPedido({
      ...FormPedido,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPermitoMensagens(e.target.checked);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (FormPedido.nome.trim().indexOf(' ') === -1) {
      setError({ ...error, nome: true });
      return;
    }

    // Verifica se o checkbox está marcado
    if (!permitoMensagens) {
      setError({ ...error, permitoMensagens: true });
      return;
    }

    onChange();
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <TextField
          label="Nome Completo"
          margin="normal"
          variant="outlined"
          fullWidth
          error={error.nome}
          required
          name="nome"
          value={FormPedido.nome}
          onChange={handleChange}
          inputProps={{ pattern: "[A-Za-zÀ-ú ]+" }}
        />
        <TextField
          label="Telefone"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          type="text"
          name="telefone"
          value={FormPedido.telefone}
          onChange={handleChange}
          InputProps={{ inputComponent: TextMaskCustom as any }}
        />
        <FormControl error={error.permitoMensagens} required>
          <FormControlLabel
            control={
              <Checkbox
                checked={permitoMensagens}
                onChange={handleCheckboxChange}
                name="permitoMensagens"
              />
            }
            label="Permito Confirmação Por WhatsApp"
          />
          {error.permitoMensagens && (
            <p className="mb-2" style={{ color: "red" }}> Necessario permissão para proseguir</p>
          )}
        </FormControl>
        <Button
          className="bg-green-500 mt-1"
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Proximo
        </Button>
      </form>
    </div>
  );
};

export default Dados;

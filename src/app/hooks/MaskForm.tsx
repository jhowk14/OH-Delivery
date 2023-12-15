import { forwardRef } from "react";
import { IMaskInput } from "react-imask";

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
  }
  
  const TextMaskCustom = forwardRef<HTMLInputElement, CustomProps>(
    function TextMaskCustom(props, ref) {
      const { onChange, ...other } = props;
      return (
        <IMaskInput
          {...other}
          mask={
            props.name === "telefone"
              ? "(00) 00000-0000"
              : "00000-000"
          }
          definitions={{
            "#": /[0-9]/,
          }}
          inputRef={ref}
          onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
          overwrite
        />
      );
    },
  );
export default TextMaskCustom;
  
import { forwardRef } from "react";
import { IMaskInput } from "react-imask";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const CurrencyMaskCustom = forwardRef<HTMLInputElement, CustomProps>(
  function CurrencyMaskCustom(props, ref) {
    const { onChange, name, ...other } = props;

    const currencyMask = {
      mask: Number,  // Use the Number mask for cents
      scale: 2,      // Specify the number of decimal places
      signed: false, // Allow negative values if needed
      thousandsSeparator: '.', // Add thousands separator if needed
      padFractionalZeros: true, // Ensure trailing zeros are displayed
      normalizeZeros: true,      // Remove leading zeros
      radix: ',',  // Use a comma as the decimal separator
    };

    return (
      <IMaskInput
        {...other}
        name={name}
        onAccept={(value) => onChange({ target: { name, value } })}
        {...currencyMask}
        inputRef={ref}
      />
    );
  }
);

export default CurrencyMaskCustom;

import * as React from "react";
import { IMaskInput } from "react-imask";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { CountrySelector } from "./CountrySelector";


interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
  }
  
  const TextMaskCustom = React.forwardRef<HTMLElement, CustomProps>(
    function TextMaskCustom(props, ref) {
      const { onChange, mask, ...other } = props as any;
      console.log("other", other);
      const baseMask = "#(000) 0000000";
      return (
        <IMaskInput
          {...other}
          mask={mask || baseMask}
          definitions={{
            "#": /[1-9]/
          }}
          inputRef={ref}
          onAccept={(value: any) =>
            onChange({ target: { name: props.name, value } })
          }
          overwrite
        />
      );
    }
  );

  

interface State {
    textmask: string;
    numberformat: string;
}
  
export default function FormattedInputs() {
    const [values, setValues] = React.useState<State>({
      textmask: "2(100) 000-0000",
      numberformat: "1320"
    });
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({
        ...values,
        [event.target.name]: event.target.value
      });
    };
  
    return (
      <Box
        sx={{
          "& > :not(style)": {
            m: 1
          }
        }}
      >
        <CountrySelector />
        <TextField
          label="react-number-format"
          value={values.textmask}
          onChange={handleChange}
          name="textmask"
          id="formatted-numberformat-input"
          InputProps={{
            inputComponent: TextMaskCustom as any
          }}
        />
      </Box>
    );
}
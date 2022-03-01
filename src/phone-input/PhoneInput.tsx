import * as React from "react";
import { IMaskInput } from "react-imask";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { CountrySelector } from "./CountrySelector";
import { array } from "yargs";


interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
    mask: string;
}
  
const TextMaskCustom = React.forwardRef<HTMLElement, CustomProps>(
    function TextMaskCustom(props, ref) {
      const { onChange, mask, ...other } = props as any;
      console.log("other", other);
      console.log("mask", mask);
      const baseMask = "#(000) 0000000";
      return (
        <IMaskInput
          {...other}
          mask={mask}
          definitions={{
            "#": /[1-90]/
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
    country: React.ComponentProps<typeof CountrySelector>['selected'];
    mask: string;
    value: string;
}
  
export default function FormattedInputs() {
    const [values, setValues] = React.useState<State>({
        value: '',
        mask: "",
        country: 'RU'
    });
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        if(!value.length) {
            value = values.mask.replace(/[#\(\)-]/g, '');
        }
        setValues({
            ...values,
            [event.target.name]: value
        });
    };

    const setMask: React.ComponentProps<typeof CountrySelector>['onChange'] = (mask) => {
        console.log(mask);
        if(Array.isArray(mask)) {

        } else {
            setValues({
              ...values,
              mask: mask,
              value: mask.replace(/#/g, '0')
            });
        }
    }
  
    return (
      <Box
        sx={{
          "& > :not(style)": {
            m: 1
          }
        }}
      >
        <TextField
          label="react-number-format"
          value={values.value}
          onChange={handleChange}
          name="value"
          id="formatted-numberformat-input"
          InputProps={{
            inputComponent: TextMaskCustom as any,
            startAdornment: <CountrySelector selected={values.country} onChange={setMask} />
          }}
          inputProps={{
            mask: values.mask
          }}
        />
      </Box>
    );
}
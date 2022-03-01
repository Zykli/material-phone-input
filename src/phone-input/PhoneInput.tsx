import * as React from "react";
import { IMaskInput } from "react-imask";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { CountrySelector } from "./CountrySelector";
import { array } from "yargs";


interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
    mask: string | string[];
}
  
const TextMaskCustom = React.forwardRef<HTMLElement, CustomProps>(
    function TextMaskCustom(props, ref) {
        const { onChange, mask: incomingMask, ...other } = props as any;
        console.log('mask', incomingMask);
        const baseMask = "#(000) 0000000";
        const definitions = {
            "#": /[1-90]/
        };
        const mask = (Array.isArray(incomingMask) ? incomingMask.map(e => ({
            mask: e,
            definitions
        })) : {
            mask: incomingMask,
            definitions
        }) || baseMask;
        return (
            <IMaskInput
                {...other}
                mask={mask}
                inputRef={ref}
                onAccept={(value: any) => {
                    console.log(value);
                    onChange({ target: { name: props.name, value } })
                }
                }
                overwrite
            />
        );
    }
  );

  

  
export default function FormattedInputs() {

    const [state, setState] = React.useState<{
        value: string;
        mask: string | string[];
    }>({
        value: '',
        mask: ''
    });
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        console.log(value);
        // if(value.length > state.mask.length) {

        // }
        setState({
            ...state,
            value
        });
        // setValue(value);
    };

    const setMask: React.ComponentProps<typeof CountrySelector>['onChange'] = (mask) => {
        console.log(mask);
        if(Array.isArray(mask)) {
            // сортируем по длинне элементов, без вспомогательных знаков
            const shortRegExp = /[\(\)\-]/g;
            const sortedMask = mask.map(e => ({
                mask: e,
                shortMask: e.replace(shortRegExp, '')
            })).sort((a, b) => a.shortMask.length - b.shortMask.length).map(e => e.mask);
            setState({
                ...state,
                mask: sortedMask,
                value: sortedMask[0].replace(/#/g, '0')
            });
        } else {
            setState({
                ...state,
                mask,
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
          value={state.value}
          onChange={handleChange}
          name="value"
          id="formatted-numberformat-input"
          InputProps={{
            inputComponent: TextMaskCustom as any,
            startAdornment: <CountrySelector baseCountry={'RU'} onChange={setMask} />
          }}
          inputProps={{
            mask: state.mask
          }}
        />
      </Box>
    );
}
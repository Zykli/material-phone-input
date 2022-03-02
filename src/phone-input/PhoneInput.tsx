import * as React from "react";
import { IMaskInput } from "react-imask";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { CountrySelector } from "./CountrySelector";


interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
    mask: string | string[];
}
  
const TextMaskCustom = React.forwardRef<HTMLElement, CustomProps>(
    function TextMaskCustom(props, ref) {
        const { onChange, mask: incomingMask, ...other } = props as any;
        const baseMask = "#(000) 0000000";
        const definitions = {
            "#": /[1-90]/
        };
        return (
            <IMaskInput
                {...other}
                mask={(Array.isArray(incomingMask) ? incomingMask.map(e => ({
                    mask: e,
                    definitions
                })) : 
                incomingMask) || baseMask}
                definitions={definitions}
                inputRef={ref as any}
                onAccept={(value) => {
                    onChange({ target: { name: props.name, value: value as string } })
                }
                }
                overwrite
            />
        );
    }
);

let mount = false;
  
export default function FormattedInputs() {

    const ref = React.useRef<HTMLInputElement>();

    const [state, setState] = React.useState<{
        value: string;
        mask: string | string[];
        cursor: number;
    }>({
        value: '',
        mask: '',
        cursor: 0
    });
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        setState({
            ...state,
            value
        });
    };

    const setMask: React.ComponentProps<typeof CountrySelector>['onChange'] = (mask) => {
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
                value: sortedMask[0].replace(/#/g, '0'),
                cursor: sortedMask[0].indexOf('#')
            });
        } else {
            setState({
                ...state,
                mask,
                value: mask.replace(/#/g, '0'),
                cursor: mask.indexOf('#')
            });
        }
    }

    React.useEffect(() => {
        console.log(mount);
        if(mount && ref.current) {
            ref.current.selectionStart = state.cursor;
            ref.current.selectionEnd = state.cursor;
            ref.current.focus();
        }
        if(!mount) mount = true;
    }, [
        state.mask.toString() + state.cursor.toString()
    ]);
  
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
                    startAdornment: <CountrySelector onChange={setMask} />
                }}
                inputProps={{
                    mask: state.mask,
                    ref: ref,
                }}
            />
      </Box>
    );
}
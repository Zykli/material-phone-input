import React, { useEffect } from 'react';
import ctrs from './countries';
import { SelectUnstyled } from '@mui/base';
// import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { List, AutoSizer } from 'react-virtualized';
import Button, { buttonClasses } from '@mui/material/Button';
import { Box } from '@mui/material';


const countries = ctrs.map(e => {
    let flag = `https://flagcdn.com/${e.iso.toLowerCase()}.svg`;
    if(e.name === 'Netherlands Antilles') {
        flag = `https://flagcdn.com/nl.svg`;
    }
    return {
        ...e,
        flag 
    }
});

(window as any).countries = countries

interface Props {
    selected: typeof countries[number]['iso'];
    onChange: (mask: string | string[]) => void;
}

export const CountrySelector: React.FC<Props> = ({
    selected,
    onChange
}) => {

    const [ image, setImage ] = React.useState<typeof countries[number]['flag'] | null>(null);

    React.useEffect(() => {
        const item = countries.find((e) => e.iso === selected);
        if(item) setImage(item.flag)
    }, [selected]);
    
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                size="small"
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                    minWidth: 54,
                    [`& .${buttonClasses.endIcon}`]: {
                        ml: 0
                   }
                }}
                
            >
                {image && <img src={image} style={{width: 30, height: 20}} />}
            </Button>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <List 
                    height={200}
                    rowCount={countries.length}
                    rowHeight={32}
                    width={300}
                    rowRenderer={({ index, key, style }) => {
                        const data = countries[index];
                        return (
                            <MenuItem
                                key={key}
                                style={style}
                                onClick={() => {
                                    setImage(data.flag);
                                    if(Array.isArray(data.mask)) {
                                        onChange(data.mask.map(el => `${data.code} ${el}`));
                                    } else {
                                        onChange(`${data.code} ${data.mask}`);
                                    }
                                    handleClose();
                                }}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start'
                                }}
                                title={data.name}
                            >
                                <Box sx={{mr: 1}}>
                                    <img src={data.flag} style={{width: 30, height: 20}} />
                                </Box>
                                <span style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {data.name}
                                </span>
                            </MenuItem>
                        )
                    }}
                />
            </Menu>
        </div>
    )
}
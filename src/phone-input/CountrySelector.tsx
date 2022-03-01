import React from 'react';
import ctrs from './countries';

const countries = ctrs.map(e => {
    let flag = `https://flagcdn.com/${e.iso.toLowerCase()}.svg`;
    if(e.name === 'Netherlands Antilles') {
        flag = `https://flagcdn.com/nl.svg`;
    }
    return {
        ...e, flag 
    }
});

interface Props {
    // selected: typeof countries[number]['iso'];

}

export const CountrySelector: React.FC<Props> = ({

}) => {
    return (
        <div>
            {
                countries.map((e, idx) => {
                    return <>
                    {idx}
                        <img src={e.flag} style={{width: 30, height: 20}} />
                    </>
                })
            }
        </div>
    )
}
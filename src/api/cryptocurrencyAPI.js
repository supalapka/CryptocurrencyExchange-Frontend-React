import { cryptoSymbol } from "crypto-symbol";

const { nameLookup } = cryptoSymbol({});


export const cryptocurrencyAPI = {

    getImage(symbol){
        return 'https://cryptologos.cc/logos/' + this.getName(symbol).toLowerCase() + '-' + symbol.toLowerCase() + '-logo.png';
    },

    getName(symbol){
        return nameLookup(symbol, toString(), { exact: true });
    },
}
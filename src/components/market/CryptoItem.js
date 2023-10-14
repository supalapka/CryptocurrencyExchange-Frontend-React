import React from "react";
import { cryptoSymbol } from "crypto-symbol";

const { nameLookup } = cryptoSymbol({});

const CryptoItem = ({ coin }) => {
    const name = nameLookup(coin.symbol.slice(0, -4), { exact: true });
    const imageUrl = `https://cryptologos.cc/logos/${name.toLowerCase()}-${coin.symbol.slice(0, -4).toLowerCase()}-logo.png`;

    return (
        <tr>
            <td>
                <a href={`/market/${coin.symbol.slice(0, -4).toLowerCase()}`}>
                    <div className="currency-name">
                        <img alt="logo" src={imageUrl}></img>{" "}
                        <p>
                            {name}{" "}
                            <span className="small-symbol">
                                {" "}
                                ({coin.symbol.slice(0, -4)}){" "}
                            </span>{" "}
                        </p>
                    </div>
                </a>
            </td>
            <td>
                <p> ${parseFloat(coin.price).toFixed(2)}</p>
            </td>
            <td>
                <p className={coin.change > 0 ? "positive" : "negative"}>
                    {parseFloat(coin.change).toFixed(2)}%
                </p>
            </td>
        </tr>
    );
};

export { CryptoItem };

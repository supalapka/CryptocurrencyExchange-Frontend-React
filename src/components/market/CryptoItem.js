import React from "react";
import styles from "../../css/market.module.css";
import { Link } from "react-router-dom";
import { cryptocurrencyAPI } from "../../api/cryptocurrencyAPI";


const CryptoItem = ({ coin }) => {
    const name = cryptocurrencyAPI.getName(coin.symbol.slice(0, -4));
    const imageUrl = cryptocurrencyAPI.getImage(coin.symbol.slice(0, -4));

    return (
        <tr>
            <td>
                <Link to={`/market/${coin.symbol.slice(0, -4).toLowerCase()}`}>
                    <div className={styles.currencyName}>
                        <img alt="logo" className={styles.image} src={imageUrl}></img>
                        <p> {name}
                            <span className={styles.smallSymbol}>
                                ({coin.symbol.slice(0, -4)})
                            </span>
                        </p>
                    </div>
                </Link>
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

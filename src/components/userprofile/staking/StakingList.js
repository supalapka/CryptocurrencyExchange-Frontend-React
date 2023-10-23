import React from "react";
import styles from "../../../css/profile/wallet.module.css"


function StakingList({ stakings }) {
    return (
        <tbody>
            {stakings.map((coin) => (
                <tr key={coin.id}>
                    <td>
                        <div className={styles.logoWithName}>
                            <img src={coin.image} alt="logo" />
                            <p> {coin.name} </p>
                            <span> ({coin.stakingCoin.symbol.toUpperCase()})</span>
                        </div>
                    </td>
                    <td>{coin.amount}</td>
                    <td>{coin.durationInMonth} Month</td>
                    <td>{(coin.stakingCoin.ratePerMonth * 12).toFixed(2)}%</td>
                    <td className="positive">{(coin.stakingCoin.ratePerMonth * coin.durationInMonth).toFixed(2)}%
                    <span className={styles.profitInCoins}>
                    (+{((coin.amount / 100) * (coin.stakingCoin.ratePerMonth * coin.durationInMonth)).toFixed(4)} {coin.stakingCoin.symbol.toUpperCase()}) 
                    </span>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}


export default StakingList;

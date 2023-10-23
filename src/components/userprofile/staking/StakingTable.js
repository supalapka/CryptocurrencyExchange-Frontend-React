import React from "react";
import styles from "../../../css/profile/wallet.module.css"
import StakingList from "./StakingList";


function StakingTable({ stakings }) {
    return (
        <div className={`${styles.content} default-bg`}>
            <table className={styles.walletTable}>
                <thead>
                    <tr>
                        <th>Coin</th>
                        <th>Amount</th>
                        <th>Period</th>
                        <th>Rate Per Year</th>
                        <th>Profit Per Period</th>
                    </tr>
                </thead>
                {/* tbody */}
                <StakingList stakings={stakings} />
            </table>
        </div>
    );
}


export default StakingTable;

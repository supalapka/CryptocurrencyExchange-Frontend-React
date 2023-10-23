import React from "react";
import styles from "../../css/staking.module.css"
import { wallet, stakingAPI, market } from "../../api/api";

import { cryptocurrencyAPI } from "../../api/cryptocurrencyAPI";


class CoinCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userCoinAmount: 0,
            inputCoinValue: 0,
            inputStakeDurationInMonth: 1,
            coinPrice: 0,
            stakingMonthRate: 0,
            coinImage: '',
            coinName: '',
        };
    }


    handleStakeAmountChange = (e) => {
        this.setState({ inputCoinValue: e.target.value});
    };

    handleStakeDurationChange = (e) => {
        this.setState({ inputStakeDurationInMonth: e.target.value });
    };

    componentDidMount() {
        this.fetchData();
        this.setState({ stakingMonthRate: this.props.coin.ratePerMonth });
        const name =  cryptocurrencyAPI.getName(this.props.coin.symbol);
        const imageUrl = cryptocurrencyAPI.getImage(this.props.coin.symbol);

        this.setState({ coinName: name });
        this.setState({ coinImage: imageUrl });
    }

    async fetchData() {
        try {
            const coinAmount = await wallet.getCoinAmount(this.props.coin.symbol);
            this.setState({ userCoinAmount: coinAmount });

            const coinPriceRespone = await market.getCoinPrice(this.props.coin.symbol);
            this.setState({ coinPrice: coinPriceRespone.data });
        } catch (error) { console.log(error); }
    }

    async stake() {
        if (this.state.inputCoinValue === 0) {
            alert("Fill the data");
            return;
        }
        let duration = 1;
        if (this.state.inputStakeDurationInMonth == 4) // 4 option = 1year
            duration = 12;
        else if (this.state.inputStakeDurationInMonth == 3)
            duration = 6;// 3 option = 6 month
        else if (this.state.inputStakeDurationInMonth == 2)
            duration = 3;// 3 option = 6 month

        await stakingAPI.createStaking(this.props.coin.id, this.state.inputCoinValue, duration);
    }

    render() {
        return (
            <div className={`${styles.coinCard} default-bg`}>
                <div className={`${styles.cardTopInfo} ${styles.row}`}>
                    <div className={`${styles.rightInfo} ${styles.row}`}>
                        <div>
                            <p className={styles.greyInfo}> Your {this.props.coin.symbol} to stake </p>
                            <span> {this.state.inputCoinValue} </span>
                        </div>
                        <div>
                            <p className={styles.greyInfo}> USD Value </p>
                            <span> ${(this.state.inputCoinValue * this.state.coinPrice).toFixed(2)}</span>
                        </div>
                    </div>
                    <div className={`${styles.coinInfo} ${styles.row}`}>
                        <img alt="logo" className={styles.logoImg} src={this.state.coinImage} />
                        <div>
                            <p>{this.state.coinName}</p>
                            <span className={styles.greyInfo}>~{(this.state.stakingMonthRate * 12).toFixed(2)}% Per Year</span>
                        </div>
                    </div>
                </div>
                <input className={styles.slider} type="range" min="0" max={this.state.userCoinAmount} step="0.001" onChange={this.handleStakeAmountChange} />
                <br />
                <br />
                <input className={styles.slider} type="range" min="1" max="4" step="1" onChange={this.handleStakeDurationChange} value={this.state.inputStakeDurationInMonth} />
                <div className={styles.rangeLabels}>
                    <span>1M</span>
                    <span>3M</span>
                    <span>6M</span>
                    <span>1Y</span>
                </div>
                <p className={styles.description}> {this.props.coin.description}</p>
                <div className={`${styles.calculatedInfoBottom} ${styles.row}`}>
                    <div>
                        <p className={`${styles.greyInfo} ${styles.marginTop}`}> Weekly Profit</p>
                        <p className={styles.marginTop}>${((this.state.inputCoinValue * this.state.coinPrice) / 100 * (this.state.stakingMonthRate / 4)).toFixed(2)}</p>
                    </div>
                    <div>
                        <p className={`${styles.greyInfo} ${styles.marginTop}`}> Monthly Profit </p>
                        <p className={styles.marginTop}>${((this.state.inputCoinValue * this.state.coinPrice) / 100 * (this.state.stakingMonthRate)).toFixed(2)}</p>
                    </div>
                </div>
                <div className={`${styles.calculatedInfoBottom} ${styles.row}`}>
                    <div>
                        <p className={`${styles.greyInfo} ${styles.marginTop}`}> Annual Profit</p>
                        <p className={styles.marginTop}>${((this.state.inputCoinValue * this.state.coinPrice) / 100 * (this.state.stakingMonthRate * 12)).toFixed(2)}</p>
                    </div>
                    <div>
                        <p className={`${styles.greyInfo} ${styles.marginTop}`}> % per month</p>
                        <p className={styles.marginTop}> ~{(this.state.stakingMonthRate).toFixed(2)}%</p>
                    </div>
                </div>
                <div className={styles.buttonsBlock}>
                    <button className={styles.btn}>Buy</button>
                    <button className={styles.btn} onClick={() => this.stake()} disabled={this.state.userCoinAmount === 0}>Stake</button>
                </div>
            </div>
        );
    }
}

export default CoinCard;
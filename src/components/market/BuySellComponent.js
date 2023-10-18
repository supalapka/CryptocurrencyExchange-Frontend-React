import React from "react";
import styles from "../../css/coinpage.module.css";
import { wallet } from "../../api/api"

class BuySellComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userBalance: {
                usdt: 0,
                coin: 0,
            },
            inputCoin: 0,
            inputUsdt: 0,
        };
        this.sell = this.sell.bind(this);
        this.buy = this.buy.bind(this);

    }


    handleCoinAmountChange = (e) => {
        this.setState({ inputCoin: e.target.value / 1000 });
    }

    handleUsdtAmountChange = (e) => {
        this.setState({ inputUsdt: e.target.value / 1000 });
    }

    async componentDidMount() {
        await this.updateBalance();
    }

    async sell() {
        await wallet.sell(this.props.symbol, this.state.inputCoin)
        this.updateBalance();
        this.setState({ inputCoin: 0 });
    }

    async buy() {
        await wallet.buy(this.props.symbol, this.state.inputUsdt)
        this.updateBalance();
        this.setState({ inputUsdt: 0 });

    }

    async updateBalance() {
        const userBalanceFetch = {
            usdt: await wallet.getCoinAmount("usdt"),
            coin: await wallet.getCoinAmount(this.props.symbol),
        }
        this.setState({ userBalance: userBalanceFetch });
    }

    render() {
        return (
            <div >
                <div className={styles.userActions}>
                    <div className={styles.formInput}>
                        <input type="range" className={styles.buySellSlider} min="0" max={this.state.userBalance.usdt * 1000} onChange={this.handleUsdtAmountChange} />
                        <div className={styles.rangeLabels}>
                            <span >0%</span>
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span>100%</span>
                        </div >
                        <div className={styles.btnBlock}>
                            <button className={`${styles.actionBtn} green`} onClick={this.buy}>Buy {this.props.symbol}</button>
                            {this.state.inputUsdt > 0 && <p>{this.state.inputUsdt} USDT = {(this.state.inputUsdt / this.props.price).toFixed(3)}
                                {this.props.symbol} </p>}
                        </div>
                    </div>
                    <br /> <br />
                    <div className={styles.formInput}>
                        <input type="range" className={styles.buySellSlider} min="0" max={this.state.userBalance.coin * 1000} onChange={this.handleCoinAmountChange} />
                        <div className={styles.rangeLabels}>
                            <span >0%</span>
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span>100%</span>
                        </div >
                        <div className={styles.btnBlock}>
                            <button className={`${styles.actionBtn} red`} onClick={this.sell}>Sell {this.props.symbol}</button>
                            {this.state.inputCoin > 0 && <p>{this.state.inputCoin} {this.props.symbol} = {
                                (this.state.inputCoin * this.props.price).toFixed(2)} USDT</p>}
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default BuySellComponent;

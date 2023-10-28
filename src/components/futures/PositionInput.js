import React from "react";
import styles from "../../css/futures/futures.module.css";
import { wallet, futures } from "../../api/api";


class PositionInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userUsdBalance: 0,
            leverage: 1,
            positionAmount: 0,
            long: 0,
            short: 1,
            price: 34100.66,
            symbol: 'BTCUSDT',
        };
        this.handleLeverageChange = this.handleLeverageChange.bind(this);
        this.handlePositionChange = this.handlePositionChange.bind(this);
        this.openLong = this.openLong.bind(this);
        this.openShort = this.openShort.bind(this);

    }


    async componentDidMount() {
        await this.updateUserBalance();
    }


    async updateUserBalance() {
        this.setState({ userUsdBalance: await wallet.getCoinAmount("usdt") })
    }

    handleLeverageChange(event) {
        this.setState({ leverage: event.target.value })
    }

    handlePositionChange(event) {
        this.setState({ positionAmount: event.target.value })
    }

    async openPosition(position) {
        this.setState({positionAmount: 0});
        const responce = await futures.openPosition(position.symbol, position.margin,
            position.leverage, position.entryPrice, position.position);

        if (position.position === 0)
            position.position = 'Long'
        else
            position.position = 'Short'

        position.id = responce.data;
        this.props.addPosition(position);

        await this.updateUserBalance();
    }

    async openShort() {
        const position = {
            symbol: this.props.symbol,
            margin: this.state.positionAmount,
            leverage: this.state.leverage,
            entryPrice: this.props.price,
            position: this.state.short,
        }

        this.openPosition(position);
    }

    async openLong() {
        const position = {
            symbol: this.props.symbol,
            margin: this.state.positionAmount,
            leverage: this.state.leverage,
            entryPrice: this.props.price,
            position: this.state.long,
        }

        this.openPosition(position);
    }


    render() {
        return (
            <div className={styles.inputContainer} >
                <p className={`${styles.walletInfo} ${styles.flexRight}`}><span className={styles.greyInfo}>Avbl: </span> {this.state.userUsdBalance} USDT</p>
                <input className={styles.inputSlider} onChange={this.handlePositionChange}
                    type="range" min={0} max={this.state.userUsdBalance} value={this.state.positionAmount} step={0.01} />

                <div className={styles.leverageContainer}>
                    <input className={styles.inputSlider} onChange={this.handleLeverageChange}
                        type="range" min={1} max={100} step={1} value={this.state.leverage} />
                    <p>  <span className={styles.greyInfo}>Leverage:</span> {this.state.leverage}x</p>
                </div>

                <div className={styles.row}>
                    <button className={`${styles.btn} ${styles.green}`} onClick={this.openLong}>Buy/Long</button>
                    <button className={`${styles.btn} ${styles.red}`} onClick={this.openShort}>Sell/Short</button>
                </div>

                <div className={styles.flexRight}>
                    <p> <span className={styles.greyInfo}>Cost:</span> {this.state.positionAmount} USDT </p>
                    <p> <span className={styles.greyInfo}> Position: </span> {(this.state.positionAmount * this.state.leverage).toFixed(2)} USDT </p>
                </div>


            </div>

        );
    }
}

export default PositionInput;

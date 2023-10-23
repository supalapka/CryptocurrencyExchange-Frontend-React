import React from "react";
import styles from "../../css/coinpage.module.css";
import PriceChart from "../chart/PriceChart";
import BuySellComponent from "./BuySellComponent";
import { cryptocurrencyAPI } from "../../api/cryptocurrencyAPI";


class CoinPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeFrame: "1h",
            symbol: (window.location.href.split('/')[4].toUpperCase()), //get symbol from url param
            name: "",
            image: "",
            price: 0,
            changes24: 0,
            userBalance: {
                usdt: 0,
                coin: 0,
            },
            inputCoin: 0,
            inputUsdt: 0,
        };
    }

    handleButtonClick = (timeframe) => {
        this.setState({ timeFrame: timeframe });
    }
    

    handleCoinAmountChange = (e) => {
        this.setState({ inputCoin: e.target.value / 1000 });
    }


    handleUsdtAmountChange = (e) => {
        this.setState({ inputUsdt: e.target.value / 1000 });
    }


    async componentDidMount() {
        this.openWebSocket(`wss://stream.binance.com:9443/ws/${this.state.symbol.toLowerCase()}usdt@ticker`);
        const name = cryptocurrencyAPI.getName(this.state.symbol);
        const imageUrl = cryptocurrencyAPI.getImage(this.state.symbol);
        
        this.setState({ name: name });
        this.setState({ image: imageUrl });
    }


    openWebSocket(url) {
        const ws = new WebSocket(url);
        ws.onopen = () => {
            console.log("WebSocket connected");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.setState({ price: data.c });
            this.setState({ changes24: data.P });
        };

        ws.onclose = () => {
            console.log("WebSocket closed");
        };

        this.setState({ ws });
    }

    render() {
        return (
            <div >
                <div>
                    <div className={styles.chartTopPanel}>
                        <p>{this.state.symbol}/USDT</p>
                        <button onClick={() => this.handleButtonClick("1h")}>1h</button>
                        <button onClick={() => this.handleButtonClick("4h")}>4h</button>
                        <button onClick={() => this.handleButtonClick("1d")}>1d</button>
                        <button onClick={() => this.handleButtonClick("1w")}>1w</button>
                        <button onClick={() => this.handleButtonClick("1M")}>1M</button>
                    </div>
                    <div className={styles.chart}>
                        <PriceChart coinSymbol={this.state.symbol} timeFrame={this.state.timeFrame} />
                    </div>
                </div>

                <div className={styles.cryptoInfo}>
                    <img alt="logo" className={styles.image} src={this.state.image} />
                    <div className={styles.coinInfo}>
                        <h2>{this.state.name} ${parseFloat(this.state.price).toFixed(2)}</h2>
                        <p>24h Volume(USDT):  $ EDIT</p>
                        <p>24h Changes:
                            {this.state.changes24 > 0 && <span className="positive"> {this.state.changes24}% </span>}
                            {this.state.changes24 < 0 && <span className="negative"> {this.state.changes24}% </span>}
                        </p>
                    </div>
                    <BuySellComponent symbol={this.state.symbol} price={this.state.price} />
                </div>
            </div>
        );
    }
}

export default CoinPage;

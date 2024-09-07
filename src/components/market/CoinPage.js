import React from "react";
import styles from "../../css/coinpage.module.css";
import PriceChart from "../chart/PriceChart";
import BuySellComponent from "./BuySellComponent";
import { cryptocurrencyAPI } from "../../api/cryptocurrencyAPI";
import { BWebSocket } from "../../api/binanceWebSocketService"


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
            volume24: 0,
            binanceWebsocket: new BWebSocket(),
        };
        this.updatePrice = this.updatePrice.bind(this);
    }


    async componentDidMount() {
        const url = `wss://stream.binance.com:9443/ws/${this.state.symbol.toLowerCase()}usdt@ticker`;
        this.state.binanceWebsocket.openWebSocket(url, this.updatePrice, "Coin page");

        const name = cryptocurrencyAPI.getName(this.state.symbol);
        const imageUrl = cryptocurrencyAPI.getImage(this.state.symbol);

        this.setState({ name: name });
        this.setState({ image: imageUrl });
    }

    componentWillUnmount() {
        this.state.binanceWebsocket.closeWebSocket();
    }


    updatePrice(data) {
        console.log(data);

        this.setState({ price: data.c });
        this.setState({ changes24: data.P });
        const parsedValue = parseFloat(data.q);
        this.setState({ volume24: parsedValue.toLocaleString() });
    }



    render() {
        return (
            <div >
                <div>
                    <div className={styles.chart}>
                        <PriceChart coinSymbol={this.state.symbol} timeFrame={this.state.timeFrame} />
                    </div>
                </div>

                <div className={styles.cryptoInfo}>
                    <img alt="logo" className={styles.image} src={this.state.image} />
                    <div className={styles.coinInfo}>
                        <h2>{this.state.name} ${parseFloat(this.state.price).toFixed(2)}</h2>
                        <p>24h Volume: {this.state.volume24} USDT</p>
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

import React from "react";
import styles from "../../css/futures/futures.module.css";
import { allCryptoSymbols } from "../../utils"
import { BWebSocket } from "../../api/binanceWebSocketService"



class CoinList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialCoins: allCryptoSymbols.slice(0, 12),
            coins: allCryptoSymbols.slice(0, 12).map((symbol) => ({ symbol })),
            binanceWebsocket: new BWebSocket(),
        };

        this.updatePrice = this.updatePrice.bind(this);
    }

    componentDidMount() {
        const url = this.state.binanceWebsocket.getUrlConnectionByCoins(this.state.initialCoins);
        this.state.binanceWebsocket.openWebSocket(url, this.updatePrice, "Futures coin list");
    };

    componentWillUnmount(){
        this.state.binanceWebsocket.closeWebSocket();
    }


    updatePrice(data) {
        var index = this.state.coins.findIndex(
            (coin) => coin.symbol === data.s
        );
        if (index === -1) return;

        const updatedCryptocurrency = { ...this.state.coins[index] };
        updatedCryptocurrency.price = data.c;
        updatedCryptocurrency.change = data.P;

        const updatedCoins = [...this.state.coins];
        updatedCoins[index] = updatedCryptocurrency;

        if (this.props.currentSymbol === data.s)
            this.props.updateCurrPrice(data.c);

        this.setState({ coins: updatedCoins });
    }


    render() {

        return (
            <table className={styles.listtable} >

                <thead>
                    <tr >
                        <th>Name</th>
                        <th>Price</th>
                        <th>24h changes</th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.coins.map((coin) => (
                        <tr key={coin.symbol} className={styles.tableRow}
                            onClick={() => {
                                this.props.updateCurrentSymbol(coin.symbol);
                                this.props.updateCurrPrice(coin.price)
                            }} >
                            <td>{coin.symbol}</td>
                            <td> ${
                                parseFloat(coin.price) < 1
                                    ? parseFloat(coin.price).toFixed(4)
                                    : parseFloat(coin.price).toFixed(2)
                            } </td>
                            <td className='positive'>
                                {parseFloat(coin.change).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}

export default CoinList;

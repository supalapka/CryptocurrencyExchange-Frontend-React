import React from "react";
import styles from "../../css/futures/positions.module.css";
import { Link } from "react-router-dom";
import { futures, calculatePercentChange } from "../../api/api";
import { BWebSocket } from "../../api/binanceWebSocketService";

class OpenedPositions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            positions: [],
        };
        this.updatePositionStateCallback = this.updatePositionStateCallback.bind(this);
    }

    componentDidMount() {
        this.setState({ positions: this.props.positions });

        const symbols = this.props.positions.map(position => position.symbol);
        const uniqueSymbols = symbols.filter((symbol, index, array) => {// remove duplicates
            return array.indexOf(symbol) === index;
        });
        const wbUrl = BWebSocket.getUrlConnectionByCoins(uniqueSymbols);
        BWebSocket.openWebSocket(wbUrl, this.updatePositionStateCallback, "opened positions");
    }


    componentDidUpdate(prevProps) {
        if (this.props.positions !== prevProps.positions) {
            BWebSocket.closeWebSocket(); //close old ws

            this.setState({ positions: this.props.positions });
            const symbols = this.props.positions.map(position => position.symbol);
            const uniqueSymbols = symbols.filter((symbol, index, array) => {// remove duplicates
                return array.indexOf(symbol) === index;
            });

            const wbUrl = BWebSocket.getUrlConnectionByCoins(uniqueSymbols);
            BWebSocket.openWebSocket(wbUrl, this.updatePositionStateCallback, "opened positions");
        }
    }


    updatePositionStateCallback(data) {
        this.setState(prevState => ({
            positions: prevState.positions.map(position => {
                if (position.symbol === data.s) {
                    const updatedPosition = { ...position };
                    updatedPosition.currentPrice = data.c;

                    updatedPosition.percentChange = calculatePercentChange(
                        updatedPosition.currentPrice,
                        updatedPosition.entryPrice,
                        updatedPosition.leverage,
                        updatedPosition.position
                    );

                    updatedPosition.usdtPNL = (
                        updatedPosition.margin * (updatedPosition.percentChange / 100)
                    ).toFixed(2);

                    return updatedPosition;
                }
                return position;
            })
        }));
    }

    async closePosition(id, pnl, markprice){
        console.log(`clothing ${id} positions`);
        await futures.closePosition(id, pnl, markprice);

        this.props.removePosition(id);
    }



    render() {
        const positionElements = this.state.positions.map((position) => (
            <tr key={position.id} className={styles.positionsRow}>
                <td><Link to={`/futures/${position.symbol}`}> {position.symbol}</Link></td>
                <td><span className={`${position.position === 'Long' ? 'positive' : 'negative'}`}
                >{position.position}</span><span className={styles.leverage}>{position.leverage}x</span></td>
                <td> ${
                    parseFloat(position.entryPrice) < 1
                        ? parseFloat(position.entryPrice).toFixed(4)
                        : parseFloat(position.entryPrice).toFixed(2)
                } </td>
                <td> ${
                    parseFloat(position.currentPrice) < 1
                        ? parseFloat(position.currentPrice).toFixed(4)
                        : parseFloat(position.currentPrice).toFixed(2)
                } </td>
                <td>{position.margin} USDT</td>
                <td className={`${position.percentChange >= 0 ? 'positive' : 'negative'}`}
                >{position.percentChange}% <p>({position.usdtPNL} USDT) </p></td>
                <td className={styles.btn}
                 onClick={()=> this.closePosition(position.id, position.usdtPNL, position.currentPrice)}
                 >Close</td>
            </tr>
        ));


        return (
            <table className={styles.positionsTable}>
                <thead className={styles.header}>
                    <tr>
                        <th>Trading Pair</th>
                        <th>Position</th>
                        <th>Entry Price</th>
                        <th>Current Price	</th>
                        <th>Margin</th>
                        <th>PNL</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {positionElements}
                </tbody>
            </table>
        );
    }
}

export default OpenedPositions;

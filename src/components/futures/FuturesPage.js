import React from "react";
import styles from "../../css/futures/futures.module.css";
import PriceChart from "../chart/PriceChart";
import CoinList from "./CoinList";
import PositionInput from "./PositionInput";
import PositionHistory from "./PositionHistory";
import OpenedPositions from "./OpenedPositions";
import { futures } from "../../api/api";


class FuturesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSymbol: "BTCUSDT",
            currentPrice: 31000,
            openedPositions: [],
            isHistoryTabActivated: false,
        };
        this.disableHistoryTab = this.disableHistoryTab.bind(this);
        this.enableHistoryTab = this.enableHistoryTab.bind(this);
        this.addPosition = this.addPosition.bind(this);
        this.updateCurrentPrice = this.updateCurrentPrice.bind(this);
        this.updateCurrentSymbol = this.updateCurrentSymbol.bind(this);
        this.removePosition = this.removePosition.bind(this);

        this.inputRef = React.createRef();
    }

    async componentDidMount() {
        const fetchedPositions = await futures.getOpenedPositions();
        this.setState({ openedPositions: fetchedPositions });
    }

    disableHistoryTab() {
        this.setState({ isHistoryTabActivated: false });
    }

    enableHistoryTab() {
        this.setState({ isHistoryTabActivated: true });
    }

    addPosition(newPosition) {
        this.setState({ openedPositions: [...this.state.openedPositions, newPosition] });
    }

    updateCurrentPrice(price) {
        this.setState({ currentPrice: price });
    }

    updateCurrentSymbol(symbol) {
        this.setState({ currentSymbol: symbol });
    }

    removePosition(id) {
        const index = this.state.openedPositions.findIndex((item) => item.id === id);
            const updatedPositions = [...this.state.openedPositions];
            updatedPositions.splice(index, 1);

            this.setState({ openedPositions: updatedPositions });

            this.inputRef.current.updateUserBalance();
    }

    render() {
        const positionsTable = this.state.isHistoryTabActivated ? <PositionHistory />
            : <OpenedPositions positions={this.state.openedPositions}
                removePosition={this.removePosition} />;

        return (
            <div>

                <div className={styles.row}>
                    <div className={styles.chart}>
                        <PriceChart coinSymbol={this.state.currentSymbol.slice(0, -4)} timeFrame="4h" />
                    </div>

                    <div >
                        <div className={styles.coinList}>
                            <CoinList currentSymbol={this.state.currentSymbol} updateCurrPrice={this.updateCurrentPrice}
                                updateCurrentSymbol={this.updateCurrentSymbol} />
                        </div>

                        <div className={styles.input}>
                            <PositionInput addPosition={this.addPosition} symbol={this.state.currentSymbol}
                                price={this.state.currentPrice} ref={this.inputRef}/>
                        </div>
                    </div>

                </div>

                <div className={`${styles.positions} `}>
                    <h2 onClick={this.disableHistoryTab}>Positions</h2>
                    <h2 onClick={this.enableHistoryTab}>History</h2>
                    {positionsTable}
                </div>
            </div>


        );
    }
}

export default FuturesPage;

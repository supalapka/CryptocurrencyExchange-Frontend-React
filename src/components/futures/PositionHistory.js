import React from "react";
import styles from "../../css/futures/positions.module.css";
import { Link } from "react-router-dom";


import { futures } from "../../api/api";

class PositionHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            positions: [],
            page: 0,
            canMoveToNextPage: true,
        };
        this.loadMorePositions = this.loadMorePositions.bind(this);
    }

    async componentDidMount() {
        await this.loadMorePositions();
    }

    async loadMorePositions() {
        if (!this.state.canMoveToNextPage)
            return;
        const nextPage = this.state.page + 1;
        this.setState({ page: nextPage });
        const newPositions = await futures.getFuturesHistory(nextPage);

        const mergedArray = [...this.state.positions, ...newPositions];
        this.setState({ positions: mergedArray });

        if (newPositions.length < 5)
            this.setState({ canMoveToNextPage: false });
    }


    render() {
        const totalPNL = this.state.positions.reduce((acc, position) => acc + parseFloat(position.usdtPNL), 0);

        const positionElements = this.state.positions.map((position) => (
            <tr className={styles.positionsRow}>
                <td><Link to={`/futures/${position.symbol}`}> {position.symbol}</Link></td>
                <td><span className={`${position.position === 'Long' ? 'positive' : 'negative'}`}
                >{position.position}</span><span className={styles.leverage}>{position.leverage}x</span></td>
                <td>${position.entryPrice}</td>
                <td>${position.markPrice}</td>
                <td>{position.margin} USDT</td>
                <td className={`${position.percentChange > 0 ? 'positive' : 'negative'}`}
                >{position.percentChange}% ({position.usdtPNL} USDT)</td>
                <td>{position.action}</td>
            </tr>
        ));


        return (
            <div className={styles.overflow}>
                <table className={styles.positionsTable}>
                    <thead className={styles.header}>
                        <tr>
                            <th>Trading Pair</th>
                            <th>Position</th>
                            <th>Entry Price</th>
                            <th>Mark Price	</th>
                            <th>Margin</th>
                            <th>PNL</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {positionElements}
                    </tbody>
                </table>

                <div className={styles.row}>
                    <button className={styles.showMoreBtn} onClick={this.loadMorePositions}
                    >Show more</button>
                    <p className={styles.pnlInfo}>PnL for last {this.state.positions.length} positions: <span className={`${totalPNL >= 0 ? 'positive' : 'negative'}`}>
                        ${totalPNL.toFixed(2)}
                    </span> </p>
                </div>
            </div>
        );
    }
}

export default PositionHistory;

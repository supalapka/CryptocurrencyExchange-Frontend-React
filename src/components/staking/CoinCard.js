import React from "react";
import "../../css/staking.css"
import axios from "axios";

import { cryptoSymbol } from "crypto-symbol";
const { nameLookup } = cryptoSymbol({});

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
        this.setState({ inputCoinValue: e.target.value / 1000 });
    };

    handleStakeDurationChange = (e) => {
        this.setState({ inputStakeDurationInMonth: e.target.value });
    };

    componentDidMount() {
        this.fetchData();
        this.setState({ stakingMonthRate: this.props.coin.ratePerMonth });
        const name = nameLookup(this.props.coin.symbol, { exact: true });
        const imageUrl = "https://cryptologos.cc/logos/" + name.toLowerCase()
            + "-" + this.props.coin.symbol.toLowerCase() + "-logo.png";

        this.setState({ coinName: name });
        this.setState({ coinImage: imageUrl });
    }

    async fetchData() {
        try {
            const response = await axios.get(`https://localhost:44363/auth/coin-amount/${this.props.coin.symbol}`);
            this.setState({ userCoinAmount: response.data });
            console.log(response.data);

            const response2 = await axios.get(`https://localhost:44363/market/price/${this.props.coin.symbol}`);
            this.setState({ coinPrice: response2.data });
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


        axios.post(`https://localhost:44363/staking/create`, {
            stakingCoinId: this.props.coin.id,
            amount: this.state.inputCoinValue,
            durationInMonth: duration,
        });
    }

    render() {
        return (
            <div className="coin-card default-bg">

                <div className="card-top-info row">

                    <div className="right-info row">
                        <div>
                            <p className="grey-info"> Your {this.props.coin.symbol} to stake </p>
                            <span> {this.state.inputCoinValue} </span>
                        </div>
                        <div>
                            <p className="grey-info"> USD Value </p>
                            <span> ${(this.state.inputCoinValue * this.state.coinPrice).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="coin-info row">
                        <img alt="logo" className="logo-img" src={this.state.coinImage} />
                        <div>
                            <p>{this.state.coinName}</p>
                            <span className="grey-info">~{(this.state.stakingMonthRate * 12).toFixed(2)}% Per Year</span>
                        </div>
                    </div>
                </div>

                <input type="range" min="0" max={this.state.userCoinAmount * 1000} onChange={this.handleStakeAmountChange} />
                <br />
                <br />

                <input type="range" min="1" max="4" step="1" onChange={this.handleStakeDurationChange} value={this.state.inputStakeDurationInMonth} />
                <div class="range-labels">
                    <span >1M</span>
                    <span>3M</span>
                    <span>6M</span>
                    <span>1Y</span>
                </div >

                <p className="description"> {this.props.coin.description}</p>

                <div className=" calculated-info-bottom row">
                    <div>
                        <p className="grey-info margin-top"> Weekly Profit</p>
                        <p className="margin-top">${((this.state.inputCoinValue * this.state.coinPrice) / 100 * (this.state.stakingMonthRate / 4)).toFixed(2)}</p>
                    </div>

                    <div>
                        <p className="grey-info margin-top"> Monthly Profit </p>
                        <p className="margin-top">${((this.state.inputCoinValue * this.state.coinPrice) / 100 * (this.state.stakingMonthRate)).toFixed(2)}</p>
                    </div>
                </div>

                <div className="calculated-info-bottom row">
                    <div>
                        <p className="grey-info margin-top"> Annual Profit</p>
                        <p className="margin-top">${((this.state.inputCoinValue * this.state.coinPrice) / 100 * (this.state.stakingMonthRate * 12)).toFixed(2)}</p>
                    </div>

                    <div>
                        <p className="grey-info margin-top"> % per month</p>
                        <p className="margin-top"> ~{(this.state.stakingMonthRate).toFixed(2)}%</p>
                    </div>
                </div>

                <div className="buttons-block">
                    <button className="btn ">Buy</button>
                    <button className="btn" onClick={() => this.stake()} disabled={this.state.userCoinAmount === 0}>Stake</button>
                </div>

            </div>
        );
    }
}

export default CoinCard;
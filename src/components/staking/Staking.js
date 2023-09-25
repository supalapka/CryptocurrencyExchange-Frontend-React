import React from "react";
import "../../css/staking.css"
import CoinCard from "./CoinCard";
import axios from "axios";

class Staking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stakingCoins: [],
    };
  }


  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      const response = await axios.get(`https://localhost:44363/staking/available-coins`);
      this.setState({ stakingCoins: response.data });
      console.log(response.data);
    } catch (error) { console.log(error); }
  }

  render() {
    return (
      <div className="center-container">
        <h1>Find&Stake your favorite coin</h1>
        {this.state.stakingCoins && this.state.stakingCoins.length > 0 ? (
          <div>
            <div className="row">
              <CoinCard coin={this.state.stakingCoins[0]} />
              <CoinCard coin={this.state.stakingCoins[1]} />
            </div>

            <div className="row">
              <CoinCard coin={this.state.stakingCoins[2]} />
               <CoinCard coin={this.state.stakingCoins[3]} />
            </div>
          </div>

        ) : (
          <p className="loading">Loading...</p>
        )}
      </div>
    );
  }
}

export default Staking;
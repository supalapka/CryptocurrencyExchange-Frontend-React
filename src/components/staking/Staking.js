import React from "react";
import styles from "../../css/staking.module.css"
import CoinCard from "./CoinCard";
import {stakingAPI} from "../../api/api";


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
      const response = await stakingAPI.getCoins();
      this.setState({ stakingCoins: response.data });
    } catch (error) { console.log(error); }
  }

  render() {
    return (
      <div className={styles.centerContainer}>
        <h1 className={styles.h1}>Find&Stake your favorite coin</h1>
        {this.state.stakingCoins && this.state.stakingCoins.length > 0 ? (
          <div>
            <div className={styles.row}>
              <CoinCard coin={this.state.stakingCoins[0]} />
              <CoinCard coin={this.state.stakingCoins[1]} />
            </div>

            <div className={styles.row}>
              <CoinCard coin={this.state.stakingCoins[2]} />
               <CoinCard coin={this.state.stakingCoins[3]} />
            </div>
          </div>

        ) : (
          <p className={styles.loading}>Loading...</p>
        )}
      </div>
    );
  }
}

export default Staking;
import React from "react";
import styles from "../../css/staking.module.css"
import CoinCard from "./CoinCard";
import { stakingAPI } from "../../api/api";


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


  renderStakingCoins() {
    const listItems = [];
    for (let i = 0; i < this.state.stakingCoins.length; i += 2) {
      listItems.push(<div className={styles.row} key={i} >
        <CoinCard coin={this.state.stakingCoins[i]} />
        {this.state.stakingCoins[i + 1] ? (<CoinCard coin={this.state.stakingCoins[i + 1]} />)
          : null}

      </div>)
    }
    return listItems;
  }

  render() {
    return (
      <div className={styles.centerContainer}>
        <h1 className={styles.h1}>Find&Stake your favorite coin</h1>
        {this.state.stakingCoins && this.state.stakingCoins.length > 0 ? (
          <div>
            {this.renderStakingCoins()}
          </div>
        ) : (
          <p className={styles.loading}>Loading...</p>
        )}
      </div>
    );
  }
}

export default Staking;
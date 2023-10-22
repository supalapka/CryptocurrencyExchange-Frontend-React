import React from "react";
import styles from "../../css/profile/wallet.module.css"
import { wallet } from "../../api/api";
import axios from "axios";
import { cryptoSymbol } from "crypto-symbol";
const { nameLookup } = cryptoSymbol({});


class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: [],
    };
  }


  async componentDidMount() {
    const fetchCoins = await wallet.getWallet();
    const coinPromises = fetchCoins.map(async (coin) => {
      coin.name = await nameLookup(coin.symbol, toString(), { exact: true });
      const responsePrice = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=' + coin.symbol + '&tsyms=USD');
      coin.price = responsePrice.data.USD;
      coin.image = 'https://cryptologos.cc/logos/' + coin.name.toLowerCase() + '-' + coin.symbol + '-logo.png';
      return coin;
    });
  
    const coinsWithData = await Promise.all(coinPromises);
  
    this.setState({ coins: coinsWithData });
  }

  render() {

    const walletElements = this.state.coins.map((coin) => (
      <tr key={coin.id}>
        <td>
          <div className={styles.logoWithName}>
            <img  src={coin.image} alt="logo"/>
            <p> {coin.name} </p>
            <span> ({coin.symbol.toUpperCase()})</span>
          </div>
        </td>
        <td>${coin.price}</td>
        <td>{coin.amount}</td>
        <td>${(coin.amount * coin.price).toFixed(2)}</td>
      </tr>
    ));


    return (
      <div className={`${styles.content} default-bg`}>
        <table className={styles.walletTable}>

          <thead>
            <tr>
              <th>Coin</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Amount in USD</th>
            </tr>
          </thead>

          <tbody>
            {walletElements}
          </tbody>

        </table>

      </div>
    );
  }
}

export default Wallet;

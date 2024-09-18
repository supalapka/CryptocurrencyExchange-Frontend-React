import React from "react";
import styles from "../../css/profile/transfercryptoform.module.css"
import { wallet } from "../../api/api";
import { cryptocurrencyAPI } from "../../api/cryptocurrencyAPI";


class TransferCryptoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: [],
      selectedCoin: null,
      selectedCoinAmount: 0,
      maxCoinAmount: 0,
      receiverUserId: null,
      amountError: '',
      payIDErrorText: '',
    };
    this.sendCrypto = this.sendCrypto.bind(this);
  }

  async componentDidMount() {
    let fetchCoins = await wallet.getWallet();
    fetchCoins = fetchCoins.map(coin => {
      coin.name = cryptocurrencyAPI.getName(coin.symbol);
      return coin;
    });

    this.setState({ coins: fetchCoins });
  }

  handleCurrencyChange = (event) => {
    const values = event.target.value.split(' ');
    this.setState({ selectedCoin: values[1] });
    this.setState({ maxCoinAmount: values[2] });
  };

  handleAmountChange = (event) => {
    if (event.target.value > this.state.maxCoinAmount)
      return;
    this.setState({ selectedCoinAmount: event.target.value });
    this.setState({ amountError: '' })
  };

  handleReceiverIdChange = (event) => {
    this.setState({ receiverUserId: event.target.value });
    this.setState({ payIDErrorText: '' })
  }

  async sendCrypto() {
    if (this.state.receiverUserId === null || this.state.receiverUserId === 0) {
      this.setState({ payIDErrorText: 'PayID is missing or invalid!' })
      return;
    }

    if (this.state.selectedCoinAmount === 0) {
      this.setState({ amountError: 'Enter coins amount to transfer!' })
      return;
    }
    await wallet.sendCrypto(this.state.receiverUserId, this.state.selectedCoin,
      this.state.selectedCoinAmount);
  }

  render() {
    return (
      <div className={styles.cryptoSendBlock}>
        <h2>Transfer Cryptocurrency</h2>
        <p className={styles.defaultText}>
          Your payID - {this.state.coins.length > 0 ? (
            this.state.coins[0].userId
          ) : ('Loading..')} </p>

        <div className={styles.inputContainer}>
          <select className={styles.inputForm}  onChange={this.handleCurrencyChange}>
            <option >Select currency</option>
            {this.state.coins.map((coin) => (
              <option >
                {coin.name} {coin.symbol} {coin.amount}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputContainer}>
          <input className={styles.inputForm} type="text" placeholder="User payID" onChange={this.handleReceiverIdChange} />
        </div>
        <span className={styles.error}>{this.state.payIDErrorText}</span>


        <div className={styles.inputContainer}>
          <input className={styles.inputForm} type="number" placeholder="Amount" min={0} max={this.state.maxCoinAmount}
            value={this.state.selectedCoinAmount} onChange={this.handleAmountChange} />
        </div>
        <p className={styles.error}>{this.state.amountError}</p>


        <button onClick={this.sendCrypto}>Transfer Cryptocurrency</button>
      </div>
    );
  }
}

export default TransferCryptoForm;

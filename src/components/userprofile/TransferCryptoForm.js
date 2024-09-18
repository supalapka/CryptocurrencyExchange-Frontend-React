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
    this.selectMaxCoins = this.selectMaxCoins.bind(this);
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
    this.setState({ selectedCoin: values[1],
       maxCoinAmount: values[2],
       selectedCoinAmount: 0
      });
  };

  handleAmountChange = (event) => {
    let amount =event.target.value;

    if (event.target.value > this.state.maxCoinAmount)
      amount = this.state.maxCoinAmount;

    this.setState({ selectedCoinAmount: amount});
    this.setState({ amountError: '' })
  };


  handleReceiverIdChange = (event) => {
    this.setState({ receiverUserId: event.target.value });
    this.setState({ payIDErrorText: '' })
  }

  selectMaxCoins(){
    this.setState({selectedCoinAmount: this.state.maxCoinAmount});
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
          <div className={styles.coinAmountContainer}>
          <input className={styles.inputForm}  style={{ background: 'transparent', width: '100%' }} type="number" placeholder="Amount" min={0} max={this.state.maxCoinAmount}
            value={this.state.selectedCoinAmount} onChange={this.handleAmountChange}/> 

            <button className={styles.inputInsideBtn} onClick={this.selectMaxCoins}>All</button>
          </div>
        </div>

        <p className={styles.error}>{this.state.amountError}</p>

        <button className={styles.btn} onClick={this.sendCrypto}>Transfer Cryptocurrency</button>
      </div>
    );
  }
}

export default TransferCryptoForm;

import React from "react";
import styles from "../../css/market.module.css";
import { allCryptoSymbols } from "../../utils";
import { CryptoItem } from "./CryptoItem";
import { BWebSocket } from "../../api/binanceWebSocketService"

import { cryptocurrencyAPI } from "../../api/cryptocurrencyAPI";


const itemsPerPage = 9;

class Market extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      cryptocurrencies: [],
      binanceWebsocket: new BWebSocket(),

    };

    this.updatePrice = this.updatePrice.bind(this);
  }

  getCryptocurrenciesByPage() {
    const page = this.state.currentPage;
    let currencies = allCryptoSymbols
      .slice((page - 1) * itemsPerPage, page * itemsPerPage)
      .map((symbol) => {
        const name = cryptocurrencyAPI.getName(symbol.slice(0, -4));
        const imageUrl = cryptocurrencyAPI.getImage(symbol.slice(0, -4));
        return {
          symbol: symbol,
          price: "Loading..",
          change: "Loading..",
          name: name,
          image: imageUrl,
        };
      });

    return currencies;
  }

  fillWebSocketUrl() {
    let url = "wss://stream.binance.com:9443/ws";
    allCryptoSymbols
      .slice(
        (this.state.currentPage - 1) * itemsPerPage,
        this.state.currentPage * itemsPerPage
      )
      .forEach((symbol) => {
        url += "/" + symbol.toLowerCase() + "@ticker";
      });
    return url;
  }

  updatePrice(data) {
    var index = this.state.cryptocurrencies.findIndex(
      (coin) => coin.symbol === data.s
    );
    if (index === -1) {
      console.log(`Can't find ${data.s} to update price`);
      return;
    }

    const updatedCryptocurrency = { ...this.state.cryptocurrencies[index] };

    updatedCryptocurrency.price = data.c;
    updatedCryptocurrency.change = data.P;
    updatedCryptocurrency.symbol = data.s;

    const updatedCryptocurrencies = [...this.state.cryptocurrencies];
    updatedCryptocurrencies[index] = updatedCryptocurrency;

    this.setState({
      cryptocurrencies: updatedCryptocurrencies,
    });
  }

  updatePage(pageNumber) {
    if (this.state.currentPage === pageNumber) return;

    this.setState({ currentPage: pageNumber }, () => {
      this.setState({ cryptocurrencies: this.getCryptocurrenciesByPage() });

      this.state.binanceWebsocket.closeWebSocket();
      this.state.binanceWebsocket.openWebSocket(this.fillWebSocketUrl(), this.updatePrice, "Market List")
    });
  }


  componentDidMount() {
    this.setState({ cryptocurrencies: this.getCryptocurrenciesByPage() });
    this.state.binanceWebsocket.openWebSocket(this.fillWebSocketUrl(), this.updatePrice, "Market List");
  }

  componentWillUnmount() {
    this.state.binanceWebsocket.closeWebSocket();
  }

  render() {
    const paginationButtons = [];
    for (let i = 1; i <= allCryptoSymbols.length / itemsPerPage + 1; i++) {
      if (this.state.currentPage === i)
        paginationButtons.push(
          <a key={i} onClick={() => this.updatePage(i)} className={styles.active}>
            {i}
          </a>
        );
      else
        paginationButtons.push(
          <a key={i} onClick={() => this.updatePage(i)}>
            {i}
          </a>
        );
    }

    return (
      <div className={`${styles.cryptoList} default-bg`}>
        <h1>Cryptocurrency Market</h1>
        <table>
          <thead>
            <tr>
              <th>Currency</th>
              <th>Price</th>
              <th>Changes (24 h)</th>
            </tr>
          </thead>
          <tbody>
            {this.state.cryptocurrencies.map((coin, index) => (
              <CryptoItem coin={coin} key={index} />
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <a onClick={() => this.updatePage(1)}>&laquo;</a>
          {paginationButtons}
          <a
            onClick={() =>
              this.updatePage(
                Math.floor(allCryptoSymbols.length / itemsPerPage) + 1
              )}>
            &raquo;
          </a>
        </div>
      </div>
    );
  }
}

export default Market;

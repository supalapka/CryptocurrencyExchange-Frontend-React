import React from "react";
import styles from "../../css/market.module.css";
import { allCryptoSymbols } from "../../utils";
import { CryptoItem } from "./CryptoItem";

import { cryptoSymbol } from "crypto-symbol";
const { nameLookup } = cryptoSymbol({});

const itemsPerPage = 9;

class Market extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      cryptocurrencies: [],
      ws: null,
    };
  }

  getCryptocurrenciesByPage() {
    const page = this.state.currentPage;
    let currencies = allCryptoSymbols
      .slice((page - 1) * itemsPerPage, page * itemsPerPage)
      .map((symbol) => {
        const name = nameLookup(symbol.slice(0, -4), { exact: true });
        const imageUrl = "https://cryptologos.cc/logos/" + name.toLowerCase()
          + "-" + symbol.slice(0, -4).toLowerCase() + "-logo.png";
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
      this.closeWebSocket();
      this.openWebSocket(this.fillWebSocketUrl());
    });
  }

  openWebSocket(url) {
    const ws = new WebSocket(url);
    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.updatePrice(data);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    this.setState({ ws });
  }

  closeWebSocket() {
    const { ws } = this.state;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  }

  componentDidMount() {
    this.setState({ cryptocurrencies: this.getCryptocurrenciesByPage() });
    this.openWebSocket(this.fillWebSocketUrl());
  }

  componentWillUnmount() {
    this.closeWebSocket();
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

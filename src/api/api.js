import axios from "axios";

const jwt = localStorage.getItem('jwt');


const instance = axios.create({
  baseURL: 'https://localhost:44363/',
  headers: {
    Authorization: `Bearer ${jwt}`
  }
});

export const auth = {
  async login(email, password) {
    await instance.post(`login`, {
      "email": email,
      "password": password,
    }).then((response) => {
      if (response && response.data) {
        localStorage.setItem('jwt', response.data);
        instance.defaults.headers = { Authorization: `Bearer ${response.data}` };
      }
    })
  },

  async register(email, password) {
    const registerResponse = await instance.post(`register`, {
      email: email,
      password: password,
    });
    return registerResponse;
  },

  async checkIfLoggedIn() {
    const responce = await instance.get(`email`);
    return responce;
  }
}


export const stakingAPI = {
  async getCoins() {
    return await instance.get(`staking/available-coins`);
  },

  async createStaking(coinId, coinAmount, duration) {
    await instance.post(`staking/create`, {
      stakingCoinId: coinId,
      amount: coinAmount,
      durationInMonth: duration,
    });
  },

  async getUserStakings() {
    const responce = await instance.get(`/staking/user-coins`);
    return responce.data;
  }
}


export const wallet = {
  async getCoinAmount(symbol) {
    const response = await instance.get(`auth/coin-amount/${symbol}`);
    return response.data;
  },

  async buy(symbol, amount) {
    await instance.post('auth/buy', {
      coinSymbol: symbol,
      amount: amount,
    }).catch(error => {
      if (error.response.status === 401) {
        //route to login
      }
    })
  },

  async sell(symbol, amount) {
    await instance.post('auth/sell', {
      coinSymbol: symbol,
      amount: amount,
    }).catch(error => {
      if (error.response.status === 401) {
        //route to login
      }
    })
  },

  async getWallet() {
    const responce = await instance.get('auth/get-wallet');
    return responce.data;
  }
}


export const market = {
  async getCoinPrice(symbol) {
    return await instance.get(`market/price/${symbol}`);
  },

}


export const chartAPI = {
  async getCandlesHistory(coinSymbol, timeFrame) {
    return await instance.get(`candles?Symbol=${coinSymbol}&Timeframe=${timeFrame}&Limit=1000`);
  }
}



export const calculatePercentChange = (
  currentPrice,
  entryPrice,
  leverage,
  position
) => {
  let percentChange = (((currentPrice - entryPrice) / entryPrice) * 100).toFixed(2);
  percentChange = (percentChange * leverage).toFixed(2);
  if (position === "Short") {
    percentChange = (percentChange * -1).toFixed(2);
  }
  return percentChange;
};


export const futures = {
  async openPosition(symbol, margin, leverage, price, positionParam) {
    const responce = await instance.post(`/futures/create`, {
      Symbol: symbol,
      Margin: margin,
      Leverage: leverage,
      EntryPrice: price,
      Position: positionParam
    });
    return responce;
  },

  async getFuturesHistory(page) {
    let historyPositions = [];

    await instance.get(`/futures/history/${page}`).then(
      response => {
        response.data.map(position => {
          if (position.position === 0)
            position.position = 'Long'
          else
            position.position = 'Short'

          if (position.isLiquidated) {
            position.percentChange = -100;
            position.action = 'Liquidated';
          }
          else {
            position.percentChange = calculatePercentChange(position.markPrice, position.entryPrice,
              position.leverage, position.position);
            position.action = 'Closed';
          }
          position.usdtPNL = (position.margin * (position.percentChange / 100)).toFixed(2);

          historyPositions.push(position);
        })
      })

    return historyPositions;
  },

  async getOpenedPositions() {
    let openedPositions = [];

    await instance.get(`/futures/list`).then(
      response => {
        response.data.map(position => {
          if (position.position === 0)
            position.position = 'Long'
          else
            position.position = 'Short'

          openedPositions.push(position);
        })
      })

    return openedPositions;
  },

  async closePosition(id, pnl, markPrice) {
    await instance.get(`/futures/close?id=` + id + '&pnl=' + pnl + '&markPrice=' + markPrice)
      .catch(error => {
        console.log(error);
      });
  }
}

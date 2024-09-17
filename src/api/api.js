import axios from "axios";

const jwt = localStorage.getItem('jwt');
let isAuthorized = false;
let userEmail = '';

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
        isAuthorized = true;
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
    const response = await instance.get(`email`);
    if (response.status === 200) {
      isAuthorized = true;
      userEmail = response.data;
    }
    return response;
  },

  getUserEmail() {
    if (isAuthorized)
      return userEmail;
    else return '';
  }
}


export const stakingAPI = {
  async getCoins() {
    return await instance.get(`staking/available-coins`);
  },

  async createStaking(coinId, coinAmount, duration) {
    if (isAuthorized === false) {
      console.log("user is not authorized to stake a coin");
      return;
    }

    await instance.post(`staking/create`, {
      stakingCoinId: coinId,
      amount: coinAmount,
      durationInMonth: duration,
    });
  },

  async getUserStakings() {
    if (isAuthorized === false) {
      console.log("user is not authorized to get staked coins");
      return [];
    }

    const response = await instance.get(`/staking/user-coins`);
    return response.data;
  }
}


export const wallet = {
  async getCoinAmount(symbol) {
    if (isAuthorized === false)
      return;

    const response = await instance.get(`auth/coin-amount/${symbol}`);
    return response.data;
  },

  async buy(symbol, amount) {
    if (isAuthorized === false) {
      console.log("user is not authorized to buy crypto");
      return;
    }

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
    if (isAuthorized === false) {
      console.log("user is not authorized to sell crypto");
      return;
    }

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
    if (isAuthorized === false) {
      console.log("user is not authorized to get wallet info");
      return [];
    }

    const response = await instance.get('auth/get-wallet');
    return response.data;
  },

  async sendCrypto(receiverUserId, symbol, amount) {
    if (isAuthorized === false)
      return;

    const response = await instance.post(`/auth/send`, {
      symbol: symbol,
      amount: amount,
      receiver: receiverUserId
    }).catch(error => {
      console.log(error);
    });;

    return response;
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
    if (isAuthorized === false) {
      console.log("user is not authorized to open futures position");
      return;
    }

    const response = await instance.post(`/futures/create`, {
      Symbol: symbol,
      Margin: margin,
      Leverage: leverage,
      EntryPrice: price,
      Position: positionParam
    });
    return response;
  },

  async getFuturesHistory(page) {
    if (isAuthorized === false)
      return [];

    let historyPositions = [];

    await instance.get(`/futures/history/${page}`).then(
      response => {
        response.data.forEach(position => {
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
    if (isAuthorized === false)
      return [];

    let openedPositions = [];

    await instance.get(`/futures/list`).then(
      response => {
        response.data.forEach(position => {
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


export const newsAPI = {
  async getNews() {
    const response = await instance.get(`/get-news`);

    const news = response.data.map(element => {
      const date = new Date(element.time)
      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
      element.time = date.toLocaleDateString('en-US', dateOptions)
      return element;
    });
    return news;
  }
}

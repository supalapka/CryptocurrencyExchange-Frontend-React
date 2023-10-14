import axios from "axios";

const jwt = localStorage.getItem('jwt');
console.log(jwt);



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
        console.log(response.data);
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


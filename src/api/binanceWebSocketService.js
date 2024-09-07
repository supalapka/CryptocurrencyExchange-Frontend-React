export class BWebSocket {
  constructor() {
    this.ws = null;
    this.savedUrl = null;
    this.savedName = null;
  }

  getUrlConnectionByCoins(coins) {
    let url = "wss://stream.binance.com:9443/ws";
    coins.forEach((symbol) => {
      url += "/" + symbol.toLowerCase() + "@ticker";
    });
    return url;
  }

  openWebSocket(url, messageCallback, websocketName = '') {
    this.ws = new WebSocket(url);
    this.ws.onopen = () => {
      console.log(websocketName + " WebSocket connected. URL: " + url);
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      messageCallback(data);
    };

    this.ws.onclose = () => {
      console.log(this.savedName + " WebSocket closed. URL: " + this.savedUrl);
    };

    this.savedUrl = url;
    this.savedName = websocketName;
  }

  closeWebSocket() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    } else {
      console.log("Cannot close " + this.savedName + " WebSocket");
    }
  }
}

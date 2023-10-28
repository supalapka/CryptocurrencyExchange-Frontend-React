let ws = null;


export const BWebSocket = {

    getUrlConnectionByCoins(coins) {
        let url = "wss://stream.binance.com:9443/ws";
        coins.forEach((symbol) => {
            url += "/" + symbol.toLowerCase() + "@ticker";
        });
        return url;
    },

    openWebSocket(url, messageCallback, websocketName = '') {
        ws = new WebSocket(url);
        ws.onopen = () => {
          console.log(websocketName + " WebSocket connected");
        };
    
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          messageCallback(data);
        };
    
        ws.onclose = () => {
          console.log("WebSocket closed");
        };
    
      },
    
      closeWebSocket() {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      },

}

import { useEffect, useState } from "react";
import axios from "axios";

export function useMarketData(symbol = 'btc', timeFrame = "4h") {
  const [data, setData] = useState();

  useEffect(() => {
    async function fetchCandlesHistory() {
      const url = `https://localhost:44363/candles?Symbol=${symbol}&Timeframe=${timeFrame}&Limit=1000`;
      try {
        const response = await axios.get(url);
        const formattedData = response.data.map((data) => {
          data.date = new Date(data.openTime);
          return data;
        });
        setData(formattedData);
      } catch (error) {
        console.error(error);
      }
    }

    if (!data) {
      fetchCandlesHistory()
        .catch((error) => {
          console.error(error);
        });
    }
  }, [data, timeFrame, setData]);

  return {
    data,
    loaded: Boolean(data)
  };
}

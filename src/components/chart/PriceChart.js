import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import {
  discontinuousTimeScaleProviderBuilder,
  Chart,
  ChartCanvas,
  BarSeries,
  CandlestickSeries,
  lastVisibleItemBasedZoomAnchor,
  XAxis,
  YAxis,
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY,
  ZoomButtons,
  withDeviceRatio,
  withSize
} from "react-financial-charts";
import axios from "axios";
import OHLCTooltip from "./OHLCTooltip";

const axisStyles = {
  strokeStyle: "#383E55", // Color.GRAY
  strokeWidth: 2,
  tickLabelFill: "# ", // Color.LIGHT_GRAY
  tickStrokeStyle: "#383E55",
  gridLinesStrokeStyle: "rgba(56, 62, 85, 0.5)" // Color.GRAY w Opacity
};

const coordinateStyles = {
  fill: "#383E55",
  textFill: "#FFFFFF"
};

const zoomButtonStyles = {
  fill: "#383E55",
  fillOpacity: 1,
  strokeWidth: 0,
  textFill: "#9EAAC7"
};

const crossHairStyles = {
  strokeStyle: "#9EAAC7"
};

// Default green/red colors for candlesticks
const openCloseColor = (d) => (d.close > d.open ? "#26a69a" : "#ef5350");

// yExtentsCalculator: used from updating price series
const yExtentsCalculator = ({ plotData }) => {
  let min;
  let max;
  for (const { low, high } of plotData) {
    if (min === undefined) min = low;
    if (max === undefined) max = high;
    if (low !== undefined && min > low) min = low;
    if (high !== undefined && max < high) max = high;
  }
  if (min === undefined) min = 0;
  if (max === undefined) max = 0;

  const padding = (max - min) * 0.1;
  return [min - padding, max + padding * 2];
};

const FinancialChart = ({
  coinSymbol,
  timeFrame,
  dateTimeFormat,
  height,
  margin,
  priceDisplayFormat,
  ratio,
  width
}) => {
const [initialData, setInitialData] = useState();
const [loaded, setLoaded] = useState(false);
const [resetCount, setResetCount] = useState(0);

useEffect(() => {
  async function fetchCandlesHistory() {
    const url = `https://localhost:44363/candles?Symbol=${coinSymbol}&Timeframe=${timeFrame}&Limit=1000`;
    try {
      const response = await axios.get(url);
      const formattedData = response.data.map((data) => {
        data.date = new Date(data.openTime);
        return data;
      });
      setInitialData(formattedData);
      setLoaded(true);
    } catch (error) {
      console.error(error);
    }
  }
  fetchCandlesHistory();
}, [timeFrame]);


  if (!loaded || !height || !ratio || !width) return null;


  const timeDisplayFormat = timeFormat(dateTimeFormat);
  const xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
    (d) => d.date
  );
  const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
    initialData
  );

  const min = xAccessor(data[Math.max(0, data.length - parseInt(width / 5))]);
  const max = xAccessor(data[data.length - 1]);
  const xExtents = [min, max + 1];

  const gridHeight = height - margin.top - margin.bottom;
  const barChartHeight = gridHeight / 5;
  const barChartOrigin = (_, h) => [0, h - barChartHeight];

  return (
    <ChartCanvas
      height={height}
      ratio={ratio}
      width={width}
      margin={margin}
      seriesName={`Chart ${resetCount}`}
      data={data}
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
      xExtents={xExtents}
      zoomAnchor={lastVisibleItemBasedZoomAnchor}
    >
      {/* Volume Chart */}
      <Chart
        id={1}
        height={barChartHeight}
        origin={barChartOrigin}
        yExtents={(d) => d.volume}
      >
        <BarSeries
          fillStyle={(d) =>
            d.close > d.open
              ? "rgba(38, 166, 154, 0.45)"
              : "rgba(239, 83, 80, 0.45)"
          }
          yAccessor={(d) => d.volume}
        />
      </Chart>

      {/* Price Chart */}
      <Chart id={2} yExtentsCalculator={yExtentsCalculator}>
        <XAxis {...axisStyles} showGridLines />
        <MouseCoordinateX
          displayFormat={timeDisplayFormat}
          {...coordinateStyles}
        />

        <YAxis {...axisStyles} showGridLines />  {/*price markers in the right panel*/}
        <MouseCoordinateY
          rectWidth={margin.right}
          displayFormat={priceDisplayFormat}
          {...coordinateStyles}
        />

        {/* YAxis close price highlight */}
        <EdgeIndicator
          itemType="last"
          rectWidth={margin.right}
          fill={openCloseColor}
          lineStroke={openCloseColor}
          displayFormat={priceDisplayFormat}
          yAccessor={(d) => d.close}
        />

        <CandlestickSeries />
        <OHLCTooltip
          origin={[8, 16]}
          textFill={openCloseColor}
          className="react-no-select"
        />
        <ZoomButtons
          onReset={() => setResetCount(resetCount + 1)}
          {...zoomButtonStyles}
        />
      </Chart>
      <CrossHairCursor {...crossHairStyles} />
    </ChartCanvas>
  );
};

FinancialChart.propTypes = {
  dateTimeFormat: PropTypes.string,
  height: PropTypes.number,
  margin: PropTypes.object,
  priceDisplayFormat: PropTypes.func,
  ratio: PropTypes.number,
  width: PropTypes.number
};

FinancialChart.defaultProps = {
  dateTimeFormat: "%d %b '%y \xa0 %H:%M",
  height: 600,
  margin: { left: 0, right: 48, top: 0, bottom: 24 },
  priceDisplayFormat: format(".2f"),
  ratio: 0,
  width: 0
};


const EnhancedFinancialChart = withSize({ style: { minHeight: 600 } })(
  withDeviceRatio()(FinancialChart)
);

const PriceChart = ({ coinSymbol, timeFrame }) => {
  return <EnhancedFinancialChart coinSymbol={coinSymbol} timeFrame={timeFrame} />;
};

export default PriceChart;
import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class BullishHarami extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.requiredCount  = 2;
        this.name =  "BullishHarami";
        this.scale = scale;
    }
    logic (data:StockData) {
        // Previous day (first in pattern - index 1)
        let prevOpen   = data.open[1];
        let prevClose  = data.close[1];
        let prevHigh   = data.high[1];
        let prevLow    = data.low[1];
        
        // Current day (second in pattern - index 0)
        let currOpen  = data.open[0];
        let currClose = data.close[0];
        let currHigh  = data.high[0];
        let currLow   = data.low[0];
        
        // Validate OHLC data
        if (!this.validateOHLC(prevOpen, prevHigh, prevLow, prevClose) ||
            !this.validateOHLC(currOpen, currHigh, currLow, currClose)) {
            return false;
        }
        
        // Previous day should be bearish (large red candle)
        let isPrevBearish = prevClose < prevOpen;
        
        // Current day should be bullish or near-doji (small green candle or very small body)
        let isCurrBullish = currClose > currOpen || this.approximateEqual(currOpen, currClose);
        
        // Current day should be completely contained within previous day's body and range
        // (Harami means "inside" in Japanese)
        let isInsidePrevBody = currOpen < prevOpen && currOpen > prevClose &&
                              currClose < prevOpen && currClose > prevClose;
        let isInsidePrevRange = currHigh <= prevHigh && currLow >= prevLow;
        
        return isPrevBearish && isCurrBullish && isInsidePrevBody && isInsidePrevRange;
   }
}

export function bullishharami(data:StockData, scale: number = 1) {
  return new BullishHarami(scale).hasPattern(data);
}

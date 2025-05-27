import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class BearishHarami extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.requiredCount  = 2;
        this.name =  "BearishHarami";
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
        
        // Previous day should be bullish (large green candle)
        let isPrevBullish = prevClose > prevOpen;
        
        // Current day should be bearish (small red candle)
        let isCurrBearish = currClose < currOpen;
        
        // Current day should be completely contained within previous day's body and range
        // (Harami means "inside" in Japanese)
        let isInsidePrevBody = currOpen > prevOpen && currOpen < prevClose &&
                              currClose > prevOpen && currClose < prevClose;
        let isInsidePrevRange = currHigh <= prevHigh && currLow >= prevLow;
        
        return isPrevBullish && isCurrBearish && isInsidePrevBody && isInsidePrevRange;
   }
}

export function bearishharami(data:StockData, scale: number = 1) {
  return new BearishHarami(scale).hasPattern(data);
}

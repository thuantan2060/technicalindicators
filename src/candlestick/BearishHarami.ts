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
        // Previous day (older) - index 0
        let prevOpen   = data.open[0];
        let prevClose  = data.close[0];
        let prevHigh   = data.high[0];
        let prevLow    = data.low[0];
        
        // Current day (most recent) - index 1
        let currOpen  = data.open[1];
        let currClose = data.close[1];
        let currHigh  = data.high[1];
        let currLow   = data.low[1];
        
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

import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class BearishHaramiCross extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.requiredCount  = 2;
        this.name = 'BearishHaramiCross';
        this.scale = scale;
    }

    logic (data:StockData) {
        // Previous day (index 0) - should be a bullish candle
        let prevOpen   = data.open[0];
        let prevClose  = data.close[0];
        let prevHigh   = data.high[0];
        let prevLow    = data.low[0];
        
        // Current day (index 1) - should be a doji contained within previous body
        let currOpen  = data.open[1];
        let currClose = data.close[1];
        let currHigh  = data.high[1];
        let currLow   = data.low[1];

        // Validate OHLC data
        if (!this.validateOHLC(prevOpen, prevHigh, prevLow, prevClose) ||
            !this.validateOHLC(currOpen, currHigh, currLow, currClose)) {
            return false;
        }

        // Previous day should be a bullish candle
        let isPrevBullish = prevClose > prevOpen;
        let prevBodySize = Math.abs(prevClose - prevOpen);
        let prevRange = prevHigh - prevLow;
        
        // Ensure the previous candle has a reasonable body size
        // The body should be at least 50% of the total range (more strict requirement)
        let isPrevSignificant = prevRange > 0 && (prevBodySize / prevRange) >= 0.5;
        
        // Current day should be a doji (open ≈ close)
        let isCurrDoji = this.approximateEqual(currOpen, currClose);
        
        // Containment: Current doji should be completely contained within previous candle's body
        // For a bullish previous candle: prevClose > prevOpen
        // So the body range is from prevOpen (bottom) to prevClose (top)
        let bodyTop = prevClose;   // For bullish candle, close is higher
        let bodyBottom = prevOpen; // For bullish candle, open is lower
        
        // Current candle (including shadows) should be contained within previous body
        // Allow for exact boundary matches (<=, >=)
        let hasContainment = currHigh <= bodyTop && 
                           currLow >= bodyBottom &&
                           currOpen >= bodyBottom && 
                           currOpen <= bodyTop &&
                           currClose >= bodyBottom && 
                           currClose <= bodyTop;

        return isPrevBullish && isPrevSignificant && isCurrDoji && hasContainment;
   }
}

export function bearishharamicross(data:StockData, scale: number = 1) {
  return new BearishHaramiCross(scale).hasPattern(data);
}

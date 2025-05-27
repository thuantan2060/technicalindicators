import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class BullishHaramiCross extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.requiredCount  = 2;
        this.name = 'BullishHaramiCross';
        this.scale = scale;
    }
    logic (data:StockData) {
        // Previous day (older) - index 0 - should be a long bearish candle
        let prevOpen   = data.open[0];
        let prevClose  = data.close[0];
        let prevHigh   = data.high[0];
        let prevLow    = data.low[0];
        
        // Current day (most recent) - index 1 - should be a doji
        let currOpen  = data.open[1];
        let currClose = data.close[1];
        let currHigh  = data.high[1];
        let currLow   = data.low[1];

        // Validate OHLC data
        if (!this.validateOHLC(prevOpen, prevHigh, prevLow, prevClose) ||
            !this.validateOHLC(currOpen, currHigh, currLow, currClose)) {
            return false;
        }

        // Previous day should be a bearish candle
        let isPrevBearish = prevClose < prevOpen;
        let prevBodySize = Math.abs(prevOpen - prevClose);
        let prevRange = prevHigh - prevLow;
        
        // Ensure the previous candle has a reasonable body size
        // The body should be at least 50% of the total range (more strict requirement)
        let isPrevSignificant = prevRange > 0 && (prevBodySize / prevRange) >= 0.5;
        
        // Current day should be a doji (open ≈ close)
        let isCurrDoji = this.approximateEqual(currOpen, currClose);
        
        // Containment: Current doji should be completely contained within previous candle's body
        // For a bearish previous candle: prevClose < prevOpen
        // So the body range is from prevClose (bottom) to prevOpen (top)
        let bodyTop = prevOpen;    // For bearish candle, open is higher
        let bodyBottom = prevClose; // For bearish candle, close is lower
        
        // Current candle (including shadows) should be contained within previous body
        let hasContainment = currHigh <= bodyTop && 
                           currLow >= bodyBottom &&
                           currOpen >= bodyBottom && 
                           currOpen <= bodyTop &&
                           currClose >= bodyBottom && 
                           currClose <= bodyTop;

        return isPrevBearish && isPrevSignificant && isCurrDoji && hasContainment;
   }
}

export function bullishharamicross(data:StockData, scale: number = 1) {
  return new BullishHaramiCross(scale).hasPattern(data);
}

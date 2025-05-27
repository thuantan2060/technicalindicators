import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class BullishEngulfingPattern extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'BullishEngulfingPattern';
        this.requiredCount  = 2;
        this.scale = scale;
    }
    logic (data:StockData) {
        // Previous day (older) - index 0
        let prevOpen  = data.open[0];
        let prevClose = data.close[0];
        let prevHigh  = data.high[0];
        let prevLow   = data.low[0];
        
        // Current day (most recent) - index 1
        let currOpen   = data.open[1];
        let currClose  = data.close[1];
        let currHigh   = data.high[1];
        let currLow    = data.low[1];
        
        // Validate OHLC data
        if (!this.validateOHLC(currOpen, currHigh, currLow, currClose) ||
            !this.validateOHLC(prevOpen, prevHigh, prevLow, prevClose)) {
            return false;
        }
        
        // Previous day should be bearish (red)
        let prevIsBearish = prevClose < prevOpen;
        
        // Current day should be bullish (green)
        let currIsBullish = currClose > currOpen;
        
        // Current day should engulf previous day's body:
        // For a bullish engulfing pattern:
        // - Current close should be >= previous open (covers top of previous body)
        // - Current open should be <= previous close (covers bottom of previous body)
        // OR for gap scenarios: current range should exceed previous range
        let normalEngulfing = currClose >= prevOpen && currOpen <= prevClose;
        
        // For gap up scenarios: if current open > previous close, 
        // check if current close still exceeds previous open (the key requirement)
        // AND ensure the current candle is not smaller than the previous candle (prevent reverse engulfment)
        let gapEngulfing = false;
        if (currOpen > prevClose && currClose > prevOpen) {
            // Additional check: current candle should have a meaningful size relative to previous
            let currBodySize = Math.abs(currClose - currOpen);
            let prevBodySize = Math.abs(prevOpen - prevClose);
            // Current body should be at least 50% of previous body size to be considered engulfing
            gapEngulfing = currBodySize >= prevBodySize * 0.5;
        }
        
        let isEngulfing = normalEngulfing || gapEngulfing;
        
        let isBullishEngulfing = prevIsBearish && currIsBullish && isEngulfing;
                    
        return isBullishEngulfing;
   }
}

export function bullishengulfingpattern(data:StockData, scale: number = 1) {
  return new BullishEngulfingPattern(scale).hasPattern(data);
}
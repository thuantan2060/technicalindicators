import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class BearishEngulfingPattern extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'BearishEngulfingPattern';
        this.requiredCount  = 2;
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
        
        // Validate OHLC data integrity
        let prevValid = this.validateOHLC(prevOpen, prevHigh, prevLow, prevClose);
        let currValid = this.validateOHLC(currOpen, currHigh, currLow, currClose);
        
        if (!prevValid || !currValid) {
            return false;
        }
        
        // Previous day should be bullish (green)
        let prevIsBullish = prevClose > prevOpen;
        
        // Current day should be bearish (red)
        let currIsBearish = currClose < currOpen;
        
        // Current day should engulf previous day:
        // - Current open above previous close (gap up or continuation)
        // - Current close below previous open (complete engulfment)
        let isEngulfing = currOpen >= prevClose && currClose <= prevOpen;
        
        let isBearishEngulfing = prevIsBullish && currIsBearish && isEngulfing;
                    
        return isBearishEngulfing;
   }
}

export function bearishengulfingpattern(data:StockData, scale: number = 1) {
    return new BearishEngulfingPattern(scale).hasPattern(data);
}
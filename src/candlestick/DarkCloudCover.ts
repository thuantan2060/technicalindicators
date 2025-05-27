import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class DarkCloudCover extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'DarkCloudCover';
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
        let currOpen   = data.open[1];
        let currClose  = data.close[1];
        let currHigh   = data.high[1];
        let currLow    = data.low[1];
        
        // Previous day should be bullish (green candle)
        let prevIsBullish = prevClose > prevOpen;
        
        // Current day should be bearish (red candle)
        let currIsBearish = currClose < currOpen;
        
        // Calculate the midpoint of previous day's body
        let prevMidpoint = (prevClose + prevOpen) / 2;
        
        // Dark cloud cover conditions:
        // 1. Current opens above previous day's high (gap up)
        // 2. Current close is below the midpoint of previous day's body
        // 3. Current close is still above previous day's open (not full engulfment)
        let isDarkCloudPattern = currOpen > prevHigh && 
                                currClose < prevMidpoint && 
                                currClose > prevOpen;              
   
        return prevIsBullish && currIsBearish && isDarkCloudPattern;
   }
}

export function darkcloudcover(data:StockData, scale: number = 1) {
  return new DarkCloudCover(scale).hasPattern(data);
}
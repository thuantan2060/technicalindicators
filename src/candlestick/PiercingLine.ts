import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class PiercingLine extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.requiredCount  = 2;
        this.name = 'PiercingLine';
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

        // Previous day should be bearish (red candle)
        let prevIsBearish = prevClose < prevOpen;
        
        // Current day should be bullish (green candle)  
        let currIsBullish = currClose > currOpen;
        
        // Calculate the midpoint of previous day's body
        let prevMidpoint = (prevOpen + prevClose) / 2;
        
        // Piercing line conditions:
        // 1. Current opens below previous day's low (gap down)
        // 2. Current close is above the midpoint of previous day's body
        let isPiercingLine = currOpen < prevLow && currClose > prevMidpoint;
        
        // Additional check: ensure current close is still below previous open (not full engulfment)
        let isPartialPenetration = currClose < prevOpen;
        
       return prevIsBearish && currIsBullish && isPiercingLine && isPartialPenetration;
   }
}

export function piercingline(data:StockData, scale: number = 1) {
  return new PiercingLine(scale).hasPattern(data);
}
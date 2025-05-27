import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class MorningStar extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'MorningStar';
        this.requiredCount  = 3;
        this.scale = scale;
    }
    logic (data:StockData) {
        // First day (oldest - index 2)
        let firstOpen   = data.open[2];
        let firstClose  = data.close[2];
        let firstHigh   = data.high[2];
        let firstLow    = data.low[2];
        
        // Second day (middle - index 1) 
        let secondOpen  = data.open[1];
        let secondClose = data.close[1];
        let secondHigh  = data.high[1];
        let secondLow   = data.low[1];
        
        // Third day (most recent - index 0)
        let thirdOpen   = data.open[0];
        let thirdClose  = data.close[0];
        let thirdHigh   = data.high[0];
        let thirdLow    = data.low[0];
         
        // First day should be bearish (red candle)
        let isFirstBearish = firstClose < firstOpen;
        
        // Second day should be a small body (star) gapping down from first day
        let firstMidpoint = (firstOpen + firstClose) / 2;
        let secondBodySize = Math.abs(secondClose - secondOpen);
        let firstBodySize = Math.abs(firstClose - firstOpen);
        let isSmallBody = secondBodySize < (firstBodySize * 0.3); // Small relative to first day
        
        // Third day should be bullish and close above first day's midpoint
        let isThirdBullish = thirdClose > thirdOpen;
        let closesAboveFirstMidpoint = thirdClose > firstMidpoint;
        
        // Gap conditions: second day gaps down from first, third gaps up from second
        let hasDownGap = secondHigh < firstLow;
        let hasUpGap = thirdOpen > secondHigh;
        
        return (isFirstBearish && isSmallBody && isThirdBullish && 
                closesAboveFirstMidpoint && hasDownGap && hasUpGap);
     }
}

export function morningstar(data:StockData, scale: number = 1) {
  return new MorningStar(scale).hasPattern(data);
}
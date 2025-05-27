import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class EveningStar extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'EveningStar';
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
         
        // First day should be bullish (green candle)
        let isFirstBullish = firstClose > firstOpen;
        
        // Second day should be a small body (star) gapping up from first day
        let firstMidpoint = (firstOpen + firstClose) / 2;
        let secondBodySize = Math.abs(secondClose - secondOpen);
        let firstBodySize = Math.abs(firstClose - firstOpen);
        let isSmallBody = secondBodySize < (firstBodySize * 0.3); // Small relative to first day
        
        // Third day should be bearish and close below first day's midpoint
        let isThirdBearish = thirdClose < thirdOpen;
        let closesBelowFirstMidpoint = thirdClose < firstMidpoint;
        
        // Gap conditions: second day gaps up from first, third gaps down from second
        let hasUpGap = secondLow > firstHigh;
        let hasDownGap = thirdOpen < secondLow;
        
        return (isFirstBullish && isSmallBody && isThirdBearish && 
                closesBelowFirstMidpoint && hasUpGap && hasDownGap);
     }
}

export function eveningstar(data:StockData, scale: number = 1) {
  return new EveningStar(scale).hasPattern(data);
}
import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class ThreeWhiteSoldiers extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'ThreeWhiteSoldiers';
        this.requiredCount  = 3;
        this.scale = scale;
    }
    logic (data:StockData) {
        // First day (oldest) - index 0
        let firstOpen   = data.open[0];
        let firstClose  = data.close[0];
        let firstHigh   = data.high[0];
        let firstLow    = data.low[0];
        
        // Second day (middle) - index 1
        let secondOpen  = data.open[1];
        let secondClose = data.close[1];
        let secondHigh  = data.high[1];
        let secondLow   = data.low[1];
        
        // Third day (most recent) - index 2
        let thirdOpen   = data.open[2];
        let thirdClose  = data.close[2];
        let thirdHigh   = data.high[2];
        let thirdLow    = data.low[2];
         
        // All three days should be bullish (white/green candles)
        let isAllBullish = firstClose > firstOpen &&
                          secondClose > secondOpen &&
                          thirdClose > thirdOpen;
        
        // Progressive uptrend - each day should have higher highs
        let isUpTrend = secondHigh > firstHigh &&
                       thirdHigh > secondHigh;
        
        // Each subsequent day should open within the previous day's body
        // and close higher than the previous day's close
        let doesOpenWithinPreviousBody = secondOpen > firstOpen && secondOpen < firstClose &&
                                        thirdOpen > secondOpen && thirdOpen < secondClose;
        
        return (isUpTrend && isAllBullish && doesOpenWithinPreviousBody);
     }
}

export function threewhitesoldiers(data:StockData, scale: number = 1) {
  return new ThreeWhiteSoldiers(scale).hasPattern(data);
}

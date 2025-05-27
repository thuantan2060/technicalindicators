import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';
import Doji from './Doji';


export default class AbandonedBaby extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'AbandonedBaby';
        this.requiredCount  = 3;
        this.scale = scale;
    }
    logic (data:StockData) {
        // Correct indexing: [0]=first day (oldest), [1]=doji (middle), [2]=third day (newest)
        let firstdaysOpen   = data.open[0];   // First day (oldest)
        let firstdaysClose  = data.close[0];
        let firstdaysHigh   = data.high[0];
        let firstdaysLow    = data.low[0];
        
        let seconddaysOpen  = data.open[1];   // Second day (middle - doji)
        let seconddaysClose = data.close[1];
        let seconddaysHigh  = data.high[1];
        let seconddaysLow   = data.low[1];
        
        let thirddaysOpen   = data.open[2];   // Third day (newest)
        let thirddaysClose  = data.close[2];
        let thirddaysHigh   = data.high[2];
        let thirddaysLow    = data.low[2];
         
        let isFirstBearish  = firstdaysClose < firstdaysOpen;
        let dojiExists      = new Doji().hasPattern({
                                    "open" : [seconddaysOpen],
                                    "close": [seconddaysClose],
                                    "high" : [seconddaysHigh],
                                    "low"  : [seconddaysLow]
                                });
        
        // Gap detection: 
        // Gap 1: Doji high < First day low (gap down from first to second day)
        // Gap 2: Third day low > Doji high (gap up from second to third day)
        let gapExists       = (seconddaysHigh < firstdaysLow) && 
                              (thirddaysLow > seconddaysHigh);
        
        let isThirdBullish  = (thirddaysClose > thirddaysOpen);
                        
        return (isFirstBearish && dojiExists && gapExists && isThirdBullish);
     }
}

export function abandonedbaby(data:StockData, scale: number = 1) {
    return new AbandonedBaby(scale).hasPattern(data);
} 
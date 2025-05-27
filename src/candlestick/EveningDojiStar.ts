import Doji from './Doji';
import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';


export default class EveningDojiStar extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'EveningDojiStar';
        this.requiredCount  = 3;
        this.scale = scale;
    }
    logic (data:StockData) {
        // For ascending order data: [0]=oldest (day 1), [1]=middle (day 2), [2]=most recent (day 3)
        let firstdaysOpen   = data.open[0];   // Day 1 (oldest) - should be bullish candle
        let firstdaysClose  = data.close[0];
        let firstdaysHigh   = data.high[0];
        let firstdaysLow    = data.low[0];
        
        let seconddaysOpen  = data.open[1];   // Day 2 (middle) - should be doji star
        let seconddaysClose = data.close[1];
        let seconddaysHigh  = data.high[1];
        let seconddaysLow   = data.low[1];
        
        let thirddaysOpen   = data.open[2];   // Day 3 (most recent) - should be bearish candle
        let thirddaysClose  = data.close[2];
        let thirddaysHigh   = data.high[2];
        let thirddaysLow    = data.low[2];
        
        // Validate OHLC data integrity for all three days
        if (!this.validateOHLC(firstdaysOpen, firstdaysHigh, firstdaysLow, firstdaysClose) ||
            !this.validateOHLC(seconddaysOpen, seconddaysHigh, seconddaysLow, seconddaysClose) ||
            !this.validateOHLC(thirddaysOpen, thirddaysHigh, thirddaysLow, thirddaysClose)) {
            return false;
        }
         
        let firstdaysMidpoint = ((firstdaysOpen+firstdaysClose)/2);
        let isFirstBullish    = firstdaysClose > firstdaysOpen;
        let dojiExists        =  new Doji(this.scale).hasPattern({
                                    "open" : [seconddaysOpen],
                                    "close": [seconddaysClose],
                                    "high" : [seconddaysHigh],
                                    "low"  : [seconddaysLow]
                                });
        let isThirdBearish    = thirddaysOpen > thirddaysClose; 

        let gapExists         = ((seconddaysHigh > firstdaysHigh) && 
                                (seconddaysLow > firstdaysHigh) && 
                                (thirddaysOpen < seconddaysLow) && 
                                (seconddaysClose > thirddaysOpen));
      let doesCloseBelowFirstMidpoint = thirddaysClose < firstdaysMidpoint;
      return (isFirstBullish && dojiExists && gapExists && isThirdBearish && doesCloseBelowFirstMidpoint );
     }
}


export function eveningdojistar(data:StockData, scale: number = 1) {
  return new EveningDojiStar(scale).hasPattern(data);
}
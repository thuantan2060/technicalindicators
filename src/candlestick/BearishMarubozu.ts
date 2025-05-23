import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class BearishMarubozu extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'BearishMarubozu';
        this.requiredCount  = 1;
        this.scale = scale;
    }
    logic (data:StockData) {
        let daysOpen  = data.open[0];
        let daysClose = data.close[0];
        let daysHigh  = data.high[0];
        let daysLow   = data.low[0];

        let isBearishMarbozu =  this.approximateEqual(daysOpen, daysHigh) && 
                                this.approximateEqual(daysLow, daysClose) &&
                                daysOpen > daysClose && 
                                daysOpen > daysLow;

        return (isBearishMarbozu);
        
    }
}

export function bearishmarubozu(data:StockData, scale: number = 1) {
  return new BearishMarubozu(scale).hasPattern(data);
}
import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class BullishMarubozu extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'BullishMarubozu';
        this.requiredCount  = 1;
        this.scale = scale;
    }
    logic (data:StockData) {
        let daysOpen  = data.open[0];
        let daysClose = data.close[0];
        let daysHigh  = data.high[0];
        let daysLow   = data.low[0];

        let isBullishMarbozu =  this.approximateEqual(daysClose, daysHigh) && 
                                this.approximateEqual(daysLow, daysOpen) &&
                                daysOpen < daysClose && 
                                daysOpen < daysHigh;
        

        return (isBullishMarbozu);
        
    }
}

export function bullishmarubozu(data:StockData, scale: number = 1) {
  return new BullishMarubozu(scale).hasPattern(data);
}
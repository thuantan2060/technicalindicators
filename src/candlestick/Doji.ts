import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class Doji extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'Doji';
        this.requiredCount  = 1;
        this.scale = scale;
    }
    logic (data:StockData):boolean {
        let daysOpen = data.open[0];
        let daysClose = data.close[0];
        let daysHigh = data.high[0];
        let daysLow = data.low[0];
        
        // A Doji is simply when open equals close (very small or no body)
        // The shadows can be of any length
        let isOpenEqualsClose = this.approximateEqual(daysOpen, daysClose);
        
        // Make sure we have valid OHLC data (high >= low, etc.)
        let hasValidData = daysHigh >= Math.max(daysOpen, daysClose) && 
                          daysLow <= Math.min(daysOpen, daysClose);
        
        return isOpenEqualsClose && hasValidData;
    }
}

export function doji(data:StockData, scale: number = 1) {
  return new Doji(scale).hasPattern(data);
}
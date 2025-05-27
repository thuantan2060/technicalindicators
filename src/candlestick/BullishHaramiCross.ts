import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class BullishHaramiCross extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.requiredCount  = 2;
        this.name = 'BullishHaramiCross';
        this.scale = scale;
    }
    logic (data:StockData) {
        // Previous day (first in pattern - index 1)
        let prevOpen   = data.open[1];
        let prevClose  = data.close[1];
        let prevHigh   = data.high[1];
        let prevLow    = data.low[1];
        
        // Current day (second in pattern - index 0)
        let currOpen  = data.open[0];
        let currClose = data.close[0];
        let currHigh  = data.high[0];
        let currLow   = data.low[0];

        // Previous day should be a doji (open ≈ close)
        let isPrevDoji = this.approximateEqual(prevOpen, prevClose);
        
        // Current day should be bearish
        let isCurrBearish = currClose < currOpen;
        
        // Containment logic based on original pattern definition
        // Current day should have some containment within previous day's range
        let hasContainment = currOpen > prevOpen && 
                           currClose <= prevOpen &&
                           currClose < prevClose && 
                           currOpen > prevLow &&
                           currHigh > prevHigh;

        return isPrevDoji && isCurrBearish && hasContainment;
   }
}

export function bullishharamicross(data:StockData, scale: number = 1) {
  return new BullishHaramiCross(scale).hasPattern(data);
}

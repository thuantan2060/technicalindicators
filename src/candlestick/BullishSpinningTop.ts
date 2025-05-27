import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class BullishSpinningTop extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'BullishSpinningTop';
        this.requiredCount  = 1;
        this.scale = scale;
    }
    logic (data:StockData) {
        let daysOpen  = data.open[0];
        let daysClose = data.close[0];
        let daysHigh  = data.high[0];
        let daysLow   = data.low[0];

        // Validate OHLC data integrity first
        if (!this.validateOHLC(daysOpen, daysHigh, daysLow, daysClose)) {
            return false;
        }

        // Must be bullish (close > open)
        let isBullish = daysClose > daysOpen;
        
        let bodyLength           = Math.abs(daysClose-daysOpen);
        // For bullish candles: top of body is close, bottom is open
        let upperShadowLength    = Math.abs(daysHigh - daysClose);
        let lowerShadowLength    = Math.abs(daysOpen - daysLow);
        
        let isBullishSpinningTop = isBullish && 
                                 bodyLength < upperShadowLength && 
                                 bodyLength < lowerShadowLength;

        return isBullishSpinningTop;
    }
}

export function bullishspinningtop(data:StockData, scale: number = 1) {
  return new BullishSpinningTop(scale).hasPattern(data);
}
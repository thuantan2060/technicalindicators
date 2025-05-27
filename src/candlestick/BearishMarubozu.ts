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

        // Validate OHLC data
        if (!this.validateOHLC(daysOpen, daysHigh, daysLow, daysClose)) {
            return false;
        }

        // Bearish Marubozu: open > close, open = high, close = low (no shadows)
        let isBearish = daysOpen > daysClose;
        
        // For Marubozu, we need strict equality for open=high and close=low
        // Allow small tolerance for rounding errors but reject significant shadows
        let bodySize = Math.abs(daysOpen - daysClose);
        let maxTolerance = Math.max(bodySize * 0.015, 0.015 * this.scale); // Slightly more generous for floating point precision
        
        let upperShadow = Math.abs(daysHigh - daysOpen);
        let lowerShadow = Math.abs(daysLow - daysClose);
        
        let isOpenEqualsHigh = upperShadow <= maxTolerance;
        let isCloseEqualsLow = lowerShadow <= maxTolerance;
        
        let isBearishMarubozu = isBearish && isOpenEqualsHigh && isCloseEqualsLow;

        return isBearishMarubozu;
    }
}

export function bearishmarubozu(data:StockData, scale: number = 1) {
  return new BearishMarubozu(scale).hasPattern(data);
}
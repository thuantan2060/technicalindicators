import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class BearishInvertedHammerStick extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'BearishInvertedHammerStick';
        this.requiredCount  = 1;
        this.scale = scale;
    }
    logic (data:StockData) {
        let daysOpen  = data.open[0];
        let daysClose = data.close[0];
        let daysHigh  = data.high[0];
        let daysLow   = data.low[0];

        // Basic OHLC validation
        if (!this.validateOHLC(daysOpen, daysHigh, daysLow, daysClose)) {
            return false;
        }

        // Must be a bearish candle (red candle)
        let isBearishInvertedHammer = daysOpen > daysClose;
        
        // The close should be approximately equal to the low (small lower shadow)
        isBearishInvertedHammer = isBearishInvertedHammer && this.approximateEqual(daysClose, daysLow);
        
        // The upper shadow should be at least twice the body size
        let bodySize = daysOpen - daysClose;
        let upperShadow = daysHigh - daysOpen;
        isBearishInvertedHammer = isBearishInvertedHammer && (upperShadow >= bodySize * 2);
        
        // Ensure there's a significant upper shadow (at least some minimum relative to scale)
        let minShadowSize = (daysHigh - daysLow) * 0.1 * this.scale;
        isBearishInvertedHammer = isBearishInvertedHammer && (upperShadow >= minShadowSize);

        return isBearishInvertedHammer;
    }
}

export function bearishinvertedhammerstick(data:StockData, scale: number = 1) {
  return new BearishInvertedHammerStick(scale).hasPattern(data);
}
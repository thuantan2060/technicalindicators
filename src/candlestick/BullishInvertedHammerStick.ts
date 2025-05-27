import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class BullishInvertedHammerStick extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'BullishInvertedHammerStick';
        this.requiredCount  = 1;
        this.scale = scale;
    }
    logic (data:StockData) {
        let daysOpen  = data.open[0];
        let daysClose = data.close[0];
        let daysHigh  = data.high[0];
        let daysLow   = data.low[0];

        // Basic OHLC validation using the base class method
        if (!this.validateOHLC(daysOpen, daysHigh, daysLow, daysClose)) {
            return false;
        }

        // Must be a bullish candle (green candle)
        let isBullishInvertedHammer = daysClose > daysOpen;
        
        // The lower shadow should be very small (low should be approximately equal to open)
        // For inverted hammer, we want minimal lower shadow
        let lowerShadow = daysOpen - daysLow;
        let bodySize = daysClose - daysOpen;
        
        // Lower shadow should be very small relative to body size
        // Allow for some tolerance using approximateEqual or small ratio
        isBullishInvertedHammer = isBullishInvertedHammer && 
            (this.approximateEqual(daysOpen, daysLow) || lowerShadow <= bodySize * 0.1);
        
        // The upper shadow should be at least twice the body size
        let upperShadow = daysHigh - daysClose;
        isBullishInvertedHammer = isBullishInvertedHammer && (upperShadow >= bodySize * 2);
        
        // Ensure there's a significant upper shadow (at least some minimum relative to scale)
        let minShadowSize = (daysHigh - daysLow) * 0.1 * this.scale;
        isBullishInvertedHammer = isBullishInvertedHammer && (upperShadow >= minShadowSize);

        return isBullishInvertedHammer;
    }
}

export function bullishinvertedhammerstick(data:StockData, scale: number = 1) {
  return new BullishInvertedHammerStick(scale).hasPattern(data);
}
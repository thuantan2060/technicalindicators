import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class BullishHammerStick extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'BullishHammerStick';
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

        // Must be a bullish candle (green candle) or doji-like
        let isBullishHammer = daysClose >= daysOpen;
        
        // The close should be approximately equal to the high (small upper shadow)
        isBullishHammer = isBullishHammer && this.approximateEqual(daysClose, daysHigh);
        
        // Calculate sizes
        let bodySize = Math.abs(daysClose - daysOpen);
        let lowerShadow = Math.min(daysOpen, daysClose) - daysLow;
        let totalRange = daysHigh - daysLow;
        
        // Ensure we have a meaningful range to work with
        if (totalRange <= 0) {
            return false;
        }
        
        // Handle very small bodies (doji-like hammers)
        let minBodyForComparison = Math.max(bodySize, totalRange * 0.01 / this.scale);
        
        // The lower shadow should be at least twice the effective body size
        isBullishHammer = isBullishHammer && (lowerShadow >= 2 * minBodyForComparison);
        
        // Ensure there's a significant lower shadow relative to the total range and scale
        let minShadowSize = Math.max(
            totalRange * 0.3 / this.scale,  // At least 30% of total range divided by scale
            minBodyForComparison * 2  // At least twice the effective body size
        );
        isBullishHammer = isBullishHammer && (lowerShadow >= minShadowSize);

        return isBullishHammer;
    }
}

export function bullishhammerstick(data:StockData, scale: number = 1) {
  return new BullishHammerStick(scale).hasPattern(data);
}
import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class BearishHammerStick extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'BearishHammerStick';
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
        let isBearishHammer = daysOpen > daysClose;
        
        // The open should be approximately equal to the high (small upper shadow)
        isBearishHammer = isBearishHammer && this.approximateEqual(daysOpen, daysHigh);
        
        // Calculate sizes
        let bodySize = daysOpen - daysClose;
        let lowerShadow = daysClose - daysLow;
        let upperShadow = daysHigh - daysOpen;
        let totalRange = daysHigh - daysLow;
        
        // For a hammer pattern, we need:
        // 1. A significant lower shadow
        // 2. Small body relative to the total range
        // 3. Small upper shadow
        
        // The lower shadow should be meaningful - at least 1.5 times the body size
        // This is more lenient than the traditional 2x requirement
        let minShadowRatio = 1.5;
        isBearishHammer = isBearishHammer && (lowerShadow >= minShadowRatio * bodySize);
        
        // Ensure there's a significant lower shadow relative to the total range
        // The lower shadow should be at least 40% of the total range
        let minRelativeShadow = totalRange * 0.4;
        
        // For very small ranges, ensure a minimum absolute shadow size
        let minAbsoluteShadow = 0.3 * this.scale;
        
        let requiredShadow = Math.max(minAbsoluteShadow, minRelativeShadow);
        isBearishHammer = isBearishHammer && (lowerShadow >= requiredShadow);
        
        // The body should be relatively small compared to the total range
        // Body should be no more than 40% of the total range for a good hammer
        let maxBodyRatio = 0.4;
        isBearishHammer = isBearishHammer && (bodySize <= totalRange * maxBodyRatio);

        return isBearishHammer;
    }
}

export function bearishhammerstick(data:StockData, scale: number = 1) {
  return new BearishHammerStick(scale).hasPattern(data);
}
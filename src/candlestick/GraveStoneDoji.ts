import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class GraveStoneDoji extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.requiredCount  = 1;
        this.name = 'GraveStoneDoji';
        this.scale = scale;
    }
    logic (data:StockData) {
        // For single candle patterns, we need the last (most recent) candle
        // Since data is in ascending order, the last candle is at the last index
        let lastIndex = data.open.length - 1;
        let daysOpen   = data.open[lastIndex];
        let daysClose  = data.close[lastIndex];
        let daysHigh = data.high[lastIndex];
        let daysLow = data.low[lastIndex];
        
        // Basic validation - ensure we have valid numbers and high >= low
        if (!isFinite(daysOpen) || !isFinite(daysHigh) || !isFinite(daysLow) || !isFinite(daysClose)) {
            return false;
        }
        
        if (daysHigh < daysLow) {
            return false;
        }
        
        // Calculate shadow sizes and body size
        let bodySize = Math.abs(daysClose - daysOpen);
        let upperShadow = daysHigh - Math.max(daysOpen, daysClose);
        let lowerShadow = Math.min(daysOpen, daysClose) - daysLow;
        let totalRange = daysHigh - daysLow;
        
        // Avoid division by zero
        if (totalRange <= 0) {
            return false;
        }
        
        // GraveStone Doji criteria:
        // 1. Small body (open ≈ close) - doji characteristic
        // 2. Open and close should be near the low (at the bottom of the range)
        // 3. Long upper shadow - should dominate the candle
        // 4. Lower shadow should be small relative to upper shadow
        // 5. Upper shadow must be meaningful (not just noise)
        
        // Check if it's a doji (small body)
        let isSmallBody = this.approximateEqual(daysOpen, daysClose);
        
        // Check if open/close are near the low (within 20% of total range from low)
        let openDistanceFromLow = Math.abs(daysOpen - daysLow);
        let closeDistanceFromLow = Math.abs(daysClose - daysLow);
        let maxDistanceFromLow = Math.max(openDistanceFromLow, closeDistanceFromLow);
        let isNearLow = maxDistanceFromLow <= totalRange * 0.2;
        
        // Upper shadow should be significant - at least 60% of total range
        let hasSignificantUpperShadow = upperShadow >= totalRange * 0.6;
        
        // Upper shadow must be meaningful - at least 2x the body size or a minimum threshold
        // Also require a minimum absolute threshold to avoid noise
        let minUpperShadowThreshold = Math.max(bodySize * 2, totalRange * 0.1);
        let minAbsoluteThreshold = 0.04 * this.scale; // Minimum absolute upper shadow
        let hasMeaningfulUpperShadow = upperShadow >= minUpperShadowThreshold && upperShadow >= minAbsoluteThreshold;
        
        // Lower shadow should be minimal - less than 20% of total range
        // Handle negative lower shadow (when low is between open and close)
        let effectiveLowerShadow = Math.max(0, lowerShadow);
        let hasMinimalLowerShadow = effectiveLowerShadow <= totalRange * 0.2;
        
        // Body should be small relative to total range - less than 15% of total range
        let hasSmallBodyRelativeToRange = bodySize <= totalRange * 0.15;
        
        return isSmallBody && isNearLow && hasSignificantUpperShadow && hasMeaningfulUpperShadow && hasMinimalLowerShadow && hasSmallBodyRelativeToRange;
    }
}

export function gravestonedoji(data:StockData, scale: number = 1) {
  return new GraveStoneDoji(scale).hasPattern(data);
}
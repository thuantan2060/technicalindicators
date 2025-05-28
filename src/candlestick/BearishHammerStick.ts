import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for BearishHammerStick pattern.
 * Extends base config with hammer-specific threshold properties.
 */
export interface IBearishHammerStickConfig extends ICandlestickConfig {
    /** Shadow size threshold as percentage of total range (default: 0.3 = 3%) */
    shadowSizeThresholdPercent?: number;
    /** Minimum body comparison as percentage of total range (default: 0.0001 = 0.01%) */
    minBodyComparisonPercent?: number;
}

/**
 * Default configuration for BearishHammerStick pattern.
 */
export const DEFAULT_BEARISH_HAMMER_STICK_CONFIG: IBearishHammerStickConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG,
    shadowSizeThresholdPercent: 0.3,
    minBodyComparisonPercent: 0.0001,
};

export default class BearishHammerStick extends CandlestickFinder {
    private shadowSizeThresholdPercent: number;
    private minBodyComparisonPercent: number;

    constructor(config: IBearishHammerStickConfig = DEFAULT_BEARISH_HAMMER_STICK_CONFIG) {
        super(config);
        this.name = 'BearishHammerStick';
        this.requiredCount = 1;
        
        // Apply configuration with defaults
        const finalConfig = { ...DEFAULT_BEARISH_HAMMER_STICK_CONFIG, ...config };
        this.shadowSizeThresholdPercent = finalConfig.shadowSizeThresholdPercent!;
        this.minBodyComparisonPercent = finalConfig.minBodyComparisonPercent!;
    }
    
    logic(data: StockData) {
        let daysOpen = data.open[0];
        let daysClose = data.close[0];
        let daysHigh = data.high[0];
        let daysLow = data.low[0];

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
        let totalRange = daysHigh - daysLow;
        
        // Ensure we have a meaningful range to work with
        if (totalRange <= 0) {
            return false;
        }
        
        // Handle very small bodies (doji-like hammers)
        // For shadow comparison, use actual body size but ensure a minimum threshold for very small bodies
        let minBodyThreshold = totalRange * this.minBodyComparisonPercent;
        let effectiveBodyForShadowComparison = Math.max(bodySize, minBodyThreshold);
        
        // The lower shadow should be at least 1.5 times the effective body size (more lenient than 2x)
        let shadowVsBodyCheck = lowerShadow >= 1.5 * effectiveBodyForShadowComparison;
        
        // Ensure there's a significant lower shadow relative to the total range
        // Use OR logic: either percentage-based OR body-based threshold should be satisfied
        let percentageBasedThreshold = totalRange * this.shadowSizeThresholdPercent;
        let bodyBasedThreshold = effectiveBodyForShadowComparison * 1.5;  // Updated to match the check above
        
        let shadowVsRangeCheck = lowerShadow >= percentageBasedThreshold || lowerShadow >= bodyBasedThreshold;
        
        // Both checks should pass
        isBearishHammer = isBearishHammer && shadowVsBodyCheck && shadowVsRangeCheck;

        return isBearishHammer;
    }
}

export function bearishhammerstick(data: StockData, config: IBearishHammerStickConfig = DEFAULT_BEARISH_HAMMER_STICK_CONFIG) {
    return new BearishHammerStick(config).hasPattern(data);
}
import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for BullishHammerStick pattern.
 * Includes thresholds for shadow and body analysis.
 */
export interface IBullishHammerConfig extends ICandlestickConfig {
    /** Shadow size threshold as percentage of total range (default: 0.001 = 0.1%) */
    shadowSizeThresholdPercent?: number;
    /** Minimum body comparison as percentage of total range (default: 0.0001 = 0.01%) */
    minBodyComparisonPercent?: number;
}

/**
 * Default configuration for BullishHammerStick pattern.
 */
export const DEFAULT_BULLISH_HAMMER_CONFIG: IBullishHammerConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG,
    shadowSizeThresholdPercent: 0.001,
    minBodyComparisonPercent: 0.0001
};

export default class BullishHammerStick extends CandlestickFinder {
    private shadowSizeThresholdPercent: number;
    private minBodyComparisonPercent: number;

    constructor(config?: IBullishHammerConfig) {
        const finalConfig = { ...DEFAULT_BULLISH_HAMMER_CONFIG, ...config };
        super(finalConfig);
        this.name = 'BullishHammerStick';
        this.requiredCount = 1;

        // Apply configuration with defaults
        this.shadowSizeThresholdPercent = finalConfig.shadowSizeThresholdPercent!;
        this.minBodyComparisonPercent = finalConfig.minBodyComparisonPercent!;
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
        // Use direct threshold calculation instead of utility function
        let minBodyForComparison = Math.max(
            bodySize,
            totalRange * this.minBodyComparisonPercent
        );

        // The lower shadow should be at least twice the effective body size
        isBullishHammer = isBullishHammer && (lowerShadow >= 2 * minBodyForComparison);

        // Ensure there's a significant lower shadow relative to the total range
        // Use direct threshold calculations instead of utility functions
        let minShadowSize = Math.max(
            totalRange * this.shadowSizeThresholdPercent * 300,  // Replaces: getShadowSizeThreshold(totalRange) * 300
            minBodyForComparison * 2  // At least twice the effective body size
        );
        isBullishHammer = isBullishHammer && (lowerShadow >= minShadowSize);

        return isBullishHammer;
    }
}

export function bullishhammerstick(data:StockData, options: IBullishHammerConfig = DEFAULT_BULLISH_HAMMER_CONFIG) {
    return new BullishHammerStick(options).hasPattern(data);
}
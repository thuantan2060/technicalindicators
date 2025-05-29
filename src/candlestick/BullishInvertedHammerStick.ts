import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for BullishInvertedHammerStick pattern.
 * Extends base config with hammer-specific threshold properties.
 */
export interface IBullishInvertedHammerStickConfig extends ICandlestickConfig {
    /** Shadow size threshold as percentage of total range (default: 0.001 = 0.1%) */
    shadowSizeThresholdPercent?: number;
    /** Minimum body comparison as percentage of total range (default: 0.0001 = 0.01%) */
    minBodyComparisonPercent?: number;
    /** Minimum shadow size as percentage of range (default: 0.001 = 0.1%) */
    minShadowSizePercent?: number;
}

/**
 * Default configuration for BullishInvertedHammerStick pattern.
 */
export const DEFAULT_BULLISH_INVERTED_HAMMER_STICK_CONFIG: IBullishInvertedHammerStickConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG,
    shadowSizeThresholdPercent: 0.001,
    minBodyComparisonPercent: 0.0001,
};

export default class BullishInvertedHammerStick extends CandlestickFinder {
    private shadowSizeThresholdPercent: number;
    private minBodyComparisonPercent: number;

    constructor(config?: IBullishInvertedHammerStickConfig) {
        const finalConfig = { ...DEFAULT_BULLISH_INVERTED_HAMMER_STICK_CONFIG, ...config };
        super(finalConfig);
        this.name = 'BullishInvertedHammerStick';
        this.requiredCount = 1;

        // Apply configuration with defaults
        this.shadowSizeThresholdPercent = finalConfig.shadowSizeThresholdPercent!;
        this.minBodyComparisonPercent = finalConfig.minBodyComparisonPercent!;
    }

    logic(data: StockData) {
        let daysOpen = data.open[0];
        let daysClose = data.close[0];
        let daysHigh = data.high[0];
        let daysLow = data.low[0];

        // Basic OHLC validation using the base class method
        if (!this.validateOHLC(daysOpen, daysHigh, daysLow, daysClose)) {
            return false;
        }

        // Must be a bullish candle (green candle)
        let isBullishInvertedHammer = daysClose > daysOpen;

        // Calculate sizes
        let bodySize = daysClose - daysOpen;
        let lowerShadow = daysOpen - daysLow;
        let upperShadow = daysHigh - daysClose;
        let totalRange = daysHigh - daysLow;

        // Ensure we have a meaningful range to work with
        if (totalRange <= 0) {
            return false;
        }

        // The lower shadow should be very small (low should be approximately equal to open)
        // For inverted hammer, we want minimal lower shadow
        isBullishInvertedHammer = isBullishInvertedHammer &&
            (this.approximateEqual(daysOpen, daysLow) || lowerShadow <= bodySize * 0.1);

        // Handle very small bodies (doji-like inverted hammers)
        // Use direct threshold calculation instead of utility function
        let minBodyForComparison = Math.max(
            bodySize,
            totalRange * this.minBodyComparisonPercent
        );

        // The upper shadow should be at least twice the effective body size
        isBullishInvertedHammer = isBullishInvertedHammer && (upperShadow >= 2 * minBodyForComparison);

        // Ensure there's a significant upper shadow relative to the total range
        // Use direct threshold calculations instead of utility functions
        let minShadowSize = Math.max(
            totalRange * this.shadowSizeThresholdPercent * 300,  // Replaces: getShadowSizeThreshold(totalRange) * 300
            minBodyForComparison * 2  // At least twice the effective body size
        );
        isBullishInvertedHammer = isBullishInvertedHammer && (upperShadow >= minShadowSize);

        return isBullishInvertedHammer;
    }
}

export function bullishinvertedhammerstick(data: StockData, config: IBullishInvertedHammerStickConfig = DEFAULT_BULLISH_INVERTED_HAMMER_STICK_CONFIG) {
    return new BullishInvertedHammerStick(config).hasPattern(data);
}
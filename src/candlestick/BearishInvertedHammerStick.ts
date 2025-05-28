import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for BearishInvertedHammerStick pattern.
 * Includes thresholds for shadow size analysis.
 */
export interface IBearishInvertedHammerConfig extends ICandlestickConfig {
    /** Shadow size threshold as percentage of total range (default: 0.001 = 0.1%) */
    shadowSizeThresholdPercent?: number;
}

/**
 * Default configuration for BearishInvertedHammerStick pattern.
 */
export const DEFAULT_BEARISH_INVERTED_HAMMER_CONFIG: IBearishInvertedHammerConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG,
    shadowSizeThresholdPercent: 0.001
};

export default class BearishInvertedHammerStick extends CandlestickFinder {
    private shadowSizeThresholdPercent: number;

    constructor(config: IBearishInvertedHammerConfig = DEFAULT_BEARISH_INVERTED_HAMMER_CONFIG) {
        super(config);
        this.name = 'BearishInvertedHammerStick';
        this.requiredCount = 1;
        
        // Apply configuration with defaults
        const finalConfig = { ...DEFAULT_BEARISH_INVERTED_HAMMER_CONFIG, ...config };
        this.shadowSizeThresholdPercent = finalConfig.shadowSizeThresholdPercent!;
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
        let isBearishInvertedHammer = daysOpen > daysClose;
        
        // The close should be approximately equal to the low (small lower shadow)
        // Note: approximateEqual uses scale for price comparison precision
        isBearishInvertedHammer = isBearishInvertedHammer && this.approximateEqual(daysClose, daysLow);
        
        // The upper shadow should be at least twice the body size
        let bodySize = daysOpen - daysClose;
        let upperShadow = daysHigh - daysOpen;
        isBearishInvertedHammer = isBearishInvertedHammer && (upperShadow >= bodySize * 2);
        
        // Ensure there's a significant upper shadow using direct threshold calculation
        let range = daysHigh - daysLow;
        let minShadowSize = range * this.shadowSizeThresholdPercent;
        isBearishInvertedHammer = isBearishInvertedHammer && (upperShadow >= minShadowSize);

        return isBearishInvertedHammer;
    }
}

export function bearishinvertedhammerstick(data: StockData, config: IBearishInvertedHammerConfig = DEFAULT_BEARISH_INVERTED_HAMMER_CONFIG) {
    return new BearishInvertedHammerStick(config).hasPattern(data);
}
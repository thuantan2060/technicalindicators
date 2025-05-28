import StockData from '../StockData';
import HammerPattern, { IHammerPatternConfig, DEFAULT_HAMMER_PATTERN_CONFIG } from './HammerPattern';
import { bearishhammerstick, DEFAULT_BEARISH_HAMMER_STICK_CONFIG, IBearishHammerStickConfig } from './BearishHammerStick';
import { bearishinvertedhammerstick, DEFAULT_BEARISH_INVERTED_HAMMER_CONFIG, IBearishInvertedHammerConfig } from './BearishInvertedHammerStick';
import { bullishhammerstick, DEFAULT_BULLISH_HAMMER_CONFIG, IBullishHammerConfig } from './BullishHammerStick';
import { bullishinvertedhammerstick, DEFAULT_BULLISH_INVERTED_HAMMER_STICK_CONFIG, IBullishInvertedHammerStickConfig } from './BullishInvertedHammerStick';

/**
 * Configuration interface for HammerPatternUnconfirmed.
 * Extends HammerPattern configuration.
 */
export interface IHammerPatternUnconfirmedConfig extends IHammerPatternConfig, IBullishHammerConfig, IBullishInvertedHammerStickConfig, IBearishHammerStickConfig, IBearishInvertedHammerConfig {
    // No additional properties needed - inherits from HammerPattern
}

/**
 * Default configuration for HammerPatternUnconfirmed.
 */
export const DEFAULT_HAMMER_PATTERN_UNCONFIRMED_CONFIG: IHammerPatternUnconfirmedConfig = {
    ...DEFAULT_HAMMER_PATTERN_CONFIG,
    ...DEFAULT_BULLISH_HAMMER_CONFIG,
    ...DEFAULT_BULLISH_INVERTED_HAMMER_STICK_CONFIG,
    ...DEFAULT_BEARISH_HAMMER_STICK_CONFIG,
    ...DEFAULT_BEARISH_INVERTED_HAMMER_CONFIG
};

export default class HammerPatternUnconfirmed extends HammerPattern {

    constructor(config: IHammerPatternUnconfirmedConfig = DEFAULT_HAMMER_PATTERN_UNCONFIRMED_CONFIG) {
        super(config);
        this.name = 'HammerPatternUnconfirmed';
        this.requiredCount = 4; // Reduced from 5 since no confirmation needed
    }

    logic(data: StockData) {
        // Validate data integrity first
        for (let i = 0; i < data.close.length; i++) {
            if (!this.validateOHLC(data.open[i], data.high[i], data.low[i], data.close[i])) {
                return false;
            }
        }
        
        // Check for downward trend and hammer pattern without confirmation
        // Pass false to indicate this is an unconfirmed pattern
        let isPattern = this.downwardTrend(data, false);
        isPattern = isPattern && this.includesHammer(data, false);
        return isPattern;
    }

    // Override the downwardTrend method to be more lenient for unconfirmed patterns
    downwardTrend(data: StockData, confirm = true) {
        // Ensure we have enough data
        if (data.close.length < (confirm ? 5 : 4)) {
            return false;
        }
        
        // For unconfirmed patterns, we need at least 3 candles before the hammer
        // to establish a downward trend
        let trendLength = confirm ? 3 : 3;
        let trendData = data.close.slice(0, trendLength);
        
        // Simple downward trend check: first close > last close in trend
        let hasOverallDecline = trendData[0] > trendData[trendLength - 1];
        
        // Additional check: ensure there's meaningful price movement
        let priceRange = Math.max(...trendData) - Math.min(...trendData);
        let minMovement = priceRange * 0.02; // At least 2% movement
        
        // Check for at least one significant down move
        let hasSignificantMove = false;
        for (let i = 1; i < trendLength; i++) {
            if (trendData[i - 1] - trendData[i] >= minMovement) {
                hasSignificantMove = true;
                break;
            }
        }
        
        return hasOverallDecline && hasSignificantMove;
    }

    // Override includesHammer to work with 4 candles instead of 5
    includesHammer(data: StockData, confirm = true) {
        // Ensure we have the required data
        if (data.close.length < (confirm ? 5 : 4)) {
            return false;
        }
        
        // For unconfirmed pattern, check for hammer at the last index (index 3)
        let hammerIndex = confirm ? 3 : 3;
        
        let possibleHammerData = {
            open: [data.open[hammerIndex]],
            close: [data.close[hammerIndex]],
            low: [data.low[hammerIndex]],
            high: [data.high[hammerIndex]],
        };

        // Use the appropriate function signatures - mix of updated and not yet updated
        let isPattern = bearishhammerstick(possibleHammerData, this.config);
        isPattern = isPattern || bearishinvertedhammerstick(possibleHammerData, this.config);
        isPattern = isPattern || bullishhammerstick(possibleHammerData, this.config);
        isPattern = isPattern || bullishinvertedhammerstick(possibleHammerData, this.config);

        return isPattern;
    }
}

export function hammerpatternunconfirmed(data: StockData, config: IHammerPatternUnconfirmedConfig = DEFAULT_HAMMER_PATTERN_UNCONFIRMED_CONFIG) {
    return new HammerPatternUnconfirmed(config).hasPattern(data);
}

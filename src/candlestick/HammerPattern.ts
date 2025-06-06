import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';
import { averageloss } from '../Utils/AverageLoss';
import { averagegain } from '../Utils/AverageGain';
import { bearishhammerstick, DEFAULT_BEARISH_HAMMER_STICK_CONFIG, IBearishHammerStickConfig } from './BearishHammerStick';
import { bearishinvertedhammerstick, DEFAULT_BEARISH_INVERTED_HAMMER_CONFIG, IBearishInvertedHammerConfig } from './BearishInvertedHammerStick';
import { bullishhammerstick, DEFAULT_BULLISH_HAMMER_CONFIG, IBullishHammerConfig } from './BullishHammerStick';
import { bullishinvertedhammerstick, DEFAULT_BULLISH_INVERTED_HAMMER_STICK_CONFIG, IBullishInvertedHammerStickConfig } from './BullishInvertedHammerStick';

/**
 * Configuration interface for HammerPattern.
 * Only requires scale parameter since this pattern uses direct price comparisons.
 */
export interface IHammerPatternConfig extends ICandlestickConfig, IBullishHammerConfig, IBullishInvertedHammerStickConfig, IBearishHammerStickConfig, IBearishInvertedHammerConfig {
    // No additional properties needed - only uses scale for validateOHLC
}

/**
 * Default configuration for HammerPattern.
 */
export const DEFAULT_HAMMER_PATTERN_CONFIG: IHammerPatternConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG,
    ...DEFAULT_BULLISH_HAMMER_CONFIG,
    ...DEFAULT_BULLISH_INVERTED_HAMMER_STICK_CONFIG,
    ...DEFAULT_BEARISH_HAMMER_STICK_CONFIG,
    ...DEFAULT_BEARISH_INVERTED_HAMMER_CONFIG
};

export default class HammerPattern extends CandlestickFinder {
    protected readonly config: IHammerPatternConfig;

    constructor(config?: IHammerPatternConfig) {
        const finalConfig = { ...DEFAULT_HAMMER_PATTERN_CONFIG, ...config };
        super(finalConfig);
        this.name = 'HammerPattern';
        this.requiredCount = 5;
        this.config = finalConfig;
    }

    logic(data: StockData) {
        // Validate data integrity first
        for (let i = 0; i < data.close.length; i++) {
            if (!this.validateOHLC(data.open[i], data.high[i], data.low[i], data.close[i])) {
                return false;
            }
        }

        let isPattern = this.downwardTrend(data);
        isPattern = isPattern && this.includesHammer(data);
        isPattern = isPattern && this.hasConfirmation(data);
        return isPattern;
    }

    downwardTrend(data: StockData, confirm = true) {
        // Ensure we have enough data
        if (data.close.length < (confirm ? 5 : 4)) {
            return false;
        }

        // Analyze trend in the first 3 candles (indices 0, 1, 2)
        // These should show a downward trend leading to the hammer
        let trendData = data.close.slice(0, 3);

        // Calculate average gains and losses over the trend period
        let gains = averagegain({ values: trendData, period: 2 });
        let losses = averageloss({ values: trendData, period: 2 });

        // Get the latest values from the arrays
        let latestGain = gains.length > 0 ? gains[gains.length - 1] : 0;
        let latestLoss = losses.length > 0 ? losses[losses.length - 1] : 0;

        // Additional validation: ensure there's actual price movement
        let priceRange = Math.max(...trendData) - Math.min(...trendData);
        let minMovement = priceRange * 0.01; // At least 1% movement

        // For a downward trend, we expect more losses than gains
        // Also check that the closing prices generally decline
        let overallDecline = trendData[0] > trendData[trendData.length - 1];

        return latestLoss > latestGain && latestLoss > minMovement && overallDecline;
    }

    includesHammer(data: StockData, confirm = true) {
        // Ensure we have the required data
        if (data.close.length < (confirm ? 5 : 4)) {
            return false;
        }

        // Check for hammer at index 3 (4th candle)
        let hammerIndex = 3;

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

    hasConfirmation(data: StockData) {
        // Ensure we have enough data
        if (data.close.length < 5) {
            return false;
        }

        let possibleHammer = {
            open: data.open[3],
            close: data.close[3],
            low: data.low[3],
            high: data.high[3],
        }
        let possibleConfirmation = {
            open: data.open[4],
            close: data.close[4],
            low: data.low[4],
            high: data.high[4],
        }

        // Validate OHLC data
        if (!this.validateOHLC(possibleHammer.open, possibleHammer.high, possibleHammer.low, possibleHammer.close) ||
            !this.validateOHLC(possibleConfirmation.open, possibleConfirmation.high, possibleConfirmation.low, possibleConfirmation.close)) {
            return false;
        }

        // Confirmation candlestick should be bullish (close > open)
        let isBullishConfirmation = possibleConfirmation.close > possibleConfirmation.open;

        // The confirmation should close higher than the hammer's close
        // and show meaningful upward movement
        let upwardMovement = possibleConfirmation.close - possibleHammer.close;
        let minMovement = (possibleHammer.high - possibleHammer.low) * 0.1; // At least 10% of hammer's range

        return isBullishConfirmation && upwardMovement > 0 && upwardMovement >= minMovement;
    }
}

export function hammerpattern(data: StockData, config: IHammerPatternConfig = DEFAULT_HAMMER_PATTERN_CONFIG) {
    return new HammerPattern(config).hasPattern(data);
}

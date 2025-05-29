import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';
import { averageloss } from '../Utils/AverageLoss';
import { averagegain } from '../Utils/AverageGain';

/**
 * Configuration interface for HangingMan pattern.
 * Includes thresholds for movement and confirmation analysis.
 */
export interface IHangingManConfig extends ICandlestickConfig {
    /** Minimum threshold for absolute measurements (default: 0.01) */
    minimumThreshold?: number;
    /** Absolute minimum for very small values (default: 0.001) */
    absoluteMinimum?: number;
    /** Movement threshold multiplier for confirmation (default: 1.0) */
    movementThresholdBase?: number;
    /** Movement threshold scale factor (default: 0.3) */
    movementThresholdScale?: number;
}

/**
 * Default configuration for HangingMan pattern.
 */
export const DEFAULT_HANGING_MAN_CONFIG: IHangingManConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG,
    minimumThreshold: 0.01,
    absoluteMinimum: 0.001,
    movementThresholdBase: 1.0,
    movementThresholdScale: 0.3
};

export default class HangingMan extends CandlestickFinder {
    private minimumThreshold: number;
    private absoluteMinimum: number;
    private movementThresholdBase: number;
    private movementThresholdScale: number;

    constructor(config?: IHangingManConfig) {
        const finalConfig = { ...DEFAULT_HANGING_MAN_CONFIG, ...config };
        super(finalConfig);
        this.name = 'HangingMan';
        this.requiredCount = 5;

        // Apply configuration with defaults
        this.minimumThreshold = finalConfig.minimumThreshold!;
        this.absoluteMinimum = finalConfig.absoluteMinimum!;
        this.movementThresholdBase = finalConfig.movementThresholdBase!;
        this.movementThresholdScale = finalConfig.movementThresholdScale!;
    }

    logic(data: StockData) {
        // Validate data integrity first
        for (let i = 0; i < data.close.length; i++) {
            if (!this.validateOHLC(data.open[i], data.high[i], data.low[i], data.close[i])) {
                return false;
            }
        }

        let hasUptrend = this.upwardTrend(data);
        let hasHammer = this.includesHammer(data);
        let hasConfirmation = this.hasConfirmation(data);

        let isPattern = hasUptrend && hasHammer && hasConfirmation;
        return isPattern;
    }

    upwardTrend(data: StockData) {
        // For hanging man, we need an uptrend in the first 4 candles (indices 0-3)
        // Since data is in ascending order, we analyze the trend leading up to the hammer

        // Ensure we have enough data
        if (data.close.length < 4) {
            return false;
        }

        // Analyze trends in closing prices of the first four candlesticks (indices 0-3)
        let trendData = data.close.slice(0, 4);

        // Check for overall upward movement
        let firstClose = trendData[0];
        let lastClose = trendData[trendData.length - 1];

        // Must have overall upward movement
        if (lastClose <= firstClose) {
            return false;
        }

        // Calculate gains and losses for trend analysis
        let gains = averagegain({ values: trendData, period: trendData.length - 1 });
        let losses = averageloss({ values: trendData, period: trendData.length - 1 });

        // Get the latest values from the arrays
        let latestGain = gains.length > 0 ? gains[gains.length - 1] : 0;
        let latestLoss = losses.length > 0 ? losses[losses.length - 1] : 0;

        // Additional validation: ensure there's meaningful price movement
        let priceRange = Math.max(...trendData) - Math.min(...trendData);
        let totalMovement = Math.abs(lastClose - firstClose);
        let minMovement = priceRange * 0.02; // At least 2% movement relative to range

        // Upward trend: more gains than losses, and significant upward movement
        return latestGain > latestLoss && totalMovement >= minMovement;
    }

    includesHammer(data: StockData) {
        // The hammer should be at index 3 (4th candle) in the 5-candle pattern
        // This is the candle just before the confirmation candle

        // Ensure we have the required data
        if (data.close.length < 4) {
            return false;
        }

        // Use a more lenient hammer detection for hanging man pattern
        return this.isHammerLike(data.open[3], data.high[3], data.low[3], data.close[3]);
    }

    // Custom hammer-like detection that's more lenient than the strict hammer patterns
    private isHammerLike(open: number, high: number, low: number, close: number): boolean {
        // Basic OHLC validation
        if (!this.validateOHLC(open, high, low, close)) {
            return false;
        }

        let bodySize = Math.abs(close - open);
        let lowerShadow = Math.min(open, close) - low;
        let upperShadow = high - Math.max(open, close);
        let totalRange = high - low;

        // Ensure we have a meaningful range
        if (totalRange <= 0) {
            return false;
        }

        // For hanging man, we need:
        // 1. A lower shadow that's meaningful relative to the total range
        // 2. The lower shadow should be larger than the upper shadow
        // 3. The body should not dominate the entire candle

        // Lower shadow should be at least 5% of the total range (very lenient)
        let minLowerShadowRatio = 0.05;
        let hasSignificantLowerShadow = lowerShadow >= totalRange * minLowerShadowRatio;

        // Lower shadow should be larger than or equal to upper shadow (hammer characteristic)
        let lowerShadowDominates = lowerShadow >= upperShadow;

        // Body should not be more than 90% of total range (very lenient)
        let bodyNotTooLarge = bodySize <= totalRange * 0.9;

        // For very small ranges, ensure minimum absolute lower shadow
        // Use direct threshold calculation instead of utility function
        let minAbsoluteLowerShadow = this.minimumThreshold * this.scale;
        let hasMinimumShadow = lowerShadow >= minAbsoluteLowerShadow;

        return hasSignificantLowerShadow && lowerShadowDominates && bodyNotTooLarge && hasMinimumShadow;
    }

    hasConfirmation(data: StockData) {
        // Ensure we have enough data (need 5 candles total)
        if (data.close.length < 5) {
            return false;
        }

        let hammerCandle = {
            open: data.open[3],
            close: data.close[3],
            low: data.low[3],
            high: data.high[3],
        }
        let confirmationCandle = {
            open: data.open[4],
            close: data.close[4],
            low: data.low[4],
            high: data.high[4],
        }

        // Validate OHLC data
        if (!this.validateOHLC(hammerCandle.open, hammerCandle.high, hammerCandle.low, hammerCandle.close) ||
            !this.validateOHLC(confirmationCandle.open, confirmationCandle.high, confirmationCandle.low, confirmationCandle.close)) {
            return false;
        }

        // Confirmation candlestick should be bearish (hanging man is bearish reversal)
        let isBearishConfirmation = confirmationCandle.open > confirmationCandle.close;

        // The confirmation candle itself should be meaningfully bearish
        let confirmationBearishness = confirmationCandle.open - confirmationCandle.close;
        let confirmationRange = confirmationCandle.high - confirmationCandle.low;
        let minConfirmationBearishness = Math.max(
            confirmationRange * 0.1, // At least 10% of confirmation candle's range
            this.absoluteMinimum * this.scale * 5 // Use direct threshold calculation
        );
        let isStrongBearishConfirmation = confirmationBearishness >= minConfirmationBearishness;

        // The confirmation should show meaningful downward movement
        // It should close below the hammer's close
        let closesLower = confirmationCandle.close < hammerCandle.close;

        // Calculate the downward movement as a percentage of the hammer's range
        let hammerRange = hammerCandle.high - hammerCandle.low;
        let downwardMovement = hammerCandle.close - confirmationCandle.close;

        // Require meaningful downward movement - at least 15% of hammer's range
        // Use direct threshold calculation instead of utility function
        let minMovementRatio = 0.15; // 15% of hammer range
        let minAbsoluteMovement = this.movementThresholdBase + (this.movementThresholdScale * this.scale);
        let requiredMovement = Math.max(hammerRange * minMovementRatio, minAbsoluteMovement);

        let hasSignificantDownwardMovement = downwardMovement >= requiredMovement;

        return isBearishConfirmation && isStrongBearishConfirmation && closesLower && hasSignificantDownwardMovement;
    }
}

export function hangingman(data: StockData, config: IHangingManConfig = DEFAULT_HANGING_MAN_CONFIG) {
    return new HangingMan(config).hasPattern(data);
}

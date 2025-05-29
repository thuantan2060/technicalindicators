import StockData from '../StockData';
import ShootingStar, { IShootingStarConfig, DEFAULT_SHOOTING_STAR_CONFIG } from './ShootingStar';
import { averageloss } from '../Utils/AverageLoss';
import { averagegain } from '../Utils/AverageGain';
import { bearishinvertedhammerstick, DEFAULT_BEARISH_INVERTED_HAMMER_CONFIG } from './BearishInvertedHammerStick';
import { bullishinvertedhammerstick, DEFAULT_BULLISH_INVERTED_HAMMER_STICK_CONFIG } from './BullishInvertedHammerStick';

/**
 * Configuration interface for ShootingStarUnconfirmed pattern.
 * Extends ShootingStar configuration.
 */
export interface IShootingStarUnconfirmedConfig extends IShootingStarConfig {
    // No additional properties needed - inherits from ShootingStar
}

/**
 * Default configuration for ShootingStarUnconfirmed pattern.
 */
export const DEFAULT_SHOOTING_STAR_UNCONFIRMED_CONFIG: IShootingStarUnconfirmedConfig = {
    ...DEFAULT_SHOOTING_STAR_CONFIG
};

export default class ShootingStarUnconfirmed extends ShootingStar {
    constructor(config?: IShootingStarUnconfirmedConfig) {
        const finalConfig = { ...DEFAULT_SHOOTING_STAR_UNCONFIRMED_CONFIG, ...config };
        super(finalConfig);
        this.name = 'ShootingStarUnconfirmed';
        this.requiredCount = 4; // Reduced from 5 since no confirmation needed
    }

    logic (data:StockData) {
        // Validate data integrity first
        for (let i = 0; i < data.close.length; i++) {
            if (!this.validateOHLC(data.open[i], data.high[i], data.low[i], data.close[i])) {
                return false;
            }
        }

        // Check for upward trend and inverted hammer pattern without confirmation
        let isPattern = this.upwardTrend(data, false);
        isPattern = isPattern && this.includesInvertedHammer(data, false);
        return isPattern;
    }

    upwardTrend (data:StockData, confirm = false) {
        // For unconfirmed pattern, we analyze the first 3 candles for upward trend
        let end = 3;

        // Ensure we have enough data
        if (data.close.length < end) {
            return false;
        }

        // Analyze trends in closing prices of the first three candlesticks
        // For ascending order data, we look at the first 'end' elements
        let gains = averagegain({ values: data.close.slice(0, end), period: end - 1 });
        let losses = averageloss({ values: data.close.slice(0, end), period: end - 1 });

        // Get the latest values from the arrays
        let latestGain = gains.length > 0 ? gains[gains.length - 1] : 0;
        let latestLoss = losses.length > 0 ? losses[losses.length - 1] : 0;

        // Additional validation: ensure there's actual price movement
        let closeSlice = data.close.slice(0, end);
        let priceRange = Math.max(...closeSlice) - Math.min(...closeSlice);
        let minMovement = priceRange * 0.01; // At least 1% movement

        // Upward trend, so more gains than losses, and significant movement
        return latestGain > latestLoss && latestGain > minMovement;
    }

    includesInvertedHammer (data:StockData, confirm = false) {
        // For unconfirmed pattern, check the last candle (index 3)
        let start = 3;
        let end = 4;

        // Ensure we have the required data
        if (data.close.length < end) {
            return false;
        }

        let possibleInvertedHammerData = {
            open: data.open.slice(start, end),
            close: data.close.slice(start, end),
            low: data.low.slice(start, end),
            high: data.high.slice(start, end),
        };

        // Use the updated inverted hammer functions with config objects
        let isPattern = bearishinvertedhammerstick(possibleInvertedHammerData, DEFAULT_BEARISH_INVERTED_HAMMER_CONFIG);
        isPattern = isPattern || bullishinvertedhammerstick(possibleInvertedHammerData, DEFAULT_BULLISH_INVERTED_HAMMER_STICK_CONFIG);

        // If not detected by standard inverted hammer logic, check for doji with upper shadow
        if (!isPattern) {
            let daysOpen = possibleInvertedHammerData.open[0];
            let daysClose = possibleInvertedHammerData.close[0];
            let daysHigh = possibleInvertedHammerData.high[0];
            let daysLow = possibleInvertedHammerData.low[0];

            // Check for doji (open ≈ close) with long upper shadow
            let isDoji = this.approximateEqual(daysOpen, daysClose);
            let hasMinimalLowerShadow = this.approximateEqual(daysLow, Math.min(daysOpen, daysClose));
            let upperShadow = daysHigh - Math.max(daysOpen, daysClose);
            let totalRange = daysHigh - daysLow;

            // For doji shooting star: minimal body, minimal lower shadow, significant upper shadow
            isPattern = isDoji && hasMinimalLowerShadow && (upperShadow >= totalRange * 0.6);
        }

        return isPattern;
    }
}

/**
 * Detects ShootingStarUnconfirmed candlestick pattern in the provided stock data.
 *
 * A ShootingStarUnconfirmed is a bearish reversal pattern that appears at the end of an uptrend.
 * Unlike the confirmed version, this pattern doesn't require confirmation from the next candle.
 * It consists of:
 * 1. An uptrend in the first 3 candles
 * 2. An inverted hammer-like candle (small body with long upper shadow) at the 4th position
 *
 * This pattern suggests potential bearish reversal but is less reliable than the confirmed version.
 *
 * @param data - Stock data containing OHLC values for at least 4 periods
 * @param config - Configuration object for pattern detection
 * @param config.scale - Scale parameter for approximateEqual function precision (default: 0.001)
 * @returns True if ShootingStarUnconfirmed pattern is detected, false otherwise
 *
 * @example
 * ```typescript
 * // Using default configuration
 * const hasShootingStarUnconfirmedPattern = shootingstarunconfirmed(stockData);
 *
 * // Using custom configuration
 * const hasShootingStarUnconfirmedPattern = shootingstarunconfirmed(stockData, {
 *   scale: 0.002
 * });
 *
 * // Backward compatibility with scale parameter
 * const hasShootingStarUnconfirmedPattern = shootingstarunconfirmed(stockData, { scale: 0.002 });
 * ```
 */
export function shootingstarunconfirmed(data: StockData, config: IShootingStarUnconfirmedConfig = DEFAULT_SHOOTING_STAR_UNCONFIRMED_CONFIG) {
  return new ShootingStarUnconfirmed(config).hasPattern(data);
}

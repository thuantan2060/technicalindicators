import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for BearishMarubozu pattern.
 * Includes body tolerance thresholds for determining shadow significance.
 */
export interface IBearishMarubozuConfig extends ICandlestickConfig {
    /** Body tolerance as percentage of body size (default: 0.015 = 1.5%) */
    bodyTolerancePercent?: number;
    /** Minimum body tolerance absolute value (default: 0.00015) */
    bodyToleranceMinimum?: number;
}

/**
 * Default configuration for BearishMarubozu pattern.
 */
export const DEFAULT_BEARISH_MARUBOZU_CONFIG: IBearishMarubozuConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG,
    bodyTolerancePercent: 0.015,
    bodyToleranceMinimum: 0.00015
};

export default class BearishMarubozu extends CandlestickFinder {
    private bodyTolerancePercent: number;
    private bodyToleranceMinimum: number;

    constructor(config?: IBearishMarubozuConfig) {
        const finalConfig = { ...DEFAULT_BEARISH_MARUBOZU_CONFIG, ...config };
        super(finalConfig);
        this.name = 'BearishMarubozu';
        this.requiredCount = 1;

        // Apply configuration with defaults
        this.bodyTolerancePercent = finalConfig.bodyTolerancePercent!;
        this.bodyToleranceMinimum = finalConfig.bodyToleranceMinimum!;
    }

    logic (data:StockData) {
        let daysOpen  = data.open[0];
        let daysClose = data.close[0];
        let daysHigh  = data.high[0];
        let daysLow   = data.low[0];

        // Validate OHLC data
        if (!this.validateOHLC(daysOpen, daysHigh, daysLow, daysClose)) {
            return false;
        }

        // Bearish Marubozu: open > close, open = high, close = low (no shadows)
        let isBearish = daysOpen > daysClose;

        // For Marubozu, we need strict equality for open=high and close=low
        // Allow small tolerance for rounding errors but reject significant shadows
        let bodySize = Math.abs(daysOpen - daysClose);
        // Use direct threshold calculation instead of utility function
        let maxTolerance = Math.max(
            bodySize * this.bodyTolerancePercent,
            this.bodyToleranceMinimum
        );

        let upperShadow = Math.abs(daysHigh - daysOpen);
        let lowerShadow = Math.abs(daysLow - daysClose);

        let isOpenEqualsHigh = upperShadow <= maxTolerance;
        let isCloseEqualsLow = lowerShadow <= maxTolerance;

        let isBearishMarubozu = isBearish && isOpenEqualsHigh && isCloseEqualsLow;

        return isBearishMarubozu;
    }
}

/**
 * Detects Bearish Marubozu candlestick pattern in the provided stock data.
 *
 * A Bearish Marubozu is a long bearish candlestick with no upper or lower shadows,
 * indicating strong selling pressure throughout the trading session. The opening price
 * equals the high and the closing price equals the low.
 *
 * @param data - Stock data containing OHLC values
 * @param config - Configuration object for pattern detection
 * @param config.scale - Scale parameter for approximateEqual function precision (default: 0.001)
 * @param config.bodyTolerancePercent - Body tolerance as percentage of body size (default: 0.015 = 1.5%)
 * @param config.bodyToleranceMinimum - Minimum body tolerance absolute value (default: 0.00015)
 * @returns True if Bearish Marubozu pattern is detected, false otherwise
 *
 * @example
 * ```typescript
 * // Using default configuration
 * const hasBearishMarubozuPattern = bearishmarubozu(stockData);
 *
 * // Using custom configuration
 * const hasBearishMarubozuPattern = bearishmarubozu(stockData, {
 *   scale: 0.002,
 *   bodyTolerancePercent: 0.02,
 *   bodyToleranceMinimum: 0.0002
 * });
 *
 * // Backward compatibility with scale parameter
 * const hasBearishMarubozuPattern = bearishmarubozu(stockData, { scale: 0.002 });
 * ```
 */
export function bearishmarubozu(data: StockData, config: IBearishMarubozuConfig = DEFAULT_BEARISH_MARUBOZU_CONFIG) {
    return new BearishMarubozu(config).hasPattern(data);
}
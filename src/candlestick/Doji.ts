import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for Doji pattern.
 * Includes body tolerance thresholds for determining when open equals close.
 */
export interface IDojiConfig extends ICandlestickConfig {
    /** Body tolerance as percentage of body size (default: 0.015 = 1.5%) */
    bodyTolerancePercent?: number;
    /** Minimum body tolerance absolute value (default: 0.00015) */
    bodyToleranceMinimum?: number;
}

/**
 * Default configuration for Doji pattern.
 */
export const DEFAULT_DOJI_CONFIG: IDojiConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG,
    bodyTolerancePercent: 0.015,
    bodyToleranceMinimum: 0.00015
};

export default class Doji extends CandlestickFinder {
    private bodyTolerancePercent: number;
    private bodyToleranceMinimum: number;

    constructor(config: IDojiConfig = DEFAULT_DOJI_CONFIG) {
        super(config);
        this.name = 'Doji';
        this.requiredCount = 1;
        
        // Apply configuration with defaults
        const finalConfig = { ...DEFAULT_DOJI_CONFIG, ...config };
        this.bodyTolerancePercent = finalConfig.bodyTolerancePercent!;
        this.bodyToleranceMinimum = finalConfig.bodyToleranceMinimum!;
    }

    logic (data:StockData):boolean {
        let daysOpen = data.open[0];
        let daysClose = data.close[0];
        let daysHigh = data.high[0];
        let daysLow = data.low[0];
        
        // A Doji is simply when open equals close (very small or no body)
        // The shadows can be of any length
        // Note: approximateEqual uses scale parameter for backward compatibility
        let isOpenEqualsClose = this.approximateEqual(daysOpen, daysClose);
        
        // Make sure we have valid OHLC data (high >= low, etc.)
        let hasValidData = daysHigh >= Math.max(daysOpen, daysClose) && 
                          daysLow <= Math.min(daysOpen, daysClose);
        
        return isOpenEqualsClose && hasValidData;
    }
}

/**
 * Detects Doji candlestick pattern in the provided stock data.
 * 
 * A Doji is a candlestick pattern where the opening and closing prices are virtually equal,
 * creating a cross-like appearance. This pattern indicates market indecision and potential
 * trend reversal points.
 * 
 * @param data - Stock data containing OHLC values
 * @param config - Configuration object for pattern detection
 * @param config.scale - Scale parameter for approximateEqual function precision (default: 0.001)
 * @param config.bodyTolerancePercent - Body tolerance as percentage of body size (default: 0.015 = 1.5%)
 * @param config.bodyToleranceMinimum - Minimum body tolerance absolute value (default: 0.00015)
 * @returns True if Doji pattern is detected, false otherwise
 * 
 * @example
 * ```typescript
 * // Using default configuration
 * const hasDojiPattern = doji(stockData);
 * 
 * // Using custom configuration
 * const hasDojiPattern = doji(stockData, {
 *   scale: 0.002,
 *   bodyTolerancePercent: 0.02,
 *   bodyToleranceMinimum: 0.0002
 * });
 * 
 * // Backward compatibility with scale parameter
 * const hasDojiPattern = doji(stockData, { scale: 0.002 });
 * ```
 */
export function doji(data: StockData, config: IDojiConfig = DEFAULT_DOJI_CONFIG) {
    return new Doji(config).hasPattern(data);
}
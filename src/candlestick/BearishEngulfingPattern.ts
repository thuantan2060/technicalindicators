import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for BearishEngulfingPattern.
 * Only requires scale parameter since this pattern uses direct price comparisons.
 */
export interface IBearishEngulfingConfig extends ICandlestickConfig {
    // No additional properties needed - only uses scale for approximateEqual
}

/**
 * Default configuration for BearishEngulfingPattern.
 */
export const DEFAULT_BEARISH_ENGULFING_CONFIG: IBearishEngulfingConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG
};

export default class BearishEngulfingPattern extends CandlestickFinder {
    constructor(config?: IBearishEngulfingConfig) {
        const finalConfig = { ...DEFAULT_BEARISH_ENGULFING_CONFIG, ...config };
        super(finalConfig);
        this.name = 'BearishEngulfingPattern';
        this.requiredCount  = 2;
    }
    logic (data:StockData) {
        // Previous day (older) - index 0
        let prevOpen   = data.open[0];
        let prevClose  = data.close[0];
        let prevHigh   = data.high[0];
        let prevLow    = data.low[0];

        // Current day (most recent) - index 1
        let currOpen  = data.open[1];
        let currClose = data.close[1];
        let currHigh  = data.high[1];
        let currLow   = data.low[1];

        // Validate OHLC data integrity
        let prevValid = this.validateOHLC(prevOpen, prevHigh, prevLow, prevClose);
        let currValid = this.validateOHLC(currOpen, currHigh, currLow, currClose);

        if (!prevValid || !currValid) {
            return false;
        }

        // Previous day should be bullish (green)
        let prevIsBullish = prevClose > prevOpen;

        // Current day should be bearish (red)
        let currIsBearish = currClose < currOpen;

        // Current day should engulf previous day:
        // - Current open above previous close (gap up or continuation)
        // - Current close below previous open (complete engulfment)
        let isEngulfing = currOpen >= prevClose && currClose <= prevOpen;

        let isBearishEngulfing = prevIsBullish && currIsBearish && isEngulfing;

        return isBearishEngulfing;
   }
}

/**
 * Detects Bearish Engulfing candlestick pattern in the provided stock data.
 *
 * A Bearish Engulfing pattern consists of two candlesticks where a large bearish candle
 * completely engulfs the previous smaller bullish candle. This pattern indicates a potential
 * reversal from bullish to bearish sentiment.
 *
 * @param data - Stock data containing OHLC values for at least 2 periods
 * @param config - Configuration object for pattern detection
 * @param config.scale - Scale parameter for approximateEqual function precision (default: 0.001)
 * @returns True if Bearish Engulfing pattern is detected, false otherwise
 *
 * @example
 * ```typescript
 * // Using default configuration
 * const hasBearishEngulfingPattern = bearishengulfingpattern(stockData);
 *
 * // Using custom configuration
 * const hasBearishEngulfingPattern = bearishengulfingpattern(stockData, {
 *   scale: 0.002
 * });
 *
 * // Backward compatibility with scale parameter
 * const hasBearishEngulfingPattern = bearishengulfingpattern(stockData, { scale: 0.002 });
 * ```
 */
export function bearishengulfingpattern(data: StockData, config: IBearishEngulfingConfig = DEFAULT_BEARISH_ENGULFING_CONFIG) {
    return new BearishEngulfingPattern(config).hasPattern(data);
}
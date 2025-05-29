import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';
import Doji, { DEFAULT_DOJI_CONFIG, IDojiConfig } from './Doji';

/**
 * Configuration interface for AbandonedBaby pattern.
 * Only requires scale parameter since this pattern uses direct price comparisons.
 */
export interface IAbandonedBabyConfig extends ICandlestickConfig, IDojiConfig {
    // No additional properties needed - only uses scale for approximateEqual
}

/**
 * Default configuration for AbandonedBaby pattern.
 */
export const DEFAULT_ABANDONED_BABY_CONFIG: IAbandonedBabyConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG,
    ...DEFAULT_DOJI_CONFIG
};

export default class AbandonedBaby extends CandlestickFinder {
    private readonly config: IAbandonedBabyConfig;

    constructor(config?: IAbandonedBabyConfig) {
        const finalConfig = { ...DEFAULT_ABANDONED_BABY_CONFIG, ...config };
        super(finalConfig);
        this.name = 'AbandonedBaby';
        this.requiredCount = 3;
        this.config = finalConfig;
    }
    logic (data:StockData) {
        // Correct indexing: [0]=first day (oldest), [1]=doji (middle), [2]=third day (newest)
        let firstdaysOpen   = data.open[0];   // First day (oldest)
        let firstdaysClose  = data.close[0];
        let firstdaysHigh   = data.high[0];
        let firstdaysLow    = data.low[0];

        let seconddaysOpen  = data.open[1];   // Second day (middle - doji)
        let seconddaysClose = data.close[1];
        let seconddaysHigh  = data.high[1];
        let seconddaysLow   = data.low[1];

        let thirddaysOpen   = data.open[2];   // Third day (newest)
        let thirddaysClose  = data.close[2];
        let thirddaysHigh   = data.high[2];
        let thirddaysLow    = data.low[2];

        let isFirstBearish  = firstdaysClose < firstdaysOpen;
        let dojiExists      = new Doji(this.config).hasPattern({
                                    "open" : [seconddaysOpen],
                                    "close": [seconddaysClose],
                                    "high" : [seconddaysHigh],
                                    "low"  : [seconddaysLow]
                                });

        // Gap detection:
        // Gap 1: Doji high < First day low (gap down from first to second day)
        // Gap 2: Third day low > Doji high (gap up from second to third day)
        let gapExists       = (seconddaysHigh < firstdaysLow) &&
                              (thirddaysLow > seconddaysHigh);

        let isThirdBullish  = (thirddaysClose > thirddaysOpen);

        return (isFirstBearish && dojiExists && gapExists && isThirdBullish);
     }
}

/**
 * Detects Abandoned Baby candlestick pattern in the provided stock data.
 *
 * An Abandoned Baby is a rare three-candle reversal pattern consisting of:
 * 1. A bearish candle
 * 2. A doji that gaps down from the first candle
 * 3. A bullish candle that gaps up from the doji
 * This pattern indicates a strong reversal from bearish to bullish sentiment.
 *
 * @param data - Stock data containing OHLC values for at least 3 periods
 * @param config - Configuration object for pattern detection
 * @param config.scale - Scale parameter for approximateEqual function precision (default: 0.001)
 * @returns True if Abandoned Baby pattern is detected, false otherwise
 *
 * @example
 * ```typescript
 * // Using default configuration
 * const hasAbandonedBabyPattern = abandonedbaby(stockData);
 *
 * // Using custom configuration
 * const hasAbandonedBabyPattern = abandonedbaby(stockData, {
 *   scale: 0.002
 * });
 *
 * // Backward compatibility with scale parameter
 * const hasAbandonedBabyPattern = abandonedbaby(stockData, { scale: 0.002 });
 * ```
 */
export function abandonedbaby(data: StockData, config: IAbandonedBabyConfig = DEFAULT_ABANDONED_BABY_CONFIG) {
    return new AbandonedBaby(config).hasPattern(data);
}
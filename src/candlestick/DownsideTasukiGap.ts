import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for DownsideTasukiGap pattern.
 * Only requires scale parameter since this pattern uses direct price comparisons.
 */
export interface IDownsideTasukiGapConfig extends ICandlestickConfig {
    // No additional properties needed - only uses scale for approximateEqual and validateOHLC
}

/**
 * Default configuration for DownsideTasukiGap pattern.
 */
export const DEFAULT_DOWNSIDE_TASUKI_GAP_CONFIG: IDownsideTasukiGapConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG
};

export default class DownsideTasukiGap extends CandlestickFinder {
    constructor(config?: IDownsideTasukiGapConfig) {
        const finalConfig = { ...DEFAULT_DOWNSIDE_TASUKI_GAP_CONFIG, ...config };
        super(finalConfig);
        this.requiredCount  = 3;
        this.name = 'DownsideTasukiGap';
    }

    logic (data:StockData) {
        // Based on ascending chronological order: [day1, day2, day3]
        // [0]=oldest (day 1), [1]=middle (day 2), [2]=most recent (day 3)
        let firstdaysOpen   = data.open[0];   // Day 1 (oldest) - first bearish candle
        let firstdaysClose  = data.close[0];
        let firstdaysHigh   = data.high[0];
        let firstdaysLow    = data.low[0];

        let seconddaysOpen  = data.open[1];   // Day 2 (middle) - second bearish candle with gap
        let seconddaysClose = data.close[1];
        let seconddaysHigh  = data.high[1];
        let seconddaysLow   = data.low[1];

        let thirddaysOpen   = data.open[2];   // Day 3 (most recent) - bullish candle filling gap
        let thirddaysClose  = data.close[2];
        let thirddaysHigh   = data.high[2];
        let thirddaysLow    = data.low[2];

        // Basic OHLC validation for all three days
        if (!this.validateOHLC(firstdaysOpen, firstdaysHigh, firstdaysLow, firstdaysClose) ||
            !this.validateOHLC(seconddaysOpen, seconddaysHigh, seconddaysLow, seconddaysClose) ||
            !this.validateOHLC(thirddaysOpen, thirddaysHigh, thirddaysLow, thirddaysClose)) {
            return false;
        }

        // Pattern requirements:
        // 1. Day 1 and Day 2 must be bearish
        let isFirstBearish  = firstdaysClose < firstdaysOpen;
        let isSecondBearish = seconddaysClose < seconddaysOpen;

        // 2. Day 3 must be bullish
        let isThirdBullish = thirddaysClose > thirddaysOpen;

        // 3. There must be a gap down between Day 1 and Day 2
        let isGapDown = seconddaysHigh < firstdaysLow;

        // 4. Day 3 must open within Day 2's body
        let day3OpensInDay2Body = (thirddaysOpen > Math.min(seconddaysOpen, seconddaysClose)) &&
                                  (thirddaysOpen < Math.max(seconddaysOpen, seconddaysClose));

        // 5. Day 3 must close within the gap (between Day 1 low and Day 2 high)
        let day3ClosesInGap = (thirddaysClose > seconddaysHigh) && (thirddaysClose < firstdaysLow);

        // 6. Day 3 must NOT fully close the gap (i.e., Day 3 close should not reach Day 1 low)
        let gapNotFullyClosed = thirddaysClose < firstdaysLow;

        return (isFirstBearish && isSecondBearish && isThirdBullish &&
                isGapDown && day3OpensInDay2Body && day3ClosesInGap && gapNotFullyClosed);

   }
}

/**
 * Detects DownsideTasukiGap candlestick pattern in the provided stock data.
 *
 * A DownsideTasukiGap is a three-candle continuation pattern that occurs during a downtrend.
 * It consists of:
 * 1. A bearish candle
 * 2. A second bearish candle that gaps down from the first
 * 3. A bullish candle that opens within the second candle's body and closes within the gap
 *
 * This pattern suggests that the downtrend will continue despite the temporary bullish reversal.
 *
 * @param data - Stock data containing OHLC values for at least 3 periods
 * @param config - Configuration object for pattern detection
 * @param config.scale - Scale parameter for approximateEqual function precision (default: 0.001)
 * @returns True if DownsideTasukiGap pattern is detected, false otherwise
 *
 * @example
 * ```typescript
 * // Using default configuration
 * const hasDownsideTasukiGapPattern = downsidetasukigap(stockData);
 *
 * // Using custom configuration
 * const hasDownsideTasukiGapPattern = downsidetasukigap(stockData, {
 *   scale: 0.002
 * });
 *
 * // Backward compatibility with scale parameter
 * const hasDownsideTasukiGapPattern = downsidetasukigap(stockData, { scale: 0.002 });
 * ```
 */
export function downsidetasukigap(data: StockData, config: IDownsideTasukiGapConfig = DEFAULT_DOWNSIDE_TASUKI_GAP_CONFIG) {
  return new DownsideTasukiGap(config).hasPattern(data);
}
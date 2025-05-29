import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for BullishHarami pattern.
 * Only requires scale parameter since this pattern uses direct price comparisons.
 */
export interface IBullishHaramiConfig extends ICandlestickConfig {
    // No additional properties needed - only uses scale for approximateEqual and validateOHLC
}

/**
 * Default configuration for BullishHarami pattern.
 */
export const DEFAULT_BULLISH_HARAMI_CONFIG: IBullishHaramiConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG
};

export default class BullishHarami extends CandlestickFinder {
    constructor(config?: IBullishHaramiConfig) {
        const finalConfig = { ...DEFAULT_BULLISH_HARAMI_CONFIG, ...config };
        super(finalConfig);
        this.requiredCount = 2;
        this.name = "BullishHarami";
    }

    logic(data: StockData) {
        // Previous day (older) - index 0
        let prevOpen = data.open[0];
        let prevClose = data.close[0];
        let prevHigh = data.high[0];
        let prevLow = data.low[0];

        // Current day (most recent) - index 1
        let currOpen = data.open[1];
        let currClose = data.close[1];
        let currHigh = data.high[1];
        let currLow = data.low[1];

        // Validate OHLC data
        if (!this.validateOHLC(prevOpen, prevHigh, prevLow, prevClose) ||
            !this.validateOHLC(currOpen, currHigh, currLow, currClose)) {
            return false;
        }

        // Previous day should be bearish (large red candle)
        let isPrevBearish = prevClose < prevOpen;

        // Current day should be bullish or near-doji (small green candle or very small body)
        // Note: approximateEqual uses scale for price comparison precision
        let isCurrBullish = currClose > currOpen || this.approximateEqual(currOpen, currClose);

        // Current day should be completely contained within previous day's body and range
        // (Harami means "inside" in Japanese)
        let isInsidePrevBody = currOpen < prevOpen && currOpen > prevClose &&
                              currClose < prevOpen && currClose > prevClose;
        let isInsidePrevRange = currHigh <= prevHigh && currLow >= prevLow;

        return isPrevBearish && isCurrBullish && isInsidePrevBody && isInsidePrevRange;
    }
}

export function bullishharami(data: StockData, config: IBullishHaramiConfig = DEFAULT_BULLISH_HARAMI_CONFIG) {
    return new BullishHarami(config).hasPattern(data);
}

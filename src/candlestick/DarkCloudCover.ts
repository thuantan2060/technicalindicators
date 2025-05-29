import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for DarkCloudCover pattern.
 * Only requires scale parameter since this pattern uses direct price comparisons.
 */
export interface IDarkCloudCoverConfig extends ICandlestickConfig {
    // No additional properties needed - only uses scale for approximateEqual
}

/**
 * Default configuration for DarkCloudCover pattern.
 */
export const DEFAULT_DARK_CLOUD_COVER_CONFIG: IDarkCloudCoverConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG
};

export default class DarkCloudCover extends CandlestickFinder {
    constructor(config?: IDarkCloudCoverConfig) {
        const finalConfig = { ...DEFAULT_DARK_CLOUD_COVER_CONFIG, ...config };
        super(finalConfig);
        this.name = 'DarkCloudCover';
        this.requiredCount = 2;
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

        // Validate OHLC data integrity for both days
        if (!this.validateOHLC(prevOpen, prevHigh, prevLow, prevClose) ||
            !this.validateOHLC(currOpen, currHigh, currLow, currClose)) {
            return false;
        }

        // Previous day should be bullish (green candle)
        let prevIsBullish = prevClose > prevOpen;

        // Current day should be bearish (red candle)
        let currIsBearish = currClose < currOpen;

        // Calculate the midpoint of previous day's body (no scale dependency)
        let prevMidpoint = (prevClose + prevOpen) / 2;

        // Dark cloud cover conditions (all use direct price comparisons):
        // 1. Current opens above previous day's high (gap up)
        // 2. Current close is below the midpoint of previous day's body
        // 3. Current close is still above previous day's open (not full engulfment)
        let isDarkCloudPattern = currOpen > prevHigh &&
                                currClose < prevMidpoint &&
                                currClose > prevOpen;

        return prevIsBullish && currIsBearish && isDarkCloudPattern;
    }
}

export function darkcloudcover(data: StockData, config: IDarkCloudCoverConfig = DEFAULT_DARK_CLOUD_COVER_CONFIG) {
    return new DarkCloudCover(config).hasPattern(data);
}
import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for ThreeBlackCrows pattern.
 * Only uses the scale parameter for approximateEqual function precision.
 */
export interface IThreeBlackCrowsConfig extends ICandlestickConfig {
    /** Scale parameter for approximateEqual function precision (default: 0.001) */
    scale?: number;
}

/**
 * Default configuration for ThreeBlackCrows pattern.
 */
export const DEFAULT_THREE_BLACK_CROWS_CONFIG: IThreeBlackCrowsConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG
};

export default class ThreeBlackCrows extends CandlestickFinder {
    constructor(config?: IThreeBlackCrowsConfig) {
        const finalConfig = { ...DEFAULT_THREE_BLACK_CROWS_CONFIG, ...config };
        super(finalConfig);
        this.name = 'ThreeBlackCrows';
        this.requiredCount = 3;
    }

    logic(data: StockData) {
        // First day (oldest) - index 0
        let firstOpen = data.open[0];
        let firstClose = data.close[0];
        let firstHigh = data.high[0];
        let firstLow = data.low[0];

        // Second day (middle) - index 1
        let secondOpen = data.open[1];
        let secondClose = data.close[1];
        let secondHigh = data.high[1];
        let secondLow = data.low[1];

        // Third day (most recent) - index 2
        let thirdOpen = data.open[2];
        let thirdClose = data.close[2];
        let thirdHigh = data.high[2];
        let thirdLow = data.low[2];

        // All three days should be bearish (black/red candles) - direct price comparisons
        let isAllBearish = firstClose < firstOpen &&
                          secondClose < secondOpen &&
                          thirdClose < thirdOpen;

        // Progressive downtrend - each day should have lower lows (no scale dependency)
        let isDownTrend = secondLow < firstLow &&
                         thirdLow < secondLow;

        // Each subsequent day should open within the previous day's body
        // and close lower than the previous day's close (direct price comparisons)
        let doesOpenWithinPreviousBody = secondOpen < firstOpen && secondOpen > firstClose &&
                                        thirdOpen < secondOpen && thirdOpen > secondClose;

        return (isDownTrend && isAllBearish && doesOpenWithinPreviousBody);
    }
}

export function threeblackcrows(data: StockData, config: IThreeBlackCrowsConfig = DEFAULT_THREE_BLACK_CROWS_CONFIG) {
    return new ThreeBlackCrows(config).hasPattern(data);
}

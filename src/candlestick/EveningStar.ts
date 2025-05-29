import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for EveningStar pattern.
 * Only requires scale parameter since this pattern uses direct price comparisons.
 */
export interface IEveningStarConfig extends ICandlestickConfig {
    // No additional properties needed - only uses scale for approximateEqual
}

/**
 * Default configuration for EveningStar pattern.
 */
export const DEFAULT_EVENING_STAR_CONFIG: IEveningStarConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG
};

export default class EveningStar extends CandlestickFinder {
    constructor(config?: IEveningStarConfig) {
        const finalConfig = { ...DEFAULT_EVENING_STAR_CONFIG, ...config };
        super(finalConfig);
        this.name = 'EveningStar';
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

        // First day should be bullish (green candle)
        let isFirstBullish = firstClose > firstOpen;

        // Second day should be a small body (star) gapping up from first day
        let firstMidpoint = (firstOpen + firstClose) / 2;
        let secondBodySize = Math.abs(secondClose - secondOpen);
        let firstBodySize = Math.abs(firstClose - firstOpen);
        let isSmallBody = secondBodySize < (firstBodySize * 0.3); // Small relative to first day

        // Third day should be bearish and close below first day's midpoint
        let isThirdBearish = thirdClose < thirdOpen;
        let closesBelowFirstMidpoint = thirdClose < firstMidpoint;

        // Gap conditions: second day gaps up from first, third gaps down from second
        let hasUpGap = secondLow > firstHigh;
        let hasDownGap = thirdOpen < secondLow;

        return (isFirstBullish && isSmallBody && isThirdBearish &&
                closesBelowFirstMidpoint && hasUpGap && hasDownGap);
    }
}

export function eveningstar(data: StockData, config: IEveningStarConfig = DEFAULT_EVENING_STAR_CONFIG) {
    return new EveningStar(config).hasPattern(data);
}
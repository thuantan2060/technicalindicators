import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for BearishHarami pattern.
 * Only requires scale parameter since this pattern uses direct price comparisons.
 */
export interface IBearishHaramiConfig extends ICandlestickConfig {
    // No additional properties needed - only uses scale for validateOHLC
}

/**
 * Default configuration for BearishHarami pattern.
 */
export const DEFAULT_BEARISH_HARAMI_CONFIG: IBearishHaramiConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG
};

export default class BearishHarami extends CandlestickFinder {
    constructor(config: IBearishHaramiConfig = DEFAULT_BEARISH_HARAMI_CONFIG) {
        super(config);
        this.requiredCount = 2;
        this.name = "BearishHarami";
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
        
        // Previous day should be bullish (large green candle)
        let isPrevBullish = prevClose > prevOpen;
        
        // Current day should be bearish (small red candle)
        let isCurrBearish = currClose < currOpen;
        
        // Current day should be completely contained within previous day's body and range
        // (Harami means "inside" in Japanese)
        let isInsidePrevBody = currOpen > prevOpen && currOpen < prevClose &&
                              currClose > prevOpen && currClose < prevClose;
        let isInsidePrevRange = currHigh <= prevHigh && currLow >= prevLow;
        
        return isPrevBullish && isCurrBearish && isInsidePrevBody && isInsidePrevRange;
    }
}

export function bearishharami(data: StockData, config: IBearishHaramiConfig = DEFAULT_BEARISH_HARAMI_CONFIG) {
    return new BearishHarami(config).hasPattern(data);
}

import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for BearishHaramiCross pattern.
 * Only requires scale parameter since this pattern uses direct price comparisons.
 */
export interface IBearishHaramiCrossConfig extends ICandlestickConfig {
    // No additional properties needed - only uses scale for approximateEqual and validateOHLC
}

/**
 * Default configuration for BearishHaramiCross pattern.
 */
export const DEFAULT_BEARISH_HARAMI_CROSS_CONFIG: IBearishHaramiCrossConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG
};

export default class BearishHaramiCross extends CandlestickFinder {
    constructor(config: IBearishHaramiCrossConfig = DEFAULT_BEARISH_HARAMI_CROSS_CONFIG) {
        super(config);
        this.requiredCount = 2;
        this.name = 'BearishHaramiCross';
    }

    logic (data:StockData) {
        // Previous day (index 0) - should be a bullish candle
        let prevOpen   = data.open[0];
        let prevClose  = data.close[0];
        let prevHigh   = data.high[0];
        let prevLow    = data.low[0];
        
        // Current day (index 1) - should be a doji contained within previous body
        let currOpen  = data.open[1];
        let currClose = data.close[1];
        let currHigh  = data.high[1];
        let currLow   = data.low[1];

        // Validate OHLC data
        if (!this.validateOHLC(prevOpen, prevHigh, prevLow, prevClose) ||
            !this.validateOHLC(currOpen, currHigh, currLow, currClose)) {
            return false;
        }

        // Previous day should be a bullish candle
        let isPrevBullish = prevClose > prevOpen;
        let prevBodySize = Math.abs(prevClose - prevOpen);
        let prevRange = prevHigh - prevLow;
        
        // Ensure the previous candle has a reasonable body size
        // The body should be at least 50% of the total range (more strict requirement)
        let isPrevSignificant = prevRange > 0 && (prevBodySize / prevRange) >= 0.5;
        
        // Current day should be a doji (open ≈ close)
        // For higher-priced stocks, use a percentage-based approach for doji detection
        let bodySize = Math.abs(currClose - currOpen);
        let avgPrice = (currOpen + currClose) / 2;
        let percentageDiff = avgPrice > 0 ? (bodySize / avgPrice) : 0;
        
        // Consider it a doji if:
        // 1. The absolute difference is within the scale threshold, OR
        // 2. The percentage difference is less than 0.1% (very small body relative to price)
        let isCurrDoji = this.approximateEqual(currOpen, currClose) || percentageDiff <= 0.001;
        
        // Containment: Current doji should be completely contained within previous candle's body
        // For a bullish previous candle: prevClose > prevOpen
        // So the body range is from prevOpen (bottom) to prevClose (top)
        let bodyTop = prevClose;   // For bullish candle, close is higher
        let bodyBottom = prevOpen; // For bullish candle, open is lower
        
        // Current candle (including shadows) should be contained within previous body
        // Allow for exact boundary matches (<=, >=)
        let hasContainment = currHigh <= bodyTop && 
                           currLow >= bodyBottom &&
                           currOpen >= bodyBottom && 
                           currOpen <= bodyTop &&
                           currClose >= bodyBottom && 
                           currClose <= bodyTop;

        return isPrevBullish && isPrevSignificant && isCurrDoji && hasContainment;
   }
}

export function bearishharamicross(data: StockData, config: IBearishHaramiCrossConfig = DEFAULT_BEARISH_HARAMI_CROSS_CONFIG) {
    return new BearishHaramiCross(config).hasPattern(data);
}

import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for BullishHaramiCross pattern.
 * Only requires scale parameter since this pattern uses direct price comparisons.
 */
export interface IBullishHaramiCrossConfig extends ICandlestickConfig {
    // No additional properties needed - only uses scale for approximateEqual and validateOHLC
}

/**
 * Default configuration for BullishHaramiCross pattern.
 */
export const DEFAULT_BULLISH_HARAMI_CROSS_CONFIG: IBullishHaramiCrossConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG
};

export default class BullishHaramiCross extends CandlestickFinder {
    constructor(config: IBullishHaramiCrossConfig = DEFAULT_BULLISH_HARAMI_CROSS_CONFIG) {
        super(config);
        this.requiredCount = 2;
        this.name = 'BullishHaramiCross';
    }
    
    logic(data: StockData) {
        // Previous day (older) - index 0 - should be a long bearish candle
        let prevOpen = data.open[0];
        let prevClose = data.close[0];
        let prevHigh = data.high[0];
        let prevLow = data.low[0];
        
        // Current day (most recent) - index 1 - should be a doji
        let currOpen = data.open[1];
        let currClose = data.close[1];
        let currHigh = data.high[1];
        let currLow = data.low[1];

        // Validate OHLC data
        if (!this.validateOHLC(prevOpen, prevHigh, prevLow, prevClose) ||
            !this.validateOHLC(currOpen, currHigh, currLow, currClose)) {
            return false;
        }

        // Previous day should be a bearish candle
        let isPrevBearish = prevClose < prevOpen;
        let prevBodySize = Math.abs(prevOpen - prevClose);
        let prevRange = prevHigh - prevLow;
        
        // Ensure the previous candle has a reasonable body size
        // The body should be at least 50% of the total range (more strict requirement)
        let isPrevSignificant = prevRange > 0 && (prevBodySize / prevRange) >= 0.5;
        
        // Current day should be a doji (open ≈ close)
        // Note: approximateEqual uses scale for price comparison precision
        let isCurrDoji = this.approximateEqual(currOpen, currClose);
        
        // Containment: Current doji should be completely contained within previous candle's body
        // For a bearish previous candle: prevClose < prevOpen
        // So the body range is from prevClose (bottom) to prevOpen (top)
        let bodyTop = prevOpen;    // For bearish candle, open is higher
        let bodyBottom = prevClose; // For bearish candle, close is lower
        
        // Current candle (including shadows) should be contained within previous body
        let hasContainment = currHigh <= bodyTop && 
                           currLow >= bodyBottom &&
                           currOpen >= bodyBottom && 
                           currOpen <= bodyTop &&
                           currClose >= bodyBottom && 
                           currClose <= bodyTop;

        return isPrevBearish && isPrevSignificant && isCurrDoji && hasContainment;
    }
}

export function bullishharamicross(data: StockData, config: IBullishHaramiCrossConfig = DEFAULT_BULLISH_HARAMI_CROSS_CONFIG) {
    return new BullishHaramiCross(config).hasPattern(data);
}

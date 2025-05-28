import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for PiercingLine pattern.
 * Only requires scale parameter since this pattern uses direct price comparisons.
 */
export interface IPiercingLineConfig extends ICandlestickConfig {
    // No additional properties needed - only uses scale for approximateEqual and validateOHLC
}

/**
 * Default configuration for PiercingLine pattern.
 */
export const DEFAULT_PIERCING_LINE_CONFIG: IPiercingLineConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG
};

export default class PiercingLine extends CandlestickFinder {
    constructor(config: IPiercingLineConfig = DEFAULT_PIERCING_LINE_CONFIG) {
        super(config);
        this.requiredCount = 2;
        this.name = 'PiercingLine';
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

        // Previous day should be bearish (red candle)
        let prevIsBearish = prevClose < prevOpen;
        
        // Current day should be bullish (green candle)  
        let currIsBullish = currClose > currOpen;
        
        // Calculate the midpoint of previous day's body (no scale dependency)
        let prevMidpoint = (prevOpen + prevClose) / 2;
        
        // Piercing line conditions (all use direct price comparisons):
        // 1. Current opens below previous day's low (gap down)
        // 2. Current close is above the midpoint of previous day's body
        let isPiercingLine = currOpen < prevLow && currClose > prevMidpoint;
        
        // Additional check: ensure current close is still below previous open (not full engulfment)
        let isPartialPenetration = currClose < prevOpen;
        
        return prevIsBearish && currIsBullish && isPiercingLine && isPartialPenetration;
    }
}

/**
 * Detects PiercingLine candlestick pattern.
 * 
 * A PiercingLine is a bullish reversal pattern that occurs at the end of a downtrend.
 * It consists of a bearish candle followed by a bullish candle that opens below the
 * previous day's low but closes above the midpoint of the previous day's body.
 * 
 * @param data - Stock data containing OHLC values
 * @param config - Configuration options for the pattern detection
 * @returns True if PiercingLine pattern is detected, false otherwise
 * 
 * @example
 * ```typescript
 * const data = { open: [...], high: [...], low: [...], close: [...] };
 * const isPattern = piercingline(data, { scale: 0.001 });
 * ```
 */
export function piercingline(data: StockData, config: IPiercingLineConfig = DEFAULT_PIERCING_LINE_CONFIG) {
    return new PiercingLine(config).hasPattern(data);
}
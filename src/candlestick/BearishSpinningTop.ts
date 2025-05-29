import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for BearishSpinningTop pattern.
 * Only uses the scale parameter for approximateEqual function precision.
 */
export interface IBearishSpinningTopConfig extends ICandlestickConfig {
    /** Scale parameter for approximateEqual function precision (default: 0.001) */
    scale?: number;
}

/**
 * Default configuration for BearishSpinningTop pattern.
 */
export const DEFAULT_BEARISH_SPINNING_TOP_CONFIG: IBearishSpinningTopConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG
};

export default class BearishSpinningTop extends CandlestickFinder {
    constructor(config?: IBearishSpinningTopConfig) {
        const finalConfig = { ...DEFAULT_BEARISH_SPINNING_TOP_CONFIG, ...config };
        super(finalConfig);
        this.name = 'BearishSpinningTop';
        this.requiredCount = 1;
    }

    logic(data: StockData) {
        let daysOpen = data.open[0];
        let daysClose = data.close[0];
        let daysHigh = data.high[0];
        let daysLow = data.low[0];

        // Basic OHLC validation
        if (!this.validateOHLC(daysOpen, daysHigh, daysLow, daysClose)) {
            return false;
        }

        // Must be bearish (close < open)
        let isBearish = daysClose < daysOpen;

        let bodyLength = Math.abs(daysClose - daysOpen);
        // For bearish candles: top of body is open, bottom is close
        let upperShadowLength = Math.abs(daysHigh - daysOpen);
        let lowerShadowLength = Math.abs(daysClose - daysLow);

        // Spinning top: body length < both shadow lengths (relative comparison, no scale dependency)
        let isBearishSpinningTop = isBearish &&
                                 bodyLength < upperShadowLength &&
                                 bodyLength < lowerShadowLength;

        return isBearishSpinningTop;
    }
}

export function bearishspinningtop(data: StockData, config: IBearishSpinningTopConfig = DEFAULT_BEARISH_SPINNING_TOP_CONFIG) {
    return new BearishSpinningTop(config).hasPattern(data);
}
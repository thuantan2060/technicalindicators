import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for BullishSpinningTop pattern.
 */
export interface IBullishSpinningTopConfig extends ICandlestickConfig {
    /** Scale parameter for approximateEqual function precision (default: 0.001) */
    scale?: number;
    /** Maximum body length for small body detection (default: 0.1) */
    maxBodyLength?: number;
}

/**
 * Default configuration for BullishSpinningTop pattern.
 */
export const DEFAULT_BULLISH_SPINNING_TOP_CONFIG: IBullishSpinningTopConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG,
    maxBodyLength: 1 // Body should be <= 1 price units to be considered "small"
};

export default class BullishSpinningTop extends CandlestickFinder {
    /** Maximum body length for small body detection */
    maxBodyLength: number;

    constructor(config?: IBullishSpinningTopConfig) {
        const finalConfig = { ...DEFAULT_BULLISH_SPINNING_TOP_CONFIG, ...config };
        super(finalConfig);
        this.name = 'BullishSpinningTop';
        this.requiredCount = 1;
        this.maxBodyLength = finalConfig.maxBodyLength!;
    }

    logic(data: StockData) {
        let daysOpen = data.open[0];
        let daysClose = data.close[0];
        let daysHigh = data.high[0];
        let daysLow = data.low[0];

        // Validate OHLC data integrity first
        if (!this.validateOHLC(daysOpen, daysHigh, daysLow, daysClose)) {
            return false;
        }

        // Must be bullish (close > open)
        let isBullish = daysClose > daysOpen;
        let bodyLength = Math.abs(daysClose - daysOpen);

        // For bullish candles: top of body is close, bottom is open
        let upperShadowLength = Math.abs(daysHigh - daysClose);
        let lowerShadowLength = Math.abs(daysOpen - daysLow);

        // Check if body is small based on fixed length threshold
        let hasSmallBody = bodyLength <= this.maxBodyLength;

        // Spinning top: bullish + small body + body length < both shadow lengths
        let isBullishSpinningTop = isBullish &&
                                 hasSmallBody &&
                                 bodyLength < upperShadowLength &&
                                 bodyLength < lowerShadowLength;

        return isBullishSpinningTop;
    }
}

export function bullishspinningtop(data: StockData, config: IBullishSpinningTopConfig = DEFAULT_BULLISH_SPINNING_TOP_CONFIG) {
    return new BullishSpinningTop(config).hasPattern(data);
}
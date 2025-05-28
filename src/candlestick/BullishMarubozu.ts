import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for BullishMarubozu pattern.
 * Only uses the scale parameter for approximateEqual function precision.
 */
export interface IBullishMarubozuConfig extends ICandlestickConfig {
    /** Scale parameter for approximateEqual function precision (default: 0.001) */
    scale?: number;
}

/**
 * Default configuration for BullishMarubozu pattern.
 */
export const DEFAULT_BULLISH_MARUBOZU_CONFIG: IBullishMarubozuConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG
};

export default class BullishMarubozu extends CandlestickFinder {
    constructor(config: IBullishMarubozuConfig = DEFAULT_BULLISH_MARUBOZU_CONFIG) {
        super(config);
        this.name = 'BullishMarubozu';
        this.requiredCount = 1;
    }
    
    logic(data: StockData) {
        let daysOpen = data.open[0];
        let daysClose = data.close[0];
        let daysHigh = data.high[0];
        let daysLow = data.low[0];

        // Bullish Marubozu: close > open, close = high, open = low (no shadows)
        let isBullish = daysClose > daysOpen;
        // Note: approximateEqual uses scale for price comparison precision
        let isCloseEqualsHigh = this.approximateEqual(daysClose, daysHigh);
        let isOpenEqualsLow = this.approximateEqual(daysOpen, daysLow);
        
        let isBullishMarubozu = isBullish && isCloseEqualsHigh && isOpenEqualsLow;

        return isBullishMarubozu;
    }
}

export function bullishmarubozu(data: StockData, config: IBullishMarubozuConfig = DEFAULT_BULLISH_MARUBOZU_CONFIG) {
    return new BullishMarubozu(config).hasPattern(data);
}
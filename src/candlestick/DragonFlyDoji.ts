import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for DragonFlyDoji pattern.
 * Only requires scale parameter since this pattern uses approximateEqual for body tolerance.
 */
export interface IDragonFlyDojiConfig extends ICandlestickConfig {
    // No additional properties needed - only uses scale for approximateEqual
}

/**
 * Default configuration for DragonFlyDoji pattern.
 */
export const DEFAULT_DRAGONFLY_DOJI_CONFIG: IDragonFlyDojiConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG
};

export default class DragonFlyDoji extends CandlestickFinder {
    constructor(config: IDragonFlyDojiConfig = DEFAULT_DRAGONFLY_DOJI_CONFIG) {
        super(config);
        this.requiredCount = 1;
        this.name = 'DragonFlyDoji';
    }
    
    logic(data: StockData) {
        let daysOpen = data.open[0];
        let daysClose = data.close[0];
        let daysHigh = data.high[0];
        let daysLow = data.low[0];
        
        // Basic validation - check for NaN or infinite values and basic OHLC constraints
        if (!isFinite(daysOpen) || !isFinite(daysHigh) || !isFinite(daysLow) || !isFinite(daysClose)) {
            return false;
        }
        
        // Check basic OHLC constraints (works correctly for both positive and negative prices)
        if (daysHigh < Math.max(daysOpen, daysClose) || daysLow > Math.min(daysOpen, daysClose)) {
            return false;
        }
        
        // DragonFly Doji: Open ≈ Close, and both are near the High, with a long lower shadow
        // Note: approximateEqual now uses fixed thresholds instead of scale
        let isOpenEqualsClose = this.approximateEqual(daysOpen, daysClose);
        
        // Calculate shadows and body
        let bodySize = Math.abs(daysClose - daysOpen);
        let lowerShadow = Math.min(daysOpen, daysClose) - daysLow;
        let upperShadow = daysHigh - Math.max(daysOpen, daysClose);
        let totalRange = daysHigh - daysLow;
        
        // For DragonFly Doji, the open/close should be near the high
        // Check if both open and close are individually close to high (more flexible approach)
        let isOpenNearHigh = this.approximateEqual(daysOpen, daysHigh);
        let isCloseNearHigh = this.approximateEqual(daysClose, daysHigh);
        let isBodyNearHigh = isOpenNearHigh || isCloseNearHigh;
        
        // DragonFly Doji criteria:
        // 1. Open ≈ Close (small body)
        // 2. Open or Close near the High (body at the top)
        // 3. Long lower shadow (at least 2x the body size or 60% of total range)
        // 4. Minimal upper shadow (less than 10% of total range)
        let hasSmallBody = isOpenEqualsClose;
        let hasBodyAtTop = isBodyNearHigh;
        let hasLongLowerShadow = lowerShadow >= Math.max(bodySize * 2, totalRange * 0.6);
        let hasMinimalUpperShadow = upperShadow <= totalRange * 0.1;
        
        return hasSmallBody && hasBodyAtTop && hasLongLowerShadow && hasMinimalUpperShadow && totalRange > 0;
    }
}

export function dragonflydoji(data: StockData, config: IDragonFlyDojiConfig = DEFAULT_DRAGONFLY_DOJI_CONFIG) {
    return new DragonFlyDoji(config).hasPattern(data);
}
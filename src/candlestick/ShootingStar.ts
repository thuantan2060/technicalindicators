import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';
import { averageloss } from '../Utils/AverageLoss';
import { averagegain } from '../Utils/AverageGain';
import { bearishinvertedhammerstick, DEFAULT_BEARISH_INVERTED_HAMMER_CONFIG } from './BearishInvertedHammerStick';
import { bullishinvertedhammerstick, DEFAULT_BULLISH_INVERTED_HAMMER_STICK_CONFIG } from './BullishInvertedHammerStick';

/**
 * Configuration interface for ShootingStar pattern.
 * Only requires scale parameter since this pattern uses direct price comparisons.
 */
export interface IShootingStarConfig extends ICandlestickConfig {
    // No additional properties needed - only uses scale for validateOHLC and inverted hammer detection
}

/**
 * Default configuration for ShootingStar pattern.
 */
export const DEFAULT_SHOOTING_STAR_CONFIG: IShootingStarConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG
};

export default class ShootingStar extends CandlestickFinder {
    constructor(config: IShootingStarConfig = DEFAULT_SHOOTING_STAR_CONFIG) {
        super(config);
        this.name = 'ShootingStar';
        this.requiredCount = 5;
    }

    logic(data: StockData) {
        // Validate data integrity first
        for (let i = 0; i < data.close.length; i++) {
            if (!this.validateOHLC(data.open[i], data.high[i], data.low[i], data.close[i])) {
                return false;
            }
        }
        
        let isPattern = this.upwardTrend(data);
        isPattern = isPattern && this.includesInvertedHammer(data);
        isPattern = isPattern && this.hasConfirmation(data);
        return isPattern;
    }

    upwardTrend(data: StockData, confirm = true) {
        let end = confirm ? 3 : 4;
        
        // Ensure we have enough data
        if (data.close.length < end) {
            return false;
        }
        
        // Analyze trends in closing prices of the first three or four candlesticks
        // For ascending order data, we look at the first 'end' elements
        let gains = averagegain({ values: data.close.slice(0, end), period: end - 1 });
        let losses = averageloss({ values: data.close.slice(0, end), period: end - 1 });
        
        // Get the latest values from the arrays
        let latestGain = gains.length > 0 ? gains[gains.length - 1] : 0;
        let latestLoss = losses.length > 0 ? losses[losses.length - 1] : 0;
        
        // Additional validation: ensure there's actual price movement
        let closeSlice = data.close.slice(0, end);
        let priceRange = Math.max(...closeSlice) - Math.min(...closeSlice);
        let minMovement = priceRange * 0.01; // At least 1% movement
        
        // Upward trend, so more gains than losses, and significant movement
        return latestGain > latestLoss && latestGain > minMovement;
    }

    includesInvertedHammer(data: StockData, confirm = true) {
        // For ascending order data, the shooting star is at index 3 (4th candle)
        let start = 3;
        let end = 4;
        
        // Ensure we have the required data
        if (data.close.length <= start) {
            return false;
        }
        
        let possibleHammerData = {
            open: data.open.slice(start, end),
            close: data.close.slice(start, end),
            low: data.low.slice(start, end),
            high: data.high.slice(start, end),
        };

        // Use the updated inverted hammer functions with config objects
        let isPattern = bearishinvertedhammerstick(possibleHammerData, DEFAULT_BEARISH_INVERTED_HAMMER_CONFIG);
        isPattern = isPattern || bullishinvertedhammerstick(possibleHammerData, DEFAULT_BULLISH_INVERTED_HAMMER_STICK_CONFIG);

        return isPattern;
    }

    hasConfirmation(data: StockData) {
        // Ensure we have enough data
        if (data.close.length < 5) {
            return false;
        }
        
        // For ascending order data:
        // Index 3 = shooting star (4th candle)
        // Index 4 = confirmation candle (5th candle, most recent)
        let possibleStar = {
            open: data.open[3],
            close: data.close[3],
            low: data.low[3],
            high: data.high[3],
        }
        let possibleConfirmation = {
            open: data.open[4],
            close: data.close[4],
            low: data.low[4],
            high: data.high[4],
        }
        
        // Validate OHLC data
        if (!this.validateOHLC(possibleStar.open, possibleStar.high, possibleStar.low, possibleStar.close) ||
            !this.validateOHLC(possibleConfirmation.open, possibleConfirmation.high, possibleConfirmation.low, possibleConfirmation.close)) {
            return false;
        }
        
        // Confirmation candlestick should be bearish (shooting star is bearish reversal)
        let isBearishConfirmation = possibleConfirmation.open > possibleConfirmation.close;
        
        // The confirmation should close lower than the shooting star's close
        // and show meaningful downward movement
        let downwardMovement = possibleStar.close - possibleConfirmation.close;
        let minMovement = (possibleStar.high - possibleStar.low) * 0.1; // At least 10% of star's range
        
        return isBearishConfirmation && downwardMovement > 0 && downwardMovement >= minMovement;
    }
}

export function shootingstar(data: StockData, config: IShootingStarConfig = DEFAULT_SHOOTING_STAR_CONFIG) {
    return new ShootingStar(config).hasPattern(data);
}

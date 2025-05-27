import StockData from '../StockData';
import ShootingStar from './ShootingStar';
import { averageloss } from '../Utils/AverageLoss';
import { averagegain } from '../Utils/AverageGain';
import { bearishinvertedhammerstick } from './BearishInvertedHammerStick';
import { bullishinvertedhammerstick } from './BullishInvertedHammerStick';

export default class ShootingStarUnconfirmed extends ShootingStar {
    constructor(scale: number = 1) {
        super(scale);
        this.name = 'ShootingStarUnconfirmed';
        this.requiredCount = 4; // Reduced from 5 since no confirmation needed
    }

    logic (data:StockData) {
        // Validate data integrity first
        for (let i = 0; i < data.close.length; i++) {
            if (!this.validateOHLC(data.open[i], data.high[i], data.low[i], data.close[i])) {
                return false;
            }
        }
        
        // Check for upward trend and inverted hammer pattern without confirmation
        let isPattern = this.upwardTrend(data, false);
        isPattern = isPattern && this.includesInvertedHammer(data, false);
        return isPattern;
    }

    upwardTrend (data:StockData, confirm = false) {
        // For unconfirmed pattern, we analyze the first 3 candles for upward trend
        let end = 3;
        
        // Ensure we have enough data
        if (data.close.length < end) {
            return false;
        }
        
        // Analyze trends in closing prices of the first three candlesticks
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

    includesInvertedHammer (data:StockData, confirm = false) {
        // For unconfirmed pattern, check the last candle (index 3)
        let start = 3;
        let end = 4;
        
        // Ensure we have the required data
        if (data.close.length < end) {
            return false;
        }
        
        let possibleInvertedHammerData = {
            open: data.open.slice(start, end),
            close: data.close.slice(start, end),
            low: data.low.slice(start, end),
            high: data.high.slice(start, end),
        };

        let isPattern = bearishinvertedhammerstick(possibleInvertedHammerData, this.scale);
        isPattern = isPattern || bullishinvertedhammerstick(possibleInvertedHammerData, this.scale);

        // If not detected by standard inverted hammer logic, check for doji with upper shadow
        if (!isPattern) {
            let daysOpen = possibleInvertedHammerData.open[0];
            let daysClose = possibleInvertedHammerData.close[0];
            let daysHigh = possibleInvertedHammerData.high[0];
            let daysLow = possibleInvertedHammerData.low[0];
            
            // Check for doji (open ≈ close) with long upper shadow
            let isDoji = this.approximateEqual(daysOpen, daysClose);
            let hasMinimalLowerShadow = this.approximateEqual(daysLow, Math.min(daysOpen, daysClose));
            let upperShadow = daysHigh - Math.max(daysOpen, daysClose);
            let totalRange = daysHigh - daysLow;
            
            // For doji shooting star: minimal body, minimal lower shadow, significant upper shadow
            isPattern = isDoji && hasMinimalLowerShadow && (upperShadow >= totalRange * 0.6);
        }

        return isPattern;
    }
}

export function shootingstarunconfirmed(data:StockData, scale: number = 1) {
  return new ShootingStarUnconfirmed(scale).hasPattern(data);
}

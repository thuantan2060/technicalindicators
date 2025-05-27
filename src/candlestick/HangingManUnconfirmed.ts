import StockData from '../StockData';
import HangingMan from './HangingMan';
import { bearishhammerstick } from './BearishHammerStick';
import { bullishhammerstick } from './BullishHammerStick';
import { averagegain } from '../Utils/AverageGain';
import { averageloss } from '../Utils/AverageLoss';

export default class HangingManUnconfirmed extends HangingMan {
    constructor(scale: number = 1) {
        super(scale);
        this.name = 'HangingManUnconfirmed';
        this.requiredCount = 4; // Reduced from 5 since no confirmation needed
    }

    logic (data:StockData) {
        // Validate data integrity first
        for (let i = 0; i < data.close.length; i++) {
            if (!this.validateOHLC(data.open[i], data.high[i], data.low[i], data.close[i])) {
                return false;
            }
        }
        
        // Check for upward trend and hammer pattern without confirmation
        let isPattern = this.upwardTrend(data, false);
        isPattern = isPattern && this.includesHammer(data, false);
        return isPattern;
    }

    upwardTrend (data:StockData, confirm = false) {
        // For unconfirmed pattern, we need an uptrend in the first 3 candles (indices 0-2)
        // The 4th candle (index 3) is the potential hanging man
        
        // Ensure we have enough data
        if (data.close.length < 4) {
            return false;
        }
        
        // Analyze trends in closing prices of the first three candlesticks (indices 0-2)
        let trendData = data.close.slice(0, 3);
        
        // Check for overall upward movement
        let firstClose = trendData[0];
        let lastClose = trendData[trendData.length - 1];
        
        // Must have overall upward movement
        if (lastClose <= firstClose) {
            return false;
        }
        
        // Calculate gains and losses for trend analysis
        let gains = averagegain({ values: trendData, period: trendData.length - 1 });
        let losses = averageloss({ values: trendData, period: trendData.length - 1 });
        
        // Get the latest values from the arrays
        let latestGain = gains.length > 0 ? gains[gains.length - 1] : 0;
        let latestLoss = losses.length > 0 ? losses[losses.length - 1] : 0;
        
        // Additional validation: ensure there's meaningful price movement
        let priceRange = Math.max(...trendData) - Math.min(...trendData);
        let totalMovement = Math.abs(lastClose - firstClose);
        let minMovement = Math.max(priceRange * 0.01, 0.1 * this.scale); // At least 1% movement or scale-based minimum
        
        // Upward trend: more gains than losses, and significant upward movement
        return latestGain > latestLoss && totalMovement >= minMovement;
    }

    includesHammer (data:StockData, confirm = false) {
        // For unconfirmed pattern, check the last candle (index 3) for hammer pattern
        let hammerIndex = 3;
        
        // Ensure we have the required data
        if (data.close.length < 4) {
            return false;
        }
        
        // Create data for just the potential hammer candle
        let hammerData = {
            open: [data.open[hammerIndex]],
            close: [data.close[hammerIndex]],
            low: [data.low[hammerIndex]],
            high: [data.high[hammerIndex]],
        };

        // Check both bearish and bullish hammer patterns
        let isBearishHammer = bearishhammerstick(hammerData, this.scale);
        let isBullishHammer = bullishhammerstick(hammerData, this.scale);

        // Also check using our custom hammer-like detection for more flexibility
        let isCustomHammer = this.isCustomHammerLike(
            data.open[hammerIndex], 
            data.high[hammerIndex], 
            data.low[hammerIndex], 
            data.close[hammerIndex]
        );

        return isBearishHammer || isBullishHammer || isCustomHammer;
    }

    // Custom hammer-like detection that's very lenient for hanging man pattern
    private isCustomHammerLike(open: number, high: number, low: number, close: number): boolean {
        // Basic OHLC validation
        if (!this.validateOHLC(open, high, low, close)) {
            return false;
        }

        let bodySize = Math.abs(close - open);
        let lowerShadow = Math.min(open, close) - low;
        let upperShadow = high - Math.max(open, close);
        let totalRange = high - low;

        // Ensure we have a meaningful range
        if (totalRange <= 0) {
            return false;
        }

        // Simplified approach focusing on key characteristics
        let score = 0;

        // Primary criteria: Either shadow should be meaningful
        if (lowerShadow >= totalRange * 0.08 || upperShadow >= totalRange * 0.08) {
            score += 2; // Base points for having shadows
        }

        // Bonus for traditional hammer (shadow >= body)
        if (lowerShadow >= bodySize || upperShadow >= bodySize) {
            score += 3; // Strong bonus for classic hammer shape
        }

        // Bonus for reasonable body size
        if (bodySize <= totalRange * 0.70) {
            score += 1;
        }

        // Bonus for small body (doji-like patterns)
        if (bodySize <= totalRange * 0.2) {
            score += 2;
        }

        // Bonus for having both shadows (balanced)
        if (lowerShadow > 0 && upperShadow > 0) {
            score += 1;
            
            // Extra bonus for perfectly balanced shadows
            let shadowDifference = Math.abs(lowerShadow - upperShadow);
            if (shadowDifference <= totalRange * 0.01) { // Very similar shadows
                score += 1;
            }
        }

        // Special case: For very small ranges, be more lenient
        if (totalRange <= 1.0 * this.scale) {
            score += 1;
        }

        // Need at least 4 points to be considered a hammer-like pattern
        return score >= 4;
    }
}

export function hangingmanunconfirmed(data:StockData, scale: number = 1) {
  return new HangingManUnconfirmed(scale).hasPattern(data);
}

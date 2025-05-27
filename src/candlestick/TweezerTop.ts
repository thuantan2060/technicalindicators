import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';
import { averageloss } from '../Utils/AverageLoss';
import { averagegain } from '../Utils/AverageGain';

export default class TweezerTop extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'TweezerTop';
        this.requiredCount = 5;
        this.scale = scale;
    }

    logic (data:StockData) {
        // Validate data integrity first
        for (let i = 0; i < data.close.length; i++) {
            if (!this.validateOHLC(data.open[i], data.high[i], data.low[i], data.close[i])) {
                return false;
            }
        }
        
        return this.upwardTrend(data) && this.hasTweezerTopPattern(data);
    }

    upwardTrend (data:StockData) {
        // Ensure we have enough data
        if (data.close.length < 3) {
            return false;
        }
        
        // Analyze trends in closing prices of the first three candlesticks (oldest)
        // For ascending order data, take the first 3 elements
        let gains = averagegain({ values: data.close.slice(0, 3), period: 2 });
        let losses = averageloss({ values: data.close.slice(0, 3), period: 2 });
        
        // Get the latest values from the arrays
        let latestGain = gains.length > 0 ? gains[gains.length - 1] : 0;
        let latestLoss = losses.length > 0 ? losses[losses.length - 1] : 0;
        
        // Additional validation: ensure there's actual price movement
        let closeSlice = data.close.slice(0, 3);
        let priceRange = Math.max(...closeSlice) - Math.min(...closeSlice);
        let minMovement = priceRange * 0.01; // At least 1% movement
        
        // Upward trend, so more gains than losses, and significant movement
        return latestGain > latestLoss && latestGain > minMovement;
    }

    hasTweezerTopPattern (data:StockData) {
        // Ensure we have enough data for the pattern
        if (data.close.length < 5) {
            return false;
        }
        
        // For ascending order data, the last two candles are at the end
        let len = data.close.length;
        let firstCandle = {
            open: data.open[len - 2],
            close: data.close[len - 2],
            low: data.low[len - 2],
            high: data.high[len - 2]
        };
        
        let secondCandle = {
            open: data.open[len - 1],
            close: data.close[len - 1],
            low: data.low[len - 1],
            high: data.high[len - 1]
        };
        
        // Both candles should have approximately equal highs (the "tweezer" effect)
        let hasEqualHighs = this.approximateEqual(firstCandle.high, secondCandle.high);
        
        // Additional criteria for a stronger pattern:
        // 1. Both candles should have meaningful bodies (not dojis) - relaxed requirement
        let firstBodySize = Math.abs(firstCandle.close - firstCandle.open);
        let secondBodySize = Math.abs(secondCandle.close - secondCandle.open);
        let firstRange = firstCandle.high - firstCandle.low;
        let secondRange = secondCandle.high - secondCandle.low;
        
        // More lenient body size requirement (5% instead of 10%)
        let hasMeaningfulBodies = (firstBodySize >= firstRange * 0.05) && 
                                 (secondBodySize >= secondRange * 0.05);
        
        // 2. The second candle should ideally be bearish (reversal signal)
        let secondIsBearish = secondCandle.close < secondCandle.open;
        
        // 3. The highs should be significant resistance levels (higher than recent prices)
        let resistanceLevel = Math.max(firstCandle.high, secondCandle.high);
        // Check against earlier candles (before the tweezer pattern)
        let recentHighs = data.high.slice(0, len - 2);
        let isSignificantResistance = recentHighs.length === 0 || recentHighs.every(high => high <= resistanceLevel);
        
        return hasEqualHighs && hasMeaningfulBodies && (secondIsBearish || isSignificantResistance);
    }
}

export function tweezertop(data:StockData, scale: number = 1) {
  return new TweezerTop(scale).hasPattern(data);
}

import { doji, DEFAULT_DOJI_CONFIG, IDojiConfig } from './Doji';
import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for MorningDojiStar pattern.
 * Only requires scale parameter since this pattern uses direct price comparisons.
 */
export interface IMorningDojiStarConfig extends ICandlestickConfig, IDojiConfig {
    // No additional properties needed - only uses scale for approximateEqual and validateOHLC
}

/**
 * Default configuration for MorningDojiStar pattern.
 */
export const DEFAULT_MORNING_DOJI_STAR_CONFIG: IMorningDojiStarConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG,
    ...DEFAULT_DOJI_CONFIG
};

export default class MorningDojiStar extends CandlestickFinder {
    private readonly config: IMorningDojiStarConfig;

    constructor(config: IMorningDojiStarConfig = DEFAULT_MORNING_DOJI_STAR_CONFIG) {
        super(config);
        this.name = 'MorningDojiStar';
        this.requiredCount = 3;
        this.config = config;
    }
    
    logic(data: StockData) {
        // For ascending order data: [0]=oldest (day 1), [1]=middle (day 2), [2]=newest (day 3)
        let firstdaysOpen = data.open[0];   // Day 1 (oldest) - should be bearish candle
        let firstdaysClose = data.close[0];
        let firstdaysHigh = data.high[0];
        let firstdaysLow = data.low[0];
        
        let seconddaysOpen = data.open[1];   // Day 2 (middle) - should be doji star
        let seconddaysClose = data.close[1];
        let seconddaysHigh = data.high[1];
        let seconddaysLow = data.low[1];
        
        let thirddaysOpen = data.open[2];   // Day 3 (newest) - should be bullish candle
        let thirddaysClose = data.close[2];
        let thirddaysHigh = data.high[2];
        let thirddaysLow = data.low[2];

        // Validate OHLC data integrity for all three days
        let ohlcValid = this.validateOHLC(firstdaysOpen, firstdaysHigh, firstdaysLow, firstdaysClose) &&
                       this.validateOHLC(seconddaysOpen, seconddaysHigh, seconddaysLow, seconddaysClose) &&
                       this.validateOHLC(thirddaysOpen, thirddaysHigh, thirddaysLow, thirddaysClose);
        
        if (!ohlcValid) {
            return false;
        }
         
        let firstdaysMidpoint = ((firstdaysOpen + firstdaysClose) / 2);
        let isFirstBearish = firstdaysClose < firstdaysOpen;
        
        // Use the doji function with proper config object
        let dojiExists = doji({
            "open": [seconddaysOpen],
            "close": [seconddaysClose],
            "high": [seconddaysHigh],
            "low": [seconddaysLow]
        }, this.config);
        
        let isThirdBullish = thirddaysOpen < thirddaysClose; 

        // Gap conditions: day2 should gap down from day1, day3 should gap up from day2
        let gapExists = ((seconddaysHigh < firstdaysLow) && 
                        (seconddaysLow < firstdaysLow) && 
                        (thirddaysOpen > seconddaysHigh) && 
                        (seconddaysClose < thirddaysOpen));
        let doesCloseAboveFirstMidpoint = thirddaysClose > firstdaysMidpoint;
        
        return (isFirstBearish && dojiExists && isThirdBullish && gapExists && 
                doesCloseAboveFirstMidpoint);
    }
}

export function morningdojistar(data: StockData, config: IMorningDojiStarConfig = DEFAULT_MORNING_DOJI_STAR_CONFIG) {
    return new MorningDojiStar(config).hasPattern(data);
}
import StockData from '../StockData';

/**
 * Basic configuration interface for CandlestickFinder base class.
 * Only contains the scale parameter used by approximateEqual function.
 */
export interface ICandlestickConfig {
    /** Scale parameter for approximateEqual function precision (default: 0.001) */
    scale?: number;
}

/**
 * Default configuration for CandlestickFinder base class.
 */
export const DEFAULT_CANDLESTICK_CONFIG: ICandlestickConfig = {
    scale: 0.1
};

export default class CandlestickFinder {
    requiredCount: number
    name: string
    
    /**
     * Scale parameter for price comparison precision in approximateEqual function.
     * This should ONLY be used in the approximateEqual method, not in other pattern calculations.
     */
    scale: number

    constructor(config: ICandlestickConfig = DEFAULT_CANDLESTICK_CONFIG) {
        // Apply configuration with defaults
        const finalConfig = { ...DEFAULT_CANDLESTICK_CONFIG, ...config };
        this.scale = finalConfig.scale!;
    }
    
    /**
     * Compares two numbers for approximate equality using scale-dependent threshold.
     * This is the ONLY place where this.scale should be used in pattern detection.
     * 
     * @param a First number to compare
     * @param b Second number to compare
     * @returns true if the numbers are approximately equal, false otherwise
     */
    approximateEqual(a: number, b: number): boolean {
        // Handle edge cases
        if (a === b) return true;
        if (isNaN(a) || isNaN(b) || !isFinite(a) || !isFinite(b)) return false;
        
        let left = parseFloat(Math.abs(a - b).toPrecision(4)) * 1;
        
        return left <= this.scale;
    }
    
    /**
     * Helper method to validate OHLC data integrity
     */
    protected validateOHLC(open: number, high: number, low: number, close: number): boolean {
        // Check for NaN or infinite values
        if (!isFinite(open) || !isFinite(high) || !isFinite(low) || !isFinite(close)) {
            return false;
        }
        
        // Check basic OHLC constraints
        if (high < Math.max(open, close) || low > Math.min(open, close)) {
            return false;
        }
        
        // Check for negative prices (optional, depends on use case)
        if (open < 0 || high < 0 || low < 0 || close < 0) {
            return false;
        }
        
        return true;
    }
    
    logic(data: StockData): boolean {
        throw "this has to be implemented";        
    }

    getAllPatternIndex(data: StockData) {
        if (!data || !data.close || data.close.length < this.requiredCount) {
            return [];
        }
        
        // Validate data arrays have same length
        if (data.open.length !== data.close.length || 
            data.high.length !== data.close.length || 
            data.low.length !== data.close.length) {
            return [];
        }
        
        if (data.reversedInput) {
            data.open.reverse();
            data.high.reverse();
            data.low.reverse();
            data.close.reverse();
        }
        let strategyFn = this.logic;
        return this._generateDataForCandleStick(data)
                .map((current, index) => {
                            return strategyFn.call(this, current) ? index : undefined;
                        }).filter((hasIndex) => {
                            return hasIndex !== undefined;
                        });
    }

    hasPattern(data: StockData) {
        if (!data || !data.close || data.close.length < this.requiredCount) {
            return false;
        }
        
        // Validate data arrays have same length
        if (data.open.length !== data.close.length || 
            data.high.length !== data.close.length || 
            data.low.length !== data.close.length) {
            return false;
        }
        
        if (data.reversedInput) {
            data.open.reverse();
            data.high.reverse();
            data.low.reverse();
            data.close.reverse();
        }
        let strategyFn = this.logic;
        return strategyFn.call(this, this._getLastDataForCandleStick(data));
    }

    protected _getLastDataForCandleStick(data: StockData) {
        let requiredCount = this.requiredCount;
        if (data.close.length === requiredCount) {
            return data;
        } else {
            let returnVal = {
                open: [],
                high: [],
                low: [],
                close: []
            } as StockData;
            let i = 0;
            // For ascending order data, get the last requiredCount elements
            let startIndex = data.close.length - requiredCount;
            while (i < requiredCount) {
                returnVal.open.push(data.open[startIndex + i]);
                returnVal.high.push(data.high[startIndex + i]);
                returnVal.low.push(data.low[startIndex + i]);
                returnVal.close.push(data.close[startIndex + i]);
                i++;
            }
            return returnVal;
        }
    }

    protected _generateDataForCandleStick(data: StockData) {
        let requiredCount = this.requiredCount;
        let generatedData = [];
        
        // Generate sliding windows for pattern detection
        for (let index = 0; index <= data.close.length - requiredCount; index++) {
            let returnVal = {
                open: [],
                high: [],
                low: [],
                close: []
            } as StockData;
            
            for (let i = 0; i < requiredCount; i++) {
                returnVal.open.push(data.open[index + i]);
                returnVal.high.push(data.high[index + i]);
                returnVal.low.push(data.low[index + i]);
                returnVal.close.push(data.close[index + i]);
            }
            generatedData.push(returnVal);
        }
        
        return generatedData;
    }
}
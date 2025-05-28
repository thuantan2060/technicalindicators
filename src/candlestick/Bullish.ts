import MorningStar, { DEFAULT_MORNING_STAR_CONFIG, IMorningStarConfig } from './MorningStar';
import BullishEngulfingPattern, { DEFAULT_BULLISH_ENGULFING_CONFIG, IBullishEngulfingConfig } from './BullishEngulfingPattern';
import BullishHarami, { DEFAULT_BULLISH_HARAMI_CONFIG, IBullishHaramiConfig } from './BullishHarami';
import BullishHaramiCross, { DEFAULT_BULLISH_HARAMI_CROSS_CONFIG, IBullishHaramiCrossConfig } from './BullishHaramiCross';
import MorningDojiStar, { DEFAULT_MORNING_DOJI_STAR_CONFIG, IMorningDojiStarConfig } from './MorningDojiStar';
import DownsideTasukiGap, { DEFAULT_DOWNSIDE_TASUKI_GAP_CONFIG } from './DownsideTasukiGap';
import BullishMarubozu, { DEFAULT_BULLISH_MARUBOZU_CONFIG, IBullishMarubozuConfig } from './BullishMarubozu';
import PiercingLine, { DEFAULT_PIERCING_LINE_CONFIG, IPiercingLineConfig } from './PiercingLine';
import ThreeWhiteSoldiers, { DEFAULT_THREE_WHITE_SOLDIERS_CONFIG, IThreeWhiteSoldiersConfig } from './ThreeWhiteSoldiers';
import BullishHammerStick, { DEFAULT_BULLISH_HAMMER_CONFIG, IBullishHammerConfig } from './BullishHammerStick';
import BullishInvertedHammerStick, { DEFAULT_BULLISH_INVERTED_HAMMER_STICK_CONFIG, IBullishInvertedHammerStickConfig } from './BullishInvertedHammerStick';
import HammerPattern, { DEFAULT_HAMMER_PATTERN_CONFIG, IHammerPatternConfig } from './HammerPattern';
import HammerPatternUnconfirmed, { DEFAULT_HAMMER_PATTERN_UNCONFIRMED_CONFIG, IHammerPatternUnconfirmedConfig } from './HammerPatternUnconfirmed';
import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';
import TweezerBottom, { DEFAULT_TWEEZER_BOTTOM_CONFIG, ITweezerBottomConfig } from './TweezerBottom';

/**
 * Configuration interface for Bullish patterns composite.
 * Only requires scale parameter since this is a composite pattern.
 */
export interface IBullishConfig extends ICandlestickConfig, IBullishEngulfingConfig, IBullishHaramiConfig, IBullishHaramiCrossConfig, IMorningStarConfig, IMorningDojiStarConfig, IBullishMarubozuConfig, IPiercingLineConfig, IThreeWhiteSoldiersConfig, IBullishHammerConfig, IBullishInvertedHammerStickConfig, IHammerPatternConfig, IHammerPatternUnconfirmedConfig, ITweezerBottomConfig {
    // No additional properties needed - only uses scale for approximateEqual
}

/**
 * Default configuration for Bullish patterns composite.
 */
export const DEFAULT_BULLISH_CONFIG: IBullishConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG,
    ...DEFAULT_BULLISH_ENGULFING_CONFIG,
    ...DEFAULT_DOWNSIDE_TASUKI_GAP_CONFIG,
    ...DEFAULT_BULLISH_HARAMI_CONFIG,
    ...DEFAULT_BULLISH_HARAMI_CROSS_CONFIG,
    ...DEFAULT_MORNING_STAR_CONFIG,
    ...DEFAULT_MORNING_DOJI_STAR_CONFIG,
    ...DEFAULT_BULLISH_MARUBOZU_CONFIG,
    ...DEFAULT_PIERCING_LINE_CONFIG,
    ...DEFAULT_THREE_WHITE_SOLDIERS_CONFIG,
    ...DEFAULT_BULLISH_HAMMER_CONFIG,
    ...DEFAULT_BULLISH_INVERTED_HAMMER_STICK_CONFIG,
    ...DEFAULT_HAMMER_PATTERN_CONFIG,
    ...DEFAULT_HAMMER_PATTERN_UNCONFIRMED_CONFIG,
    ...DEFAULT_TWEEZER_BOTTOM_CONFIG,
};

export default class BullishPatterns extends CandlestickFinder {
    bullishPatterns: CandlestickFinder[];
    
    constructor(config: IBullishConfig = DEFAULT_BULLISH_CONFIG) {
        super(config);
        this.name = 'Bullish Candlesticks';
        
        // Initialize all bullish patterns with their default configurations
        this.bullishPatterns = [
            new BullishEngulfingPattern(config),
            new DownsideTasukiGap(config),
            new BullishHarami(config),
            new BullishHaramiCross(config),
            new MorningDojiStar(config),
            new MorningStar(config),
            new BullishMarubozu(config),
            new PiercingLine(config),
            new ThreeWhiteSoldiers(config),
            new BullishHammerStick(config),
            new BullishInvertedHammerStick(config),
            new HammerPattern(config),
            new HammerPatternUnconfirmed(config),
            new TweezerBottom(config)
        ];
    }

    hasPattern(data: StockData) {
        return this.bullishPatterns.reduce(function (state, pattern) {
            let result = pattern.hasPattern(data);
            return state || result;
        }, false)
    }
}

/**
 * Detects any bullish candlestick pattern in the provided stock data.
 * 
 * This function checks for multiple bullish candlestick patterns including:
 * - Bullish Engulfing Pattern
 * - Bullish Harami and Bullish Harami Cross
 * - Morning Star and Morning Doji Star
 * - Bullish Marubozu
 * - Three White Soldiers
 * - Bullish Hammer Stick and Bullish Inverted Hammer Stick
 * - Hammer Pattern and Hammer Pattern Unconfirmed
 * - Downside Tasuki Gap, Piercing Line, and Tweezer Bottom
 * 
 * @param data - Stock data containing OHLC values
 * @param config - Configuration object for pattern detection
 * @param config.scale - Scale parameter for approximateEqual function precision (default: 0.001)
 * @returns True if any bullish pattern is detected, false otherwise
 * 
 * @example
 * ```typescript
 * // Using default configuration
 * const hasBullishPattern = bullish(stockData);
 * 
 * // Using custom configuration
 * const hasBullishPattern = bullish(stockData, {
 *   scale: 0.002
 * });
 * 
 * // Backward compatibility with scale parameter
 * const hasBullishPattern = bullish(stockData, { scale: 0.002 });
 * ```
 */
export function bullish(data: StockData, config: IBullishConfig = DEFAULT_BULLISH_CONFIG) {
    return new BullishPatterns(config).hasPattern(data);
}
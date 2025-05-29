import BearishEngulfingPattern, { DEFAULT_BEARISH_ENGULFING_CONFIG, IBearishEngulfingConfig } from './BearishEngulfingPattern';
import BearishHarami, { DEFAULT_BEARISH_HARAMI_CONFIG, IBearishHaramiConfig } from './BearishHarami';
import BearishHaramiCross, { DEFAULT_BEARISH_HARAMI_CROSS_CONFIG, IBearishHaramiCrossConfig } from './BearishHaramiCross';
import EveningDojiStar, { DEFAULT_EVENING_DOJI_STAR_CONFIG, IEveningDojiStarConfig } from './EveningDojiStar';
import EveningStar, { DEFAULT_EVENING_STAR_CONFIG, IEveningStarConfig } from './EveningStar';
import BearishMarubozu, { DEFAULT_BEARISH_MARUBOZU_CONFIG, IBearishMarubozuConfig } from './BearishMarubozu';
import ThreeBlackCrows, { DEFAULT_THREE_BLACK_CROWS_CONFIG, IThreeBlackCrowsConfig } from './ThreeBlackCrows';
import BearishHammerStick, { DEFAULT_BEARISH_HAMMER_STICK_CONFIG, IBearishHammerStickConfig } from './BearishHammerStick';
import BearishInvertedHammerStick, { DEFAULT_BEARISH_INVERTED_HAMMER_CONFIG, IBearishInvertedHammerConfig } from './BearishInvertedHammerStick';
import HangingMan, { DEFAULT_HANGING_MAN_CONFIG, IHangingManConfig } from './HangingMan';
import HangingManUnconfirmed, { DEFAULT_HANGING_MAN_UNCONFIRMED_CONFIG, IHangingManUnconfirmedConfig } from './HangingManUnconfirmed';
import ShootingStar, { DEFAULT_SHOOTING_STAR_CONFIG, IShootingStarConfig } from './ShootingStar';
import ShootingStarUnconfirmed, { DEFAULT_SHOOTING_STAR_UNCONFIRMED_CONFIG, IShootingStarUnconfirmedConfig } from './ShootingStarUnconfirmed';
import TweezerTop, { DEFAULT_TWEEZER_TOP_CONFIG, ITweezerTopConfig } from './TweezerTop';
import StockData from '../StockData';
import CandlestickFinder, { ICandlestickConfig, DEFAULT_CANDLESTICK_CONFIG } from './CandlestickFinder';

/**
 * Configuration interface for Bearish patterns composite.
 * Only requires scale parameter since this is a composite pattern.
 */
export interface IBearishConfig extends ICandlestickConfig, IBearishEngulfingConfig, IBearishHaramiConfig, IBearishHaramiCrossConfig, IEveningStarConfig, IEveningDojiStarConfig, IBearishMarubozuConfig, IThreeBlackCrowsConfig, IBearishHammerStickConfig, IBearishInvertedHammerConfig, IHangingManConfig, IHangingManUnconfirmedConfig, IShootingStarConfig, IShootingStarUnconfirmedConfig, ITweezerTopConfig {
    // No additional properties needed - only uses scale for approximateEqual
}

/**
 * Default configuration for Bearish patterns composite.
 */
export const DEFAULT_BEARISH_CONFIG: IBearishConfig = {
    ...DEFAULT_CANDLESTICK_CONFIG,
    ...DEFAULT_BEARISH_ENGULFING_CONFIG,
    ...DEFAULT_BEARISH_HARAMI_CONFIG,
    ...DEFAULT_BEARISH_HARAMI_CROSS_CONFIG,
    ...DEFAULT_EVENING_STAR_CONFIG,
    ...DEFAULT_EVENING_DOJI_STAR_CONFIG,
    ...DEFAULT_BEARISH_MARUBOZU_CONFIG,
    ...DEFAULT_THREE_BLACK_CROWS_CONFIG,
    ...DEFAULT_BEARISH_HAMMER_STICK_CONFIG,
    ...DEFAULT_BEARISH_INVERTED_HAMMER_CONFIG,
    ...DEFAULT_HANGING_MAN_CONFIG,
    ...DEFAULT_HANGING_MAN_UNCONFIRMED_CONFIG,
    ...DEFAULT_SHOOTING_STAR_CONFIG,
    ...DEFAULT_SHOOTING_STAR_UNCONFIRMED_CONFIG,
    ...DEFAULT_TWEEZER_TOP_CONFIG
};

export default class BearishPatterns extends CandlestickFinder {
    bearishPatterns: CandlestickFinder[];

    constructor(config?: IBearishConfig) {
        const finalConfig = { ...DEFAULT_BEARISH_CONFIG, ...config };
        super(finalConfig);
        this.name = 'Bearish Candlesticks';

        // Initialize all bearish patterns with their default configurations
        this.bearishPatterns = [
            new BearishEngulfingPattern(config),
            new BearishHarami(config),
            new BearishHaramiCross(config),
            new EveningDojiStar(config),
            new EveningStar(config),
            new BearishMarubozu(config),
            new ThreeBlackCrows(config),
            new BearishHammerStick(config),
            new BearishInvertedHammerStick(config),
            new HangingMan(config),
            new HangingManUnconfirmed(config),
            new ShootingStar(config),
            new ShootingStarUnconfirmed(config),
            new TweezerTop(config)
        ];
    }

    hasPattern (data:StockData) {
        return this.bearishPatterns.reduce(function(state, pattern) {
            return state || pattern.hasPattern(data);
        }, false)
    }
}

/**
 * Detects any bearish candlestick pattern in the provided stock data.
 *
 * This function checks for multiple bearish candlestick patterns including:
 * - Bearish Engulfing Pattern
 * - Bearish Harami and Bearish Harami Cross
 * - Evening Star and Evening Doji Star
 * - Bearish Marubozu
 * - Three Black Crows
 * - Bearish Hammer Stick and Bearish Inverted Hammer Stick
 * - Hanging Man and Shooting Star patterns
 * - Tweezer Top
 *
 * @param data - Stock data containing OHLC values
 * @param config - Configuration object for pattern detection
 * @param config.scale - Scale parameter for approximateEqual function precision (default: 0.001)
 * @returns True if any bearish pattern is detected, false otherwise
 *
 * @example
 * ```typescript
 * // Using default configuration
 * const hasBearishPattern = bearish(stockData);
 *
 * // Using custom configuration
 * const hasBearishPattern = bearish(stockData, {
 *   scale: 0.002
 * });
 *
 * // Backward compatibility with scale parameter
 * const hasBearishPattern = bearish(stockData, { scale: 0.002 });
 * ```
 */
export function bearish(data: StockData, config: IBearishConfig = DEFAULT_BEARISH_CONFIG) {
    return new BearishPatterns(config).hasPattern(data);
}
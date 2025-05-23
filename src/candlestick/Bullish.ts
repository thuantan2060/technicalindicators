import MorningStar from './MorningStar';
import BullishEngulfingPattern from './BullishEngulfingPattern';
import BullishHarami from './BullishHarami';
import BullishHaramiCross from './BullishHaramiCross';
import MorningDojiStar from './MorningDojiStar';
import DownsideTasukiGap from './DownsideTasukiGap';
import BullishMarubozu from './BullishMarubozu';
import PiercingLine from './PiercingLine';
import ThreeWhiteSoldiers from './ThreeWhiteSoldiers';
import BullishHammerStick from './BullishHammerStick';
import BullishInvertedHammerStick from './BullishInvertedHammerStick';
import HammerPattern from './HammerPattern';
import HammerPatternUnconfirmed from './HammerPatternUnconfirmed';
import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';
import TweezerBottom from './TweezerBottom';

export default class BullishPatterns extends CandlestickFinder {
    bullishPatterns: CandlestickFinder[];
    
    constructor(scale: number = 1) {
        super();
        this.name = 'Bullish Candlesticks';
        this.scale = scale;
        
        this.bullishPatterns = [
            new BullishEngulfingPattern(scale),
            new DownsideTasukiGap(scale),
            new BullishHarami(scale),
            new BullishHaramiCross(scale),
            new MorningDojiStar(scale),
            new MorningStar(scale),
            new BullishMarubozu(scale),
            new PiercingLine(scale),
            new ThreeWhiteSoldiers(scale),
            new BullishHammerStick(scale),
            new BullishInvertedHammerStick(scale),
            new HammerPattern(scale),
            new HammerPatternUnconfirmed(scale),
            new TweezerBottom(scale)
        ];
    }

    hasPattern(data: StockData) {
        return this.bullishPatterns.reduce(function (state, pattern) {
            let result = pattern.hasPattern(data);
            return state || result;
        }, false)
    }
}

export function bullish(data: StockData, scale: number = 1) {
    return new BullishPatterns(scale).hasPattern(data);
}
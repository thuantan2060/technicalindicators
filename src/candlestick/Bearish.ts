import BearishEngulfingPattern from './BearishEngulfingPattern';
import BearishHarami from './BearishHarami';
import BearishHaramiCross from './BearishHaramiCross';
import EveningDojiStar from './EveningDojiStar';
import EveningStar from './EveningStar';
import BearishMarubozu from './BearishMarubozu';
import ThreeBlackCrows from './ThreeBlackCrows';
import BearishHammerStick from './BearishHammerStick';
import BearishInvertedHammerStick from './BearishInvertedHammerStick';
import HangingMan from './HangingMan';
import HangingManUnconfirmed from './HangingManUnconfirmed';
import ShootingStar from './ShootingStar';
import ShootingStarUnconfirmed from './ShootingStarUnconfirmed';
import TweezerTop from './TweezerTop';
import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class BearishPatterns extends CandlestickFinder {
    bearishPatterns: CandlestickFinder[];
    
    constructor(scale: number = 1) {
        super();
        this.name = 'Bearish Candlesticks';
        this.scale = scale;
        
        this.bearishPatterns = [
            new BearishEngulfingPattern(scale),
            new BearishHarami(scale),
            new BearishHaramiCross(scale),
            new EveningDojiStar(scale),
            new EveningStar(scale),
            new BearishMarubozu(scale),
            new ThreeBlackCrows(scale),
            new BearishHammerStick(scale),
            new BearishInvertedHammerStick(scale),
            new HangingMan(scale),
            new HangingManUnconfirmed(scale),
            new ShootingStar(scale),
            new ShootingStarUnconfirmed(scale),
            new TweezerTop(scale)
        ];
    }

    hasPattern (data:StockData) {
        return this.bearishPatterns.reduce(function(state, pattern) {
            return state || pattern.hasPattern(data);
        }, false)
    }
}

export function bearish(data:StockData, scale: number = 1){
    return new BearishPatterns(scale).hasPattern(data);
}
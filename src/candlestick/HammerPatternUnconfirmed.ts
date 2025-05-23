import StockData from '../StockData';
import HammerPattern from './HammerPattern';

export default class HammerPatternUnconfirmed extends HammerPattern {
    constructor(scale: number = 1) {
        super(scale);
        this.name = 'HammerPatternUnconfirmed';
    }

    logic (data:StockData) {
        let isPattern = this.downwardTrend(data, false);
        isPattern = isPattern && this.includesHammer(data, false);
        return isPattern;
   }
}

export function hammerpatternunconfirmed(data:StockData, scale: number = 1) {
  return new HammerPatternUnconfirmed(scale).hasPattern(data);
}

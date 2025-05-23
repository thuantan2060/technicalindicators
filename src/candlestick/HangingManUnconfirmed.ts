import StockData from '../StockData';
import HangingMan from './HangingMan';

export default class HangingManUnconfirmed extends HangingMan {
    constructor(scale: number = 1) {
        super(scale);
        this.name = 'HangingManUnconfirmed';
    }

    logic (data:StockData) {
        let isPattern = this.upwardTrend(data, false);
        isPattern = isPattern && this.includesHammer(data, false);
        return isPattern;
    }
}

export function hangingmanunconfirmed(data:StockData, scale: number = 1) {
  return new HangingManUnconfirmed(scale).hasPattern(data);
}

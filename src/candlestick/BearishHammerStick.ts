import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class BearishHammerStick extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'BearishHammerStick';
        this.requiredCount  = 1;
        this.scale = scale;
    }
    logic (data:StockData) {
        let daysOpen  = data.open[0];
        let daysClose = data.close[0];
        let daysHigh  = data.high[0];
        let daysLow   = data.low[0];

        let isBearishHammer = daysOpen > daysClose;
        isBearishHammer = isBearishHammer && this.approximateEqual(daysOpen, daysHigh);
        isBearishHammer = isBearishHammer && (daysOpen - daysClose) <= 2 * (daysClose - daysLow);

        return isBearishHammer;
    }
}

export function bearishhammerstick(data:StockData, scale: number = 1) {
  return new BearishHammerStick(scale).hasPattern(data);
}
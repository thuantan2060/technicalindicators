import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';

export default class BullishInvertedHammerStick extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'BullishInvertedHammerStick';
        this.requiredCount  = 1;
        this.scale = scale;
    }
    logic (data:StockData) {
        let daysOpen  = data.open[0];
        let daysClose = data.close[0];
        let daysHigh  = data.high[0];
        let daysLow   = data.low[0];

        let isBullishInvertedHammer = daysClose > daysOpen;
        isBullishInvertedHammer = isBullishInvertedHammer && this.approximateEqual(daysOpen, daysLow);
        isBullishInvertedHammer = isBullishInvertedHammer && (daysClose - daysOpen) <= 2 * (daysHigh - daysClose);

        return isBullishInvertedHammer;
    }
}

export function bullishinvertedhammerstick(data:StockData, scale: number = 1) {
  return new BullishInvertedHammerStick(scale).hasPattern(data);
}
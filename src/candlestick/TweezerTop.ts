import StockData from '../StockData';
import CandlestickFinder from './CandlestickFinder';
import { averageloss } from '../Utils/AverageLoss';
import { averagegain } from '../Utils/AverageGain';

export default class TweezerTop extends CandlestickFinder {
    constructor(scale: number = 1) {
        super();
        this.name = 'TweezerTop';
        this.requiredCount = 5;
        this.scale = scale;
    }

    logic (data:StockData) {
        return this.upwardTrend(data) && this.approximateEqual(data.high[3], data.high[4]);
    }

    upwardTrend (data:StockData) {
        // Analyze trends in closing prices of the first three or four candlesticks
        let gains = averagegain({ values: data.close.slice(0, 3), period: 2 });
        let losses = averageloss({ values: data.close.slice(0, 3), period: 2 });
        // Upward trend, so more gains than losses
        return gains > losses;
    }
}

export function tweezertop(data:StockData, scale: number = 1) {
  return new TweezerTop(scale).hasPattern(data);
}

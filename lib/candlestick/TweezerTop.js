"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.tweezertop = tweezertop;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
var _AverageLoss = require("../Utils/AverageLoss");
var _AverageGain = require("../Utils/AverageGain");
class TweezerTop extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.name = 'TweezerTop';
    this.requiredCount = 5;
    this.scale = scale;
  }
  logic(data) {
    return this.upwardTrend(data) && this.approximateEqual(data.high[3], data.high[4]);
  }
  upwardTrend(data) {
    // Analyze trends in closing prices of the first three or four candlesticks
    let gains = (0, _AverageGain.averagegain)({
      values: data.close.slice(0, 3),
      period: 2
    });
    let losses = (0, _AverageLoss.averageloss)({
      values: data.close.slice(0, 3),
      period: 2
    });
    // Upward trend, so more gains than losses
    return gains > losses;
  }
}
exports.default = TweezerTop;
function tweezertop(data, scale = 1) {
  return new TweezerTop(scale).hasPattern(data);
}
//# sourceMappingURL=TweezerTop.js.map
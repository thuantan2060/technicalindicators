"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.tweezerbottom = tweezerbottom;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
var _AverageLoss = require("../Utils/AverageLoss");
var _AverageGain = require("../Utils/AverageGain");
class TweezerBottom extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.name = 'TweezerBottom';
    this.requiredCount = 5;
    this.scale = scale;
  }
  logic(data) {
    return this.downwardTrend(data) && this.approximateEqual(data.low[3], data.low[4]);
  }
  downwardTrend(data) {
    // Analyze trends in closing prices of the first three or four candlesticks
    let gains = (0, _AverageGain.averagegain)({
      values: data.close.slice(0, 3),
      period: 2
    });
    let losses = (0, _AverageLoss.averageloss)({
      values: data.close.slice(0, 3),
      period: 2
    });
    // Downward trend, so more losses than gains
    return losses > gains;
  }
}
exports.default = TweezerBottom;
function tweezerbottom(data, scale = 1) {
  return new TweezerBottom(scale).hasPattern(data);
}
//# sourceMappingURL=TweezerBottom.js.map
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.threeblackcrows = threeblackcrows;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
class ThreeBlackCrows extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.name = 'ThreeBlackCrows';
    this.requiredCount = 3;
    this.scale = scale;
  }
  logic(data) {
    let firstdaysOpen = data.open[0];
    let firstdaysClose = data.close[0];
    let firstdaysHigh = data.high[0];
    let firstdaysLow = data.low[0];
    let seconddaysOpen = data.open[1];
    let seconddaysClose = data.close[1];
    let seconddaysHigh = data.high[1];
    let seconddaysLow = data.low[1];
    let thirddaysOpen = data.open[2];
    let thirddaysClose = data.close[2];
    let thirddaysHigh = data.high[2];
    let thirddaysLow = data.low[2];
    let isDownTrend = firstdaysLow > seconddaysLow && seconddaysLow > thirddaysLow;
    let isAllBearish = firstdaysOpen > firstdaysClose && seconddaysOpen > seconddaysClose && thirddaysOpen > thirddaysClose;
    let doesOpenWithinPreviousBody = firstdaysOpen > seconddaysOpen && seconddaysOpen > firstdaysClose && seconddaysOpen > thirddaysOpen && thirddaysOpen > seconddaysClose;
    return isDownTrend && isAllBearish && doesOpenWithinPreviousBody;
  }
}
exports.default = ThreeBlackCrows;
function threeblackcrows(data, scale = 1) {
  return new ThreeBlackCrows(scale).hasPattern(data);
}
//# sourceMappingURL=ThreeBlackCrows.js.map
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.downsidetasukigap = downsidetasukigap;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
class DownsideTasukiGap extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.requiredCount = 3;
    this.name = 'DownsideTasukiGap';
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
    let isFirstBearish = firstdaysClose < firstdaysOpen;
    let isSecondBearish = seconddaysClose < seconddaysOpen;
    let isThirdBullish = thirddaysClose > thirddaysOpen;
    let isFirstGapExists = seconddaysHigh < firstdaysLow;
    let isDownsideTasukiGap = seconddaysOpen > thirddaysOpen && seconddaysClose < thirddaysOpen && thirddaysClose > seconddaysOpen && thirddaysClose < firstdaysClose;
    return isFirstBearish && isSecondBearish && isThirdBullish && isFirstGapExists && isDownsideTasukiGap;
  }
}
exports.default = DownsideTasukiGap;
function downsidetasukigap(data, scale = 1) {
  return new DownsideTasukiGap(scale).hasPattern(data);
}
//# sourceMappingURL=DownsideTasukiGap.js.map
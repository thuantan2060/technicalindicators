"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.darkcloudcover = darkcloudcover;
exports.default = void 0;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
class DarkCloudCover extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.name = 'DarkCloudCover';
    this.requiredCount = 2;
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
    let firstdayMidpoint = (firstdaysClose + firstdaysOpen) / 2;
    let isFirstBullish = firstdaysClose > firstdaysOpen;
    let isSecondBearish = seconddaysClose < seconddaysOpen;
    let isDarkCloudPattern = seconddaysOpen > firstdaysHigh && seconddaysClose < firstdayMidpoint && seconddaysClose > firstdaysOpen;
    return isFirstBullish && isSecondBearish && isDarkCloudPattern;
  }
}
exports.default = DarkCloudCover;
function darkcloudcover(data, scale = 1) {
  return new DarkCloudCover(scale).hasPattern(data);
}
//# sourceMappingURL=DarkCloudCover.js.map
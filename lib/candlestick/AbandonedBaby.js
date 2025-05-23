"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.abandonedbaby = abandonedbaby;
exports.default = void 0;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
var _Doji = _interopRequireDefault(require("./Doji"));
class AbandonedBaby extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.name = 'AbandonedBaby';
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
    let isFirstBearish = firstdaysClose < firstdaysOpen;
    let dojiExists = new _Doji.default().hasPattern({
      "open": [seconddaysOpen],
      "close": [seconddaysClose],
      "high": [seconddaysHigh],
      "low": [seconddaysLow]
    });
    let gapExists = seconddaysHigh < firstdaysLow && thirddaysLow > seconddaysHigh && thirddaysClose > thirddaysOpen;
    let isThirdBullish = thirddaysHigh < firstdaysOpen;
    return isFirstBearish && dojiExists && gapExists && isThirdBullish;
  }
}
exports.default = AbandonedBaby;
function abandonedbaby(data, scale = 1) {
  return new AbandonedBaby(scale).hasPattern(data);
}
//# sourceMappingURL=AbandonedBaby.js.map
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bearishharamicross = bearishharamicross;
exports.default = void 0;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
class BearishHaramiCross extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.requiredCount = 2;
    this.name = 'BearishHaramiCross';
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
    let isBearishHaramiCrossPattern = firstdaysOpen < seconddaysOpen && firstdaysClose >= seconddaysOpen && firstdaysClose > seconddaysClose && firstdaysOpen < seconddaysLow && firstdaysHigh > seconddaysHigh;
    let isSecondDayDoji = this.approximateEqual(seconddaysOpen, seconddaysClose);
    return isBearishHaramiCrossPattern && isSecondDayDoji;
  }
}
exports.default = BearishHaramiCross;
function bearishharamicross(data, scale = 1) {
  return new BearishHaramiCross(scale).hasPattern(data);
}
//# sourceMappingURL=BearishHaramiCross.js.map
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.piercingline = piercingline;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
class PiercingLine extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.requiredCount = 2;
    this.name = 'PiercingLine';
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
    let firstdaysMidpoint = (firstdaysOpen + firstdaysClose) / 2;
    let isDowntrend = seconddaysLow < firstdaysLow;
    let isFirstBearish = firstdaysClose < firstdaysOpen;
    let isSecondBullish = seconddaysClose > seconddaysOpen;
    let isPiercingLinePattern = firstdaysLow > seconddaysOpen && seconddaysClose > firstdaysMidpoint;
    return isDowntrend && isFirstBearish && isPiercingLinePattern && isSecondBullish;
  }
}
exports.default = PiercingLine;
function piercingline(data, scale = 1) {
  return new PiercingLine(scale).hasPattern(data);
}
//# sourceMappingURL=PiercingLine.js.map
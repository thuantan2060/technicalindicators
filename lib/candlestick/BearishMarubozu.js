"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bearishmarubozu = bearishmarubozu;
exports.default = void 0;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
class BearishMarubozu extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.name = 'BearishMarubozu';
    this.requiredCount = 1;
    this.scale = scale;
  }
  logic(data) {
    let daysOpen = data.open[0];
    let daysClose = data.close[0];
    let daysHigh = data.high[0];
    let daysLow = data.low[0];
    let isBearishMarbozu = this.approximateEqual(daysOpen, daysHigh) && this.approximateEqual(daysLow, daysClose) && daysOpen > daysClose && daysOpen > daysLow;
    return isBearishMarbozu;
  }
}
exports.default = BearishMarubozu;
function bearishmarubozu(data, scale = 1) {
  return new BearishMarubozu(scale).hasPattern(data);
}
//# sourceMappingURL=BearishMarubozu.js.map
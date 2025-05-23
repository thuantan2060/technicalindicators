"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bullishmarubozu = bullishmarubozu;
exports.default = void 0;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
class BullishMarubozu extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.name = 'BullishMarubozu';
    this.requiredCount = 1;
    this.scale = scale;
  }
  logic(data) {
    let daysOpen = data.open[0];
    let daysClose = data.close[0];
    let daysHigh = data.high[0];
    let daysLow = data.low[0];
    let isBullishMarbozu = this.approximateEqual(daysClose, daysHigh) && this.approximateEqual(daysLow, daysOpen) && daysOpen < daysClose && daysOpen < daysHigh;
    return isBullishMarbozu;
  }
}
exports.default = BullishMarubozu;
function bullishmarubozu(data, scale = 1) {
  return new BullishMarubozu(scale).hasPattern(data);
}
//# sourceMappingURL=BullishMarubozu.js.map
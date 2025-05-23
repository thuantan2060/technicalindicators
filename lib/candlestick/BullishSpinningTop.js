"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bullishspinningtop = bullishspinningtop;
exports.default = void 0;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
class BullishSpinningTop extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.name = 'BullishSpinningTop';
    this.requiredCount = 1;
    this.scale = scale;
  }
  logic(data) {
    let daysOpen = data.open[0];
    let daysClose = data.close[0];
    let daysHigh = data.high[0];
    let daysLow = data.low[0];
    let bodyLength = Math.abs(daysClose - daysOpen);
    let upperShadowLength = Math.abs(daysHigh - daysClose);
    let lowerShadowLength = Math.abs(daysOpen - daysLow);
    let isBullishSpinningTop = bodyLength < upperShadowLength && bodyLength < lowerShadowLength;
    return isBullishSpinningTop;
  }
}
exports.default = BullishSpinningTop;
function bullishspinningtop(data, scale = 1) {
  return new BullishSpinningTop(scale).hasPattern(data);
}
//# sourceMappingURL=BullishSpinningTop.js.map
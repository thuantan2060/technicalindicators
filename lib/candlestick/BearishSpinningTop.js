"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bearishspinningtop = bearishspinningtop;
exports.default = void 0;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
class BearishSpinningTop extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.name = 'BearishSpinningTop';
    this.requiredCount = 1;
    this.scale = scale;
  }
  logic(data) {
    let daysOpen = data.open[0];
    let daysClose = data.close[0];
    let daysHigh = data.high[0];
    let daysLow = data.low[0];
    let bodyLength = Math.abs(daysClose - daysOpen);
    let upperShadowLength = Math.abs(daysHigh - daysOpen);
    let lowerShadowLength = Math.abs(daysHigh - daysLow);
    let isBearishSpinningTop = bodyLength < upperShadowLength && bodyLength < lowerShadowLength;
    return isBearishSpinningTop;
  }
}
exports.default = BearishSpinningTop;
function bearishspinningtop(data, scale = 1) {
  return new BearishSpinningTop(scale).hasPattern(data);
}
//# sourceMappingURL=BearishSpinningTop.js.map
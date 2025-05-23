"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bearishhammerstick = bearishhammerstick;
exports.default = void 0;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
class BearishHammerStick extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.name = 'BearishHammerStick';
    this.requiredCount = 1;
    this.scale = scale;
  }
  logic(data) {
    let daysOpen = data.open[0];
    let daysClose = data.close[0];
    let daysHigh = data.high[0];
    let daysLow = data.low[0];
    let isBearishHammer = daysOpen > daysClose;
    isBearishHammer = isBearishHammer && this.approximateEqual(daysOpen, daysHigh);
    isBearishHammer = isBearishHammer && daysOpen - daysClose <= 2 * (daysClose - daysLow);
    return isBearishHammer;
  }
}
exports.default = BearishHammerStick;
function bearishhammerstick(data, scale = 1) {
  return new BearishHammerStick(scale).hasPattern(data);
}
//# sourceMappingURL=BearishHammerStick.js.map
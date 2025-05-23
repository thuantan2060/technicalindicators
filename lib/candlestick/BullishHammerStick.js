"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bullishhammerstick = bullishhammerstick;
exports.default = void 0;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
class BullishHammerStick extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.name = 'BullishHammerStick';
    this.requiredCount = 1;
    this.scale = scale;
  }
  logic(data) {
    let daysOpen = data.open[0];
    let daysClose = data.close[0];
    let daysHigh = data.high[0];
    let daysLow = data.low[0];
    let isBullishHammer = daysClose > daysOpen;
    isBullishHammer = isBullishHammer && this.approximateEqual(daysClose, daysHigh);
    isBullishHammer = isBullishHammer && 2 * (daysClose - daysOpen) <= daysOpen - daysLow;
    return isBullishHammer;
  }
}
exports.default = BullishHammerStick;
function bullishhammerstick(data, scale = 1) {
  return new BullishHammerStick(scale).hasPattern(data);
}
//# sourceMappingURL=BullishHammerStick.js.map
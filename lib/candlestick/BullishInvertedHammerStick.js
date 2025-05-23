"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bullishinvertedhammerstick = bullishinvertedhammerstick;
exports.default = void 0;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
class BullishInvertedHammerStick extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.name = 'BullishInvertedHammerStick';
    this.requiredCount = 1;
    this.scale = scale;
  }
  logic(data) {
    let daysOpen = data.open[0];
    let daysClose = data.close[0];
    let daysHigh = data.high[0];
    let daysLow = data.low[0];
    let isBullishInvertedHammer = daysClose > daysOpen;
    isBullishInvertedHammer = isBullishInvertedHammer && this.approximateEqual(daysOpen, daysLow);
    isBullishInvertedHammer = isBullishInvertedHammer && daysClose - daysOpen <= 2 * (daysHigh - daysClose);
    return isBullishInvertedHammer;
  }
}
exports.default = BullishInvertedHammerStick;
function bullishinvertedhammerstick(data, scale = 1) {
  return new BullishInvertedHammerStick(scale).hasPattern(data);
}
//# sourceMappingURL=BullishInvertedHammerStick.js.map
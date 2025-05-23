"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bearishinvertedhammerstick = bearishinvertedhammerstick;
exports.default = void 0;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
class BearishInvertedHammerStick extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.name = 'BearishInvertedHammerStick';
    this.requiredCount = 1;
    this.scale = scale;
  }
  logic(data) {
    let daysOpen = data.open[0];
    let daysClose = data.close[0];
    let daysHigh = data.high[0];
    let daysLow = data.low[0];
    let isBearishInvertedHammer = daysOpen > daysClose;
    isBearishInvertedHammer = isBearishInvertedHammer && this.approximateEqual(daysClose, daysLow);
    isBearishInvertedHammer = isBearishInvertedHammer && daysOpen - daysClose <= 2 * (daysHigh - daysOpen);
    return isBearishInvertedHammer;
  }
}
exports.default = BearishInvertedHammerStick;
function bearishinvertedhammerstick(data, scale = 1) {
  return new BearishInvertedHammerStick(scale).hasPattern(data);
}
//# sourceMappingURL=BearishInvertedHammerStick.js.map
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.shootingstar = shootingstar;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
var _AverageLoss = require("../Utils/AverageLoss");
var _AverageGain = require("../Utils/AverageGain");
var _BearishInvertedHammerStick = require("./BearishInvertedHammerStick");
var _BullishInvertedHammerStick = require("./BullishInvertedHammerStick");
class ShootingStar extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.name = 'ShootingStar';
    this.requiredCount = 5;
    this.scale = scale;
  }
  logic(data) {
    let isPattern = this.upwardTrend(data);
    isPattern = isPattern && this.includesHammer(data);
    isPattern = isPattern && this.hasConfirmation(data);
    return isPattern;
  }
  upwardTrend(data, confirm = true) {
    let end = confirm ? 3 : 4;
    // Analyze trends in closing prices of the first three or four candlesticks
    let gains = (0, _AverageGain.averagegain)({
      values: data.close.slice(0, end),
      period: end - 1
    });
    let losses = (0, _AverageLoss.averageloss)({
      values: data.close.slice(0, end),
      period: end - 1
    });
    // Upward trend, so more gains than losses
    return gains > losses;
  }
  includesHammer(data, confirm = true) {
    let start = confirm ? 3 : 4;
    let end = confirm ? 4 : undefined;
    let possibleHammerData = {
      open: data.open.slice(start, end),
      close: data.close.slice(start, end),
      low: data.low.slice(start, end),
      high: data.high.slice(start, end)
    };
    let isPattern = (0, _BearishInvertedHammerStick.bearishinvertedhammerstick)(possibleHammerData, this.scale);
    isPattern = isPattern || (0, _BullishInvertedHammerStick.bullishinvertedhammerstick)(possibleHammerData, this.scale);
    return isPattern;
  }
  hasConfirmation(data) {
    let possibleHammer = {
      open: data.open[3],
      close: data.close[3],
      low: data.low[3],
      high: data.high[3]
    };
    let possibleConfirmation = {
      open: data.open[4],
      close: data.close[4],
      low: data.low[4],
      high: data.high[4]
    };
    // Confirmation candlestick is bearish
    let isPattern = possibleConfirmation.open > possibleConfirmation.close;
    return isPattern && possibleHammer.close > possibleConfirmation.close;
  }
}
exports.default = ShootingStar;
function shootingstar(data, scale = 1) {
  return new ShootingStar(scale).hasPattern(data);
}
//# sourceMappingURL=ShootingStar.js.map
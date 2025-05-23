"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bullishharami = bullishharami;
exports.default = void 0;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
class BullishHarami extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.requiredCount = 2;
    this.name = "BullishHarami";
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
    let isBullishHaramiPattern = firstdaysOpen > seconddaysOpen && firstdaysClose <= seconddaysOpen && firstdaysClose < seconddaysClose && firstdaysOpen > seconddaysLow && firstdaysHigh > seconddaysHigh;
    return isBullishHaramiPattern;
  }
}
exports.default = BullishHarami;
function bullishharami(data, scale = 1) {
  return new BullishHarami(scale).hasPattern(data);
}
//# sourceMappingURL=BullishHarami.js.map
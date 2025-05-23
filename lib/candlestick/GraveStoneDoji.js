"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.gravestonedoji = gravestonedoji;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
class GraveStoneDoji extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.requiredCount = 1;
    this.name = 'GraveStoneDoji';
    this.scale = scale;
  }
  logic(data) {
    let daysOpen = data.open[0];
    let daysClose = data.close[0];
    let daysHigh = data.high[0];
    let daysLow = data.low[0];
    let isOpenEqualsClose = this.approximateEqual(daysOpen, daysClose);
    let isHighEqualsOpen = isOpenEqualsClose && this.approximateEqual(daysOpen, daysHigh);
    let isLowEqualsClose = isOpenEqualsClose && this.approximateEqual(daysClose, daysLow);
    return isOpenEqualsClose && isLowEqualsClose && !isHighEqualsOpen;
  }
}
exports.default = GraveStoneDoji;
function gravestonedoji(data, scale = 1) {
  return new GraveStoneDoji(scale).hasPattern(data);
}
//# sourceMappingURL=GraveStoneDoji.js.map
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.doji = doji;
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
class Doji extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.name = 'Doji';
    this.requiredCount = 1;
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
    return isOpenEqualsClose && isHighEqualsOpen == isLowEqualsClose;
  }
}
exports.default = Doji;
function doji(data, scale = 1) {
  return new Doji(scale).hasPattern(data);
}
//# sourceMappingURL=Doji.js.map
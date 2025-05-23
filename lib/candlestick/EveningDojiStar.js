"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.eveningdojistar = eveningdojistar;
var _Doji = _interopRequireDefault(require("./Doji"));
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
class EveningDojiStar extends _CandlestickFinder.default {
  constructor(scale = 1) {
    super();
    this.name = 'EveningDojiStar';
    this.requiredCount = 3;
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
    let thirddaysOpen = data.open[2];
    let thirddaysClose = data.close[2];
    let thirddaysHigh = data.high[2];
    let thirddaysLow = data.low[2];
    let firstdaysMidpoint = (firstdaysOpen + firstdaysClose) / 2;
    let isFirstBullish = firstdaysClose > firstdaysOpen;
    let dojiExists = new _Doji.default(this.scale).hasPattern({
      "open": [seconddaysOpen],
      "close": [seconddaysClose],
      "high": [seconddaysHigh],
      "low": [seconddaysLow]
    });
    let isThirdBearish = thirddaysOpen > thirddaysClose;
    let gapExists = seconddaysHigh > firstdaysHigh && seconddaysLow > firstdaysHigh && thirddaysOpen < seconddaysLow && seconddaysClose > thirddaysOpen;
    let doesCloseBelowFirstMidpoint = thirddaysClose < firstdaysMidpoint;
    return isFirstBullish && dojiExists && gapExists && isThirdBearish && doesCloseBelowFirstMidpoint;
  }
}
exports.default = EveningDojiStar;
function eveningdojistar(data, scale = 1) {
  return new EveningDojiStar(scale).hasPattern(data);
}
//# sourceMappingURL=EveningDojiStar.js.map
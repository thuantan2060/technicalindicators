"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bullish = bullish;
exports.default = void 0;
var _MorningStar = _interopRequireDefault(require("./MorningStar"));
var _BullishEngulfingPattern = _interopRequireDefault(require("./BullishEngulfingPattern"));
var _BullishHarami = _interopRequireDefault(require("./BullishHarami"));
var _BullishHaramiCross = _interopRequireDefault(require("./BullishHaramiCross"));
var _MorningDojiStar = _interopRequireDefault(require("./MorningDojiStar"));
var _DownsideTasukiGap = _interopRequireDefault(require("./DownsideTasukiGap"));
var _BullishMarubozu = _interopRequireDefault(require("./BullishMarubozu"));
var _PiercingLine = _interopRequireDefault(require("./PiercingLine"));
var _ThreeWhiteSoldiers = _interopRequireDefault(require("./ThreeWhiteSoldiers"));
var _BullishHammerStick = _interopRequireDefault(require("./BullishHammerStick"));
var _BullishInvertedHammerStick = _interopRequireDefault(require("./BullishInvertedHammerStick"));
var _HammerPattern = _interopRequireDefault(require("./HammerPattern"));
var _HammerPatternUnconfirmed = _interopRequireDefault(require("./HammerPatternUnconfirmed"));
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
var _TweezerBottom = _interopRequireDefault(require("./TweezerBottom"));
class BullishPatterns extends _CandlestickFinder.default {
  bullishPatterns;
  constructor(scale = 1) {
    super();
    this.name = 'Bullish Candlesticks';
    this.scale = scale;
    this.bullishPatterns = [new _BullishEngulfingPattern.default(scale), new _DownsideTasukiGap.default(scale), new _BullishHarami.default(scale), new _BullishHaramiCross.default(scale), new _MorningDojiStar.default(scale), new _MorningStar.default(scale), new _BullishMarubozu.default(scale), new _PiercingLine.default(scale), new _ThreeWhiteSoldiers.default(scale), new _BullishHammerStick.default(scale), new _BullishInvertedHammerStick.default(scale), new _HammerPattern.default(scale), new _HammerPatternUnconfirmed.default(scale), new _TweezerBottom.default(scale)];
  }
  hasPattern(data) {
    return this.bullishPatterns.reduce(function (state, pattern) {
      let result = pattern.hasPattern(data);
      return state || result;
    }, false);
  }
}
exports.default = BullishPatterns;
function bullish(data, scale = 1) {
  return new BullishPatterns(scale).hasPattern(data);
}
//# sourceMappingURL=Bullish.js.map
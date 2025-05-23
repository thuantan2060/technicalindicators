"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bearish = bearish;
exports.default = void 0;
var _BearishEngulfingPattern = _interopRequireDefault(require("./BearishEngulfingPattern"));
var _BearishHarami = _interopRequireDefault(require("./BearishHarami"));
var _BearishHaramiCross = _interopRequireDefault(require("./BearishHaramiCross"));
var _EveningDojiStar = _interopRequireDefault(require("./EveningDojiStar"));
var _EveningStar = _interopRequireDefault(require("./EveningStar"));
var _BearishMarubozu = _interopRequireDefault(require("./BearishMarubozu"));
var _ThreeBlackCrows = _interopRequireDefault(require("./ThreeBlackCrows"));
var _BearishHammerStick = _interopRequireDefault(require("./BearishHammerStick"));
var _BearishInvertedHammerStick = _interopRequireDefault(require("./BearishInvertedHammerStick"));
var _HangingMan = _interopRequireDefault(require("./HangingMan"));
var _HangingManUnconfirmed = _interopRequireDefault(require("./HangingManUnconfirmed"));
var _ShootingStar = _interopRequireDefault(require("./ShootingStar"));
var _ShootingStarUnconfirmed = _interopRequireDefault(require("./ShootingStarUnconfirmed"));
var _TweezerTop = _interopRequireDefault(require("./TweezerTop"));
var _CandlestickFinder = _interopRequireDefault(require("./CandlestickFinder"));
class BearishPatterns extends _CandlestickFinder.default {
  bearishPatterns;
  constructor(scale = 1) {
    super();
    this.name = 'Bearish Candlesticks';
    this.scale = scale;
    this.bearishPatterns = [new _BearishEngulfingPattern.default(scale), new _BearishHarami.default(scale), new _BearishHaramiCross.default(scale), new _EveningDojiStar.default(scale), new _EveningStar.default(scale), new _BearishMarubozu.default(scale), new _ThreeBlackCrows.default(scale), new _BearishHammerStick.default(scale), new _BearishInvertedHammerStick.default(scale), new _HangingMan.default(scale), new _HangingManUnconfirmed.default(scale), new _ShootingStar.default(scale), new _ShootingStarUnconfirmed.default(scale), new _TweezerTop.default(scale)];
  }
  hasPattern(data) {
    return this.bearishPatterns.reduce(function (state, pattern) {
      return state || pattern.hasPattern(data);
    }, false);
  }
}
exports.default = BearishPatterns;
function bearish(data, scale = 1) {
  return new BearishPatterns(scale).hasPattern(data);
}
//# sourceMappingURL=Bearish.js.map
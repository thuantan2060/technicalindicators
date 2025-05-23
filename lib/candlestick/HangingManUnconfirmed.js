"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.hangingmanunconfirmed = hangingmanunconfirmed;
var _HangingMan = _interopRequireDefault(require("./HangingMan"));
class HangingManUnconfirmed extends _HangingMan.default {
  constructor(scale = 1) {
    super(scale);
    this.name = 'HangingManUnconfirmed';
  }
  logic(data) {
    let isPattern = this.upwardTrend(data, false);
    isPattern = isPattern && this.includesHammer(data, false);
    return isPattern;
  }
}
exports.default = HangingManUnconfirmed;
function hangingmanunconfirmed(data, scale = 1) {
  return new HangingManUnconfirmed(scale).hasPattern(data);
}
//# sourceMappingURL=HangingManUnconfirmed.js.map
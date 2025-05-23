"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.hammerpatternunconfirmed = hammerpatternunconfirmed;
var _HammerPattern = _interopRequireDefault(require("./HammerPattern"));
class HammerPatternUnconfirmed extends _HammerPattern.default {
  constructor(scale = 1) {
    super(scale);
    this.name = 'HammerPatternUnconfirmed';
  }
  logic(data) {
    let isPattern = this.downwardTrend(data, false);
    isPattern = isPattern && this.includesHammer(data, false);
    return isPattern;
  }
}
exports.default = HammerPatternUnconfirmed;
function hammerpatternunconfirmed(data, scale = 1) {
  return new HammerPatternUnconfirmed(scale).hasPattern(data);
}
//# sourceMappingURL=HammerPatternUnconfirmed.js.map
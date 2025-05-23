"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.shootingstarunconfirmed = shootingstarunconfirmed;
var _ShootingStar = _interopRequireDefault(require("./ShootingStar"));
class ShootingStarUnconfirmed extends _ShootingStar.default {
  constructor(scale = 1) {
    super(scale);
    this.name = 'ShootingStarUnconfirmed';
  }
  logic(data) {
    let isPattern = this.upwardTrend(data, false);
    isPattern = isPattern && this.includesHammer(data, false);
    return isPattern;
  }
}
exports.default = ShootingStarUnconfirmed;
function shootingstarunconfirmed(data, scale = 1) {
  return new ShootingStarUnconfirmed(scale).hasPattern(data);
}
//# sourceMappingURL=ShootingStarUnconfirmed.js.map
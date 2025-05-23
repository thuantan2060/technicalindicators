"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
var _config = require("../config");
function format(v) {
  let precision = (0, _config.getConfig)('precision');
  if (precision) {
    return parseFloat(v.toPrecision(precision));
  }
  return v;
}
//# sourceMappingURL=NumberFormatter.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndicatorInput = exports.Indicator = exports.AllInputs = void 0;
var _NumberFormatter = require("../Utils/NumberFormatter");
class IndicatorInput {
  reversedInput;
  format;
}
exports.IndicatorInput = IndicatorInput;
class AllInputs {
  values;
  open;
  high;
  low;
  close;
  volume;
  timestamp;
}
exports.AllInputs = AllInputs;
class Indicator {
  result;
  format;
  constructor(input) {
    this.format = input.format || _NumberFormatter.format;
  }
  static reverseInputs(input) {
    if (input.reversedInput) {
      input.values ? input.values.reverse() : undefined;
      input.open ? input.open.reverse() : undefined;
      input.high ? input.high.reverse() : undefined;
      input.low ? input.low.reverse() : undefined;
      input.close ? input.close.reverse() : undefined;
      input.volume ? input.volume.reverse() : undefined;
      input.timestamp ? input.timestamp.reverse() : undefined;
    }
  }
  getResult() {
    return this.result;
  }
}
exports.Indicator = Indicator;
//# sourceMappingURL=indicator.js.map
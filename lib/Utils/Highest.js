"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HighestInput = exports.Highest = void 0;
exports.highest = highest;
var _indicator = require("../indicator/indicator");
var _FixedSizeLinkedList = _interopRequireDefault(require("./FixedSizeLinkedList"));
class HighestInput extends _indicator.IndicatorInput {
  values;
  period;
}
exports.HighestInput = HighestInput;
class Highest extends _indicator.Indicator {
  generator;
  constructor(input) {
    super(input);
    var values = input.values;
    var period = input.period;
    this.result = [];
    var periodList = new _FixedSizeLinkedList.default(period, true, false, false);
    this.generator = function* () {
      var result;
      var tick;
      var high;
      tick = yield;
      while (true) {
        periodList.push(tick);
        if (periodList.totalPushed >= period) {
          high = periodList.periodHigh;
        }
        tick = yield high;
      }
    }();
    this.generator.next();
    values.forEach((value, index) => {
      var result = this.generator.next(value);
      if (result.value != undefined) {
        this.result.push(result.value);
      }
    });
  }
  static calculate = highest;
  nextValue(price) {
    var result = this.generator.next(price);
    if (result.value != undefined) {
      return result.value;
    }
  }
}
exports.Highest = Highest;
function highest(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new Highest(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=Highest.js.map
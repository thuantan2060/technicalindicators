"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SumInput = exports.Sum = void 0;
exports.sum = sum;
var _indicator = require("../indicator/indicator");
var _FixedSizeLinkedList = _interopRequireDefault(require("./FixedSizeLinkedList"));
class SumInput extends _indicator.IndicatorInput {
  values;
  period;
}
exports.SumInput = SumInput;
class Sum extends _indicator.Indicator {
  generator;
  constructor(input) {
    super(input);
    var values = input.values;
    var period = input.period;
    this.result = [];
    var periodList = new _FixedSizeLinkedList.default(period, false, false, true);
    this.generator = function* () {
      var result;
      var tick;
      var high;
      tick = yield;
      while (true) {
        periodList.push(tick);
        if (periodList.totalPushed >= period) {
          high = periodList.periodSum;
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
  static calculate = sum;
  nextValue(price) {
    var result = this.generator.next(price);
    if (result.value != undefined) {
      return result.value;
    }
  }
}
exports.Sum = Sum;
function sum(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new Sum(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=Sum.js.map
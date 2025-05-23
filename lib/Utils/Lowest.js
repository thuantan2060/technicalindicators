"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LowestInput = exports.Lowest = void 0;
exports.lowest = lowest;
var _indicator = require("../indicator/indicator");
var _FixedSizeLinkedList = _interopRequireDefault(require("./FixedSizeLinkedList"));
class LowestInput extends _indicator.IndicatorInput {
  values;
  period;
}
exports.LowestInput = LowestInput;
class Lowest extends _indicator.Indicator {
  generator;
  constructor(input) {
    super(input);
    var values = input.values;
    var period = input.period;
    this.result = [];
    var periodList = new _FixedSizeLinkedList.default(period, false, true, false);
    this.generator = function* () {
      var result;
      var tick;
      var high;
      tick = yield;
      while (true) {
        periodList.push(tick);
        if (periodList.totalPushed >= period) {
          high = periodList.periodLow;
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
  static calculate = lowest;
  nextValue(price) {
    var result = this.generator.next(price);
    if (result.value != undefined) {
      return result.value;
    }
  }
}
exports.Lowest = Lowest;
function lowest(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new Lowest(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=Lowest.js.map
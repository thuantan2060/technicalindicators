"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ROCInput = exports.ROC = void 0;
exports.roc = roc;
var _indicator = require("../indicator/indicator");
var _FixedSizeLinkedList = _interopRequireDefault(require("../Utils/FixedSizeLinkedList"));
class ROCInput extends _indicator.IndicatorInput {
  period;
  values;
}
exports.ROCInput = ROCInput;
class ROC extends _indicator.Indicator {
  result;
  generator;
  constructor(input) {
    super(input);
    var period = input.period;
    var priceArray = input.values;
    this.result = [];
    this.generator = function* () {
      let index = 1;
      var pastPeriods = new _FixedSizeLinkedList.default(period);
      ;
      var tick = yield;
      var roc;
      while (true) {
        pastPeriods.push(tick);
        if (index < period) {
          index++;
        } else {
          roc = (tick - pastPeriods.lastShift) / pastPeriods.lastShift * 100;
        }
        tick = yield roc;
      }
    }();
    this.generator.next();
    priceArray.forEach(tick => {
      var result = this.generator.next(tick);
      if (result.value != undefined && !isNaN(result.value)) {
        this.result.push(this.format(result.value));
      }
    });
  }
  static calculate = roc;
  nextValue(price) {
    var nextResult = this.generator.next(price);
    if (nextResult.value != undefined && !isNaN(nextResult.value)) {
      return this.format(nextResult.value);
    }
  }
}
exports.ROC = ROC;
;
function roc(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new ROC(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=ROC.js.map
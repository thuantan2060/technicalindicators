"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SDInput = exports.SD = void 0;
exports.sd = sd;
var _indicator = require("../indicator/indicator");
var _SMA = require("../moving_averages/SMA");
var _FixedSizeLinkedList = _interopRequireDefault(require("../Utils/FixedSizeLinkedList"));
/**
 * Created by AAravindan on 5/7/16.
 */
"use strict";
class SDInput extends _indicator.IndicatorInput {
  period;
  values;
}
exports.SDInput = SDInput;
;
class SD extends _indicator.Indicator {
  generator;
  constructor(input) {
    super(input);
    var period = input.period;
    var priceArray = input.values;
    var sma = new _SMA.SMA({
      period: period,
      values: [],
      format: v => {
        return v;
      }
    });
    this.result = [];
    this.generator = function* () {
      var tick;
      var mean;
      var currentSet = new _FixedSizeLinkedList.default(period);
      ;
      tick = yield;
      var sd;
      while (true) {
        currentSet.push(tick);
        mean = sma.nextValue(tick);
        if (mean) {
          let sum = 0;
          for (let x of currentSet.iterator()) {
            sum = sum + Math.pow(x - mean, 2);
          }
          sd = Math.sqrt(sum / period);
        }
        tick = yield sd;
      }
    }();
    this.generator.next();
    priceArray.forEach(tick => {
      var result = this.generator.next(tick);
      if (result.value != undefined) {
        this.result.push(this.format(result.value));
      }
    });
  }
  static calculate = sd;
  nextValue(price) {
    var nextResult = this.generator.next(price);
    if (nextResult.value != undefined) return this.format(nextResult.value);
  }
}
exports.SD = SD;
function sd(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new SD(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=SD.js.map
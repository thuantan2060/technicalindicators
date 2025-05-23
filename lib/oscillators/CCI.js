"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CCIInput = exports.CCI = void 0;
exports.cci = cci;
var _indicator = require("../indicator/indicator");
var _SMA = require("../moving_averages/SMA");
var _FixedSizeLinkedList = _interopRequireDefault(require("../Utils/FixedSizeLinkedList"));
class CCIInput extends _indicator.IndicatorInput {
  high;
  low;
  close;
  period;
}
exports.CCIInput = CCIInput;
;
class CCI extends _indicator.Indicator {
  result;
  generator;
  constructor(input) {
    super(input);
    var lows = input.low;
    var highs = input.high;
    var closes = input.close;
    var period = input.period;
    var format = this.format;
    let constant = .015;
    var currentTpSet = new _FixedSizeLinkedList.default(period);
    ;
    var tpSMACalculator = new _SMA.SMA({
      period: period,
      values: [],
      format: v => {
        return v;
      }
    });
    if (!(lows.length === highs.length && highs.length === closes.length)) {
      throw 'Inputs(low,high, close) not of equal size';
    }
    this.result = [];
    this.generator = function* () {
      var tick = yield;
      while (true) {
        let tp = (tick.high + tick.low + tick.close) / 3;
        currentTpSet.push(tp);
        let smaTp = tpSMACalculator.nextValue(tp);
        let meanDeviation = null;
        let cci;
        let sum = 0;
        if (smaTp != undefined) {
          //First, subtract the most recent 20-period average of the typical price from each period's typical price. 
          //Second, take the absolute values of these numbers.
          //Third,sum the absolute values. 
          for (let x of currentTpSet.iterator()) {
            sum = sum + Math.abs(x - smaTp);
          }
          //Fourth, divide by the total number of periods (20). 
          meanDeviation = sum / period;
          cci = (tp - smaTp) / (constant * meanDeviation);
        }
        tick = yield cci;
      }
    }();
    this.generator.next();
    lows.forEach((tick, index) => {
      var result = this.generator.next({
        high: highs[index],
        low: lows[index],
        close: closes[index]
      });
      if (result.value != undefined) {
        this.result.push(result.value);
      }
    });
  }
  static calculate = cci;
  nextValue(price) {
    let result = this.generator.next(price).value;
    if (result != undefined) {
      return result;
    }
  }
}
exports.CCI = CCI;
function cci(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new CCI(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=CCI.js.map
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChandelierExitOutput = exports.ChandelierExitInput = exports.ChandelierExit = void 0;
exports.chandelierexit = chandelierexit;
var _indicator = require("../indicator/indicator");
var _ATR = require("../directionalmovement/ATR");
var _FixedSizeLinkedList = _interopRequireDefault(require("../Utils/FixedSizeLinkedList"));
class ChandelierExitInput extends _indicator.IndicatorInput {
  period = 22;
  multiplier = 3;
  high;
  low;
  close;
}
exports.ChandelierExitInput = ChandelierExitInput;
class ChandelierExitOutput extends _indicator.IndicatorInput {
  exitLong;
  exitShort;
}
exports.ChandelierExitOutput = ChandelierExitOutput;
;
class ChandelierExit extends _indicator.Indicator {
  generator;
  constructor(input) {
    super(input);
    var highs = input.high;
    var lows = input.low;
    var closes = input.close;
    this.result = [];
    var atrProducer = new _ATR.ATR({
      period: input.period,
      high: [],
      low: [],
      close: [],
      format: v => {
        return v;
      }
    });
    var dataCollector = new _FixedSizeLinkedList.default(input.period * 2, true, true, false);
    this.generator = function* () {
      var result;
      var tick = yield;
      var atr;
      while (true) {
        var {
          high,
          low
        } = tick;
        dataCollector.push(high);
        dataCollector.push(low);
        atr = atrProducer.nextValue(tick);
        if (dataCollector.totalPushed >= 2 * input.period && atr != undefined) {
          result = {
            exitLong: dataCollector.periodHigh - atr * input.multiplier,
            exitShort: dataCollector.periodLow + atr * input.multiplier
          };
        }
        tick = yield result;
      }
    }();
    this.generator.next();
    highs.forEach((tickHigh, index) => {
      var tickInput = {
        high: tickHigh,
        low: lows[index],
        close: closes[index]
      };
      var result = this.generator.next(tickInput);
      if (result.value != undefined) {
        this.result.push(result.value);
      }
    });
  }
  static calculate = chandelierexit;
  nextValue(price) {
    var result = this.generator.next(price);
    if (result.value != undefined) {
      return result.value;
    }
  }
}
exports.ChandelierExit = ChandelierExit;
function chandelierexit(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new ChandelierExit(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=ChandelierExit.js.map
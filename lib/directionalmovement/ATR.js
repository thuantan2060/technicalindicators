"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ATRInput = exports.ATR = void 0;
exports.atr = atr;
var _indicator = require("../indicator/indicator");
var _WEMA = require("../moving_averages/WEMA");
var _TrueRange = require("./TrueRange");
/**
 * Created by AAravindan on 5/8/16.
 */
"use strict";
class ATRInput extends _indicator.IndicatorInput {
  low;
  high;
  close;
  period;
}
exports.ATRInput = ATRInput;
;
class ATR extends _indicator.Indicator {
  result;
  generator;
  constructor(input) {
    super(input);
    var lows = input.low;
    var highs = input.high;
    var closes = input.close;
    var period = input.period;
    var format = this.format;
    if (!(lows.length === highs.length && highs.length === closes.length)) {
      throw 'Inputs(low,high, close) not of equal size';
    }
    var trueRange = new _TrueRange.TrueRange({
      low: [],
      high: [],
      close: []
    });
    var wema = new _WEMA.WEMA({
      period: period,
      values: [],
      format: v => {
        return v;
      }
    });
    this.result = [];
    this.generator = function* () {
      var tick = yield;
      var avgTrueRange, trange;
      ;
      while (true) {
        trange = trueRange.nextValue({
          low: tick.low,
          high: tick.high,
          close: tick.close
        });
        if (trange === undefined) {
          avgTrueRange = undefined;
        } else {
          avgTrueRange = wema.nextValue(trange);
        }
        tick = yield avgTrueRange;
      }
    }();
    this.generator.next();
    lows.forEach((tick, index) => {
      var result = this.generator.next({
        high: highs[index],
        low: lows[index],
        close: closes[index]
      });
      if (result.value !== undefined) {
        this.result.push(format(result.value));
      }
    });
  }
  static calculate = atr;
  nextValue(price) {
    return this.generator.next(price).value;
  }
}
exports.ATR = ATR;
function atr(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new ATR(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=ATR.js.map
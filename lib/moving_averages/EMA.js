"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EMA = void 0;
exports.ema = ema;
var _indicator = require("../indicator/indicator");
var _SMA = require("./SMA");
class EMA extends _indicator.Indicator {
  period;
  price;
  result;
  generator;
  constructor(input) {
    super(input);
    var period = input.period;
    var priceArray = input.values;
    var exponent = 2 / (period + 1);
    var sma;
    this.result = [];
    sma = new _SMA.SMA({
      period: period,
      values: []
    });
    var genFn = function* () {
      var tick = yield;
      var prevEma;
      while (true) {
        if (prevEma !== undefined && tick !== undefined) {
          prevEma = (tick - prevEma) * exponent + prevEma;
          tick = yield prevEma;
        } else {
          tick = yield;
          prevEma = sma.nextValue(tick);
          if (prevEma) tick = yield prevEma;
        }
      }
    };
    this.generator = genFn();
    this.generator.next();
    this.generator.next();
    priceArray.forEach(tick => {
      var result = this.generator.next(tick);
      if (result.value != undefined) {
        this.result.push(this.format(result.value));
      }
    });
  }
  static calculate = ema;
  nextValue(price) {
    var result = this.generator.next(price).value;
    if (result != undefined) return this.format(result);
  }
}
exports.EMA = EMA;
function ema(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new EMA(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
//# sourceMappingURL=EMA.js.map
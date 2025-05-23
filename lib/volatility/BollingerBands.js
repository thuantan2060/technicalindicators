"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BollingerBandsOutput = exports.BollingerBandsInput = exports.BollingerBands = void 0;
exports.bollingerbands = bollingerbands;
var _indicator = require("../indicator/indicator");
var _SMA = require("../moving_averages/SMA");
var _SD = require("../Utils/SD");
class BollingerBandsInput extends _indicator.IndicatorInput {
  period;
  stdDev;
  values;
}
exports.BollingerBandsInput = BollingerBandsInput;
;
class BollingerBandsOutput extends _indicator.IndicatorInput {
  middle;
  upper;
  lower;
  pb;
}
exports.BollingerBandsOutput = BollingerBandsOutput;
;
class BollingerBands extends _indicator.Indicator {
  generator;
  constructor(input) {
    super(input);
    var period = input.period;
    var priceArray = input.values;
    var stdDev = input.stdDev;
    var format = this.format;
    var sma, sd;
    this.result = [];
    sma = new _SMA.SMA({
      period: period,
      values: [],
      format: v => {
        return v;
      }
    });
    sd = new _SD.SD({
      period: period,
      values: [],
      format: v => {
        return v;
      }
    });
    this.generator = function* () {
      var result;
      var tick;
      var calcSMA;
      var calcsd;
      tick = yield;
      while (true) {
        calcSMA = sma.nextValue(tick);
        calcsd = sd.nextValue(tick);
        if (calcSMA) {
          let middle = format(calcSMA);
          let upper = format(calcSMA + calcsd * stdDev);
          let lower = format(calcSMA - calcsd * stdDev);
          let pb = format((tick - lower) / (upper - lower));
          result = {
            middle: middle,
            upper: upper,
            lower: lower,
            pb: pb
          };
        }
        tick = yield result;
      }
    }();
    this.generator.next();
    priceArray.forEach(tick => {
      var result = this.generator.next(tick);
      if (result.value != undefined) {
        this.result.push(result.value);
      }
    });
  }
  static calculate = bollingerbands;
  nextValue(price) {
    return this.generator.next(price).value;
  }
}
exports.BollingerBands = BollingerBands;
function bollingerbands(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new BollingerBands(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=BollingerBands.js.map
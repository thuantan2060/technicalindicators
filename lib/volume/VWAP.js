"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VWAPInput = exports.VWAP = void 0;
exports.vwap = vwap;
var _indicator = require("../indicator/indicator");
class VWAPInput extends _indicator.IndicatorInput {
  high;
  low;
  close;
  volume;
}
exports.VWAPInput = VWAPInput;
;
class VWAP extends _indicator.Indicator {
  result;
  generator;
  constructor(input) {
    super(input);
    var lows = input.low;
    var highs = input.high;
    var closes = input.close;
    var volumes = input.volume;
    var format = this.format;
    if (!(lows.length === highs.length && highs.length === closes.length)) {
      throw 'Inputs(low,high, close) not of equal size';
    }
    this.result = [];
    this.generator = function* () {
      var tick = yield;
      let cumulativeTotal = 0;
      let cumulativeVolume = 0;
      while (true) {
        let typicalPrice = (tick.high + tick.low + tick.close) / 3;
        let total = tick.volume * typicalPrice;
        cumulativeTotal = cumulativeTotal + total;
        cumulativeVolume = cumulativeVolume + tick.volume;
        tick = yield cumulativeTotal / cumulativeVolume;
        ;
      }
    }();
    this.generator.next();
    lows.forEach((tick, index) => {
      var result = this.generator.next({
        high: highs[index],
        low: lows[index],
        close: closes[index],
        volume: volumes[index]
      });
      if (result.value != undefined) {
        this.result.push(result.value);
      }
    });
  }
  static calculate = vwap;
  nextValue(price) {
    let result = this.generator.next(price).value;
    if (result != undefined) {
      return result;
    }
  }
}
exports.VWAP = VWAP;
function vwap(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new VWAP(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=VWAP.js.map
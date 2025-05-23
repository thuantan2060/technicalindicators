"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ForceIndexInput = exports.ForceIndex = void 0;
exports.forceindex = forceindex;
var _EMA = require("../moving_averages/EMA");
var _indicator = require("../indicator/indicator");
class ForceIndexInput extends _indicator.IndicatorInput {
  close;
  volume;
  period = 1;
}
exports.ForceIndexInput = ForceIndexInput;
;
class ForceIndex extends _indicator.Indicator {
  result;
  generator;
  constructor(input) {
    super(input);
    var closes = input.close;
    var volumes = input.volume;
    var period = input.period || 1;
    if (!(volumes.length === closes.length)) {
      throw 'Inputs(volume, close) not of equal size';
    }
    let emaForceIndex = new _EMA.EMA({
      values: [],
      period: period
    });
    this.result = [];
    this.generator = function* () {
      var previousTick = yield;
      var tick = yield;
      let forceIndex;
      while (true) {
        forceIndex = (tick.close - previousTick.close) * tick.volume;
        previousTick = tick;
        tick = yield emaForceIndex.nextValue(forceIndex);
      }
    }();
    this.generator.next();
    volumes.forEach((tick, index) => {
      var result = this.generator.next({
        close: closes[index],
        volume: volumes[index]
      });
      if (result.value != undefined) {
        this.result.push(result.value);
      }
    });
  }
  static calculate = forceindex;
  nextValue(price) {
    let result = this.generator.next(price).value;
    if (result != undefined) {
      return result;
    }
  }
}
exports.ForceIndex = ForceIndex;
function forceindex(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new ForceIndex(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=ForceIndex.js.map
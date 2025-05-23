"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ADLInput = exports.ADL = void 0;
exports.adl = adl;
var _indicator = require("../indicator/indicator");
/**
 * Created by AAravindan on 5/17/16.
 */

class ADLInput extends _indicator.IndicatorInput {
  high;
  low;
  close;
  volume;
}
exports.ADLInput = ADLInput;
class ADL extends _indicator.Indicator {
  generator;
  constructor(input) {
    super(input);
    var highs = input.high;
    var lows = input.low;
    var closes = input.close;
    var volumes = input.volume;
    if (!(lows.length === highs.length && highs.length === closes.length && highs.length === volumes.length)) {
      throw 'Inputs(low,high, close, volumes) not of equal size';
    }
    this.result = [];
    this.generator = function* () {
      var result = 0;
      var tick;
      tick = yield;
      while (true) {
        let moneyFlowMultiplier = (tick.close - tick.low - (tick.high - tick.close)) / (tick.high - tick.low);
        moneyFlowMultiplier = isNaN(moneyFlowMultiplier) ? 1 : moneyFlowMultiplier;
        let moneyFlowVolume = moneyFlowMultiplier * tick.volume;
        result = result + moneyFlowVolume;
        tick = yield Math.round(result);
      }
    }();
    this.generator.next();
    highs.forEach((tickHigh, index) => {
      var tickInput = {
        high: tickHigh,
        low: lows[index],
        close: closes[index],
        volume: volumes[index]
      };
      var result = this.generator.next(tickInput);
      if (result.value != undefined) {
        this.result.push(result.value);
      }
    });
  }
  static calculate = adl;
  nextValue(price) {
    return this.generator.next(price).value;
  }
}
exports.ADL = ADL;
function adl(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new ADL(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=ADL.js.map
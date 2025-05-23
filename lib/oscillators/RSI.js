"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RSIInput = exports.RSI = void 0;
exports.rsi = rsi;
var _indicator = require("../indicator/indicator");
var _AverageGain = require("../Utils/AverageGain");
var _AverageLoss = require("../Utils/AverageLoss");
/**
 * Created by AAravindan on 5/5/16.
 */

class RSIInput extends _indicator.IndicatorInput {
  period;
  values;
}
exports.RSIInput = RSIInput;
class RSI extends _indicator.Indicator {
  generator;
  constructor(input) {
    super(input);
    var period = input.period;
    var values = input.values;
    var GainProvider = new _AverageGain.AverageGain({
      period: period,
      values: []
    });
    var LossProvider = new _AverageLoss.AverageLoss({
      period: period,
      values: []
    });
    let count = 1;
    this.generator = function* (period) {
      var current = yield;
      var lastAvgGain, lastAvgLoss, RS, currentRSI;
      while (true) {
        lastAvgGain = GainProvider.nextValue(current);
        lastAvgLoss = LossProvider.nextValue(current);
        if (lastAvgGain !== undefined && lastAvgLoss !== undefined) {
          if (lastAvgLoss === 0) {
            currentRSI = 100;
          } else if (lastAvgGain === 0) {
            currentRSI = 0;
          } else {
            RS = lastAvgGain / lastAvgLoss;
            RS = isNaN(RS) ? 0 : RS;
            currentRSI = parseFloat((100 - 100 / (1 + RS)).toFixed(2));
          }
        }
        count++;
        current = yield currentRSI;
      }
    }(period);
    this.generator.next();
    this.result = [];
    values.forEach(tick => {
      var result = this.generator.next(tick);
      if (result.value !== undefined) {
        this.result.push(result.value);
      }
    });
  }
  static calculate = rsi;
  nextValue(price) {
    return this.generator.next(price).value;
  }
}
exports.RSI = RSI;
function rsi(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new RSI(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=RSI.js.map
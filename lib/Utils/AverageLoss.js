"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AvgLossInput = exports.AverageLoss = void 0;
exports.averageloss = averageloss;
var _indicator = require("../indicator/indicator");
class AvgLossInput extends _indicator.IndicatorInput {
  values;
  period;
}
exports.AvgLossInput = AvgLossInput;
class AverageLoss extends _indicator.Indicator {
  generator;
  constructor(input) {
    super(input);
    let values = input.values;
    let period = input.period;
    let format = this.format;
    this.generator = function* (period) {
      var currentValue = yield;
      var counter = 1;
      var lossSum = 0;
      var avgLoss;
      var loss;
      var lastValue = currentValue;
      currentValue = yield;
      while (true) {
        loss = lastValue - currentValue;
        loss = loss > 0 ? loss : 0;
        if (loss > 0) {
          lossSum = lossSum + loss;
        }
        if (counter < period) {
          counter++;
        } else if (avgLoss === undefined) {
          avgLoss = lossSum / period;
        } else {
          avgLoss = (avgLoss * (period - 1) + loss) / period;
        }
        lastValue = currentValue;
        avgLoss = avgLoss !== undefined ? format(avgLoss) : undefined;
        currentValue = yield avgLoss;
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
  static calculate = averageloss;
  nextValue(price) {
    return this.generator.next(price).value;
  }
}
exports.AverageLoss = AverageLoss;
function averageloss(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new AverageLoss(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=AverageLoss.js.map
/**
 * Created by AAravindan on 5/9/16.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TRIXInput = exports.TRIX = void 0;
exports.trix = trix;
var _ROC = require("./ROC.js");
var _EMA = require("../moving_averages/EMA.js");
var _indicator = require("../indicator/indicator");
class TRIXInput extends _indicator.IndicatorInput {
  values;
  period;
}
exports.TRIXInput = TRIXInput;
;
class TRIX extends _indicator.Indicator {
  result;
  generator;
  constructor(input) {
    super(input);
    let priceArray = input.values;
    let period = input.period;
    let format = this.format;
    let ema = new _EMA.EMA({
      period: period,
      values: [],
      format: v => {
        return v;
      }
    });
    let emaOfema = new _EMA.EMA({
      period: period,
      values: [],
      format: v => {
        return v;
      }
    });
    let emaOfemaOfema = new _EMA.EMA({
      period: period,
      values: [],
      format: v => {
        return v;
      }
    });
    let trixROC = new _ROC.ROC({
      period: 1,
      values: [],
      format: v => {
        return v;
      }
    });
    this.result = [];
    this.generator = function* () {
      let tick = yield;
      while (true) {
        let initialema = ema.nextValue(tick);
        let smoothedResult = initialema ? emaOfema.nextValue(initialema) : undefined;
        let doubleSmoothedResult = smoothedResult ? emaOfemaOfema.nextValue(smoothedResult) : undefined;
        let result = doubleSmoothedResult ? trixROC.nextValue(doubleSmoothedResult) : undefined;
        tick = yield result ? format(result) : undefined;
      }
    }();
    this.generator.next();
    priceArray.forEach(tick => {
      let result = this.generator.next(tick);
      if (result.value !== undefined) {
        this.result.push(result.value);
      }
    });
  }
  static calculate = trix;
  nextValue(price) {
    let nextResult = this.generator.next(price);
    if (nextResult.value !== undefined) return nextResult.value;
  }
}
exports.TRIX = TRIX;
function trix(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new TRIX(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=TRIX.js.map
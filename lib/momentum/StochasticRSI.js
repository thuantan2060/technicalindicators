"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StochasticRsiInput = exports.StochasticRSIOutput = exports.StochasticRSI = void 0;
exports.stochasticrsi = stochasticrsi;
var _indicator = require("../indicator/indicator");
var _SMA = require("../moving_averages/SMA");
var _RSI = require("../oscillators/RSI");
var _Stochastic = require("../momentum/Stochastic");
/**
 * Created by AAravindan on 5/10/16.
 */
"use strict";
class StochasticRsiInput extends _indicator.IndicatorInput {
  values;
  rsiPeriod;
  stochasticPeriod;
  kPeriod;
  dPeriod;
}
exports.StochasticRsiInput = StochasticRsiInput;
;
class StochasticRSIOutput {
  stochRSI;
  k;
  d;
}
exports.StochasticRSIOutput = StochasticRSIOutput;
;
class StochasticRSI extends _indicator.Indicator {
  result;
  generator;
  constructor(input) {
    super(input);
    let closes = input.values;
    let rsiPeriod = input.rsiPeriod;
    let stochasticPeriod = input.stochasticPeriod;
    let kPeriod = input.kPeriod;
    let dPeriod = input.dPeriod;
    let format = this.format;
    this.result = [];
    this.generator = function* () {
      let index = 1;
      let rsi = new _RSI.RSI({
        period: rsiPeriod,
        values: []
      });
      let stochastic = new _Stochastic.Stochastic({
        period: stochasticPeriod,
        high: [],
        low: [],
        close: [],
        signalPeriod: kPeriod
      });
      let dSma = new _SMA.SMA({
        period: dPeriod,
        values: [],
        format: v => {
          return v;
        }
      });
      let lastRSI, stochasticRSI, d, result;
      var tick = yield;
      while (true) {
        lastRSI = rsi.nextValue(tick);
        if (lastRSI !== undefined) {
          var stochasticInput = {
            high: lastRSI,
            low: lastRSI,
            close: lastRSI
          };
          stochasticRSI = stochastic.nextValue(stochasticInput);
          if (stochasticRSI !== undefined && stochasticRSI.d !== undefined) {
            d = dSma.nextValue(stochasticRSI.d);
            if (d !== undefined) result = {
              stochRSI: stochasticRSI.k,
              k: stochasticRSI.d,
              d: d
            };
          }
        }
        tick = yield result;
      }
    }();
    this.generator.next();
    closes.forEach((tick, index) => {
      var result = this.generator.next(tick);
      if (result.value !== undefined) {
        this.result.push(result.value);
      }
    });
  }
  static calculate = stochasticrsi;
  nextValue(input) {
    let nextResult = this.generator.next(input);
    if (nextResult.value !== undefined) return nextResult.value;
  }
}
exports.StochasticRSI = StochasticRSI;
function stochasticrsi(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new StochasticRSI(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=StochasticRSI.js.map
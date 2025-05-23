"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MACDOutput = exports.MACDInput = exports.MACD = void 0;
exports.macd = macd;
var _indicator = require("../indicator/indicator");
var _SMA = require("./SMA");
var _EMA = require("./EMA");
/**
 * Created by AAravindan on 5/4/16.
 */

class MACDInput extends _indicator.IndicatorInput {
  SimpleMAOscillator = true;
  SimpleMASignal = true;
  fastPeriod;
  slowPeriod;
  signalPeriod;
  constructor(values) {
    super();
    this.values = values;
  }
}
exports.MACDInput = MACDInput;
class MACDOutput {
  MACD;
  signal;
  histogram;
}
exports.MACDOutput = MACDOutput;
class MACD extends _indicator.Indicator {
  result;
  generator;
  constructor(input) {
    super(input);
    var oscillatorMAtype = input.SimpleMAOscillator ? _SMA.SMA : _EMA.EMA;
    var signalMAtype = input.SimpleMASignal ? _SMA.SMA : _EMA.EMA;
    var fastMAProducer = new oscillatorMAtype({
      period: input.fastPeriod,
      values: [],
      format: v => {
        return v;
      }
    });
    var slowMAProducer = new oscillatorMAtype({
      period: input.slowPeriod,
      values: [],
      format: v => {
        return v;
      }
    });
    var signalMAProducer = new signalMAtype({
      period: input.signalPeriod,
      values: [],
      format: v => {
        return v;
      }
    });
    var format = this.format;
    this.result = [];
    this.generator = function* () {
      var index = 0;
      var tick;
      var MACD, signal, histogram, fast, slow;
      while (true) {
        if (index < input.slowPeriod) {
          tick = yield;
          fast = fastMAProducer.nextValue(tick);
          slow = slowMAProducer.nextValue(tick);
          index++;
          continue;
        }
        if (fast && slow) {
          //Just for typescript to be happy
          MACD = fast - slow;
          signal = signalMAProducer.nextValue(MACD);
        }
        histogram = MACD - signal;
        tick = yield {
          //fast : fast,
          //slow : slow,
          MACD: format(MACD),
          signal: signal ? format(signal) : undefined,
          histogram: isNaN(histogram) ? undefined : format(histogram)
        };
        fast = fastMAProducer.nextValue(tick);
        slow = slowMAProducer.nextValue(tick);
      }
    }();
    this.generator.next();
    input.values.forEach(tick => {
      var result = this.generator.next(tick);
      if (result.value != undefined) {
        this.result.push(result.value);
      }
    });
  }
  static calculate = macd;
  nextValue(price) {
    var result = this.generator.next(price).value;
    return result;
  }
}
exports.MACD = MACD;
function macd(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new MACD(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=MACD.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeltnerChannelsOutput = exports.KeltnerChannelsInput = exports.KeltnerChannels = void 0;
exports.keltnerchannels = keltnerchannels;
var _indicator = require("../indicator/indicator");
var _SMA = require("../moving_averages/SMA");
var _EMA = require("../moving_averages/EMA");
var _ATR = require("../directionalmovement/ATR");
class KeltnerChannelsInput extends _indicator.IndicatorInput {
  maPeriod = 20;
  atrPeriod = 10;
  useSMA = false;
  multiplier = 1;
  high;
  low;
  close;
}
exports.KeltnerChannelsInput = KeltnerChannelsInput;
class KeltnerChannelsOutput extends _indicator.IndicatorInput {
  middle;
  upper;
  lower;
}
exports.KeltnerChannelsOutput = KeltnerChannelsOutput;
;
class KeltnerChannels extends _indicator.Indicator {
  result;
  generator;
  constructor(input) {
    super(input);
    var maType = input.useSMA ? _SMA.SMA : _EMA.EMA;
    var maProducer = new maType({
      period: input.maPeriod,
      values: [],
      format: v => {
        return v;
      }
    });
    var atrProducer = new _ATR.ATR({
      period: input.atrPeriod,
      high: [],
      low: [],
      close: [],
      format: v => {
        return v;
      }
    });
    var tick;
    this.result = [];
    this.generator = function* () {
      var KeltnerChannelsOutput;
      var result;
      tick = yield;
      while (true) {
        var {
          close
        } = tick;
        var ma = maProducer.nextValue(close);
        var atr = atrProducer.nextValue(tick);
        if (ma != undefined && atr != undefined) {
          result = {
            middle: ma,
            upper: ma + input.multiplier * atr,
            lower: ma - input.multiplier * atr
          };
        }
        tick = yield result;
      }
    }();
    this.generator.next();
    var highs = input.high;
    highs.forEach((tickHigh, index) => {
      var tickInput = {
        high: tickHigh,
        low: input.low[index],
        close: input.close[index]
      };
      var result = this.generator.next(tickInput);
      if (result.value != undefined) {
        this.result.push(result.value);
      }
    });
  }
  static calculate = keltnerchannels;
  nextValue(price) {
    var result = this.generator.next(price);
    if (result.value != undefined) {
      return result.value;
    }
  }
}
exports.KeltnerChannels = KeltnerChannels;
function keltnerchannels(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new KeltnerChannels(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=KeltnerChannels.js.map
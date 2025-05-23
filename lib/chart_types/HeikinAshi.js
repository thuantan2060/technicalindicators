"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeikinAshiInput = exports.HeikinAshi = void 0;
exports.heikinashi = heikinashi;
var _StockData = require("../StockData");
var _indicator = require("../indicator/indicator");
/**
 * Created by AAravindan on 5/4/16.
 */

class HeikinAshiInput extends _indicator.IndicatorInput {
  low;
  open;
  volume;
  high;
  close;
  timestamp;
}
exports.HeikinAshiInput = HeikinAshiInput;
class HeikinAshi extends _indicator.Indicator {
  result;
  generator;
  constructor(input) {
    super(input);
    var format = this.format;
    this.result = new _StockData.CandleList();
    let lastOpen = null;
    let lastHigh = 0;
    let lastLow = Infinity;
    let lastClose = 0;
    let lastVolume = 0;
    let lastTimestamp = 0;
    this.generator = function* () {
      let candleData = yield;
      let calculated = null;
      while (true) {
        if (lastOpen === null) {
          lastOpen = (candleData.close + candleData.open) / 2;
          lastHigh = candleData.high;
          lastLow = candleData.low;
          lastClose = (candleData.close + candleData.open + candleData.high + candleData.low) / 4;
          lastVolume = candleData.volume || 0;
          lastTimestamp = candleData.timestamp || 0;
          calculated = {
            open: lastOpen,
            high: lastHigh,
            low: lastLow,
            close: lastClose,
            volume: candleData.volume || 0,
            timestamp: candleData.timestamp || 0
          };
        } else {
          let newClose = (candleData.close + candleData.open + candleData.high + candleData.low) / 4;
          let newOpen = (lastOpen + lastClose) / 2;
          let newHigh = Math.max(newOpen, newClose, candleData.high);
          let newLow = Math.min(candleData.low, newOpen, newClose);
          calculated = {
            close: newClose,
            open: newOpen,
            high: newHigh,
            low: newLow,
            volume: candleData.volume || 0,
            timestamp: candleData.timestamp || 0
          };
          lastClose = newClose;
          lastOpen = newOpen;
          lastHigh = newHigh;
          lastLow = newLow;
        }
        candleData = yield calculated;
      }
    }();
    this.generator.next();
    input.low.forEach((tick, index) => {
      var result = this.generator.next({
        open: input.open[index],
        high: input.high[index],
        low: input.low[index],
        close: input.close[index],
        volume: input.volume ? input.volume[index] : input.volume,
        timestamp: input.timestamp ? input.timestamp[index] : input.timestamp
      });
      if (result.value) {
        this.result.open.push(result.value.open);
        this.result.high.push(result.value.high);
        this.result.low.push(result.value.low);
        this.result.close.push(result.value.close);
        this.result.volume.push(result.value.volume);
        this.result.timestamp.push(result.value.timestamp);
      }
    });
  }
  static calculate = heikinashi;
  nextValue(price) {
    var result = this.generator.next(price).value;
    return result;
  }
}
exports.HeikinAshi = HeikinAshi;
function heikinashi(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new HeikinAshi(input).result;
  if (input.reversedInput) {
    result.open.reverse();
    result.high.reverse();
    result.low.reverse();
    result.close.reverse();
    result.volume.reverse();
    result.timestamp.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=HeikinAshi.js.map
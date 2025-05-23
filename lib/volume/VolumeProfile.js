"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VolumeProfileOutput = exports.VolumeProfileInput = exports.VolumeProfile = void 0;
exports.priceFallsBetweenBarRange = priceFallsBetweenBarRange;
exports.volumeprofile = volumeprofile;
var _indicator = require("../indicator/indicator");
class VolumeProfileInput extends _indicator.IndicatorInput {
  high;
  open;
  low;
  close;
  volume;
  noOfBars;
}
exports.VolumeProfileInput = VolumeProfileInput;
class VolumeProfileOutput {
  rangeStart;
  rangeEnd;
  bullishVolume;
  bearishVolume;
}
exports.VolumeProfileOutput = VolumeProfileOutput;
function priceFallsBetweenBarRange(low, high, low1, high1) {
  return low <= low1 && high >= low1 || low1 <= low && high1 >= low;
}
class VolumeProfile extends _indicator.Indicator {
  generator;
  constructor(input) {
    super(input);
    var highs = input.high;
    var lows = input.low;
    var closes = input.close;
    var opens = input.open;
    var volumes = input.volume;
    var bars = input.noOfBars;
    if (!(lows.length === highs.length && highs.length === closes.length && highs.length === volumes.length)) {
      throw 'Inputs(low,high, close, volumes) not of equal size';
    }
    this.result = [];
    var max = Math.max(...highs, ...lows, ...closes, ...opens);
    var min = Math.min(...highs, ...lows, ...closes, ...opens);
    var barRange = (max - min) / bars;
    var lastEnd = min;
    for (let i = 0; i < bars; i++) {
      let rangeStart = lastEnd;
      let rangeEnd = rangeStart + barRange;
      lastEnd = rangeEnd;
      let bullishVolume = 0;
      let bearishVolume = 0;
      let totalVolume = 0;
      for (let priceBar = 0; priceBar < highs.length; priceBar++) {
        let priceBarStart = lows[priceBar];
        let priceBarEnd = highs[priceBar];
        let priceBarOpen = opens[priceBar];
        let priceBarClose = closes[priceBar];
        let priceBarVolume = volumes[priceBar];
        if (priceFallsBetweenBarRange(rangeStart, rangeEnd, priceBarStart, priceBarEnd)) {
          totalVolume = totalVolume + priceBarVolume;
          if (priceBarOpen > priceBarClose) {
            bearishVolume = bearishVolume + priceBarVolume;
          } else {
            bullishVolume = bullishVolume + priceBarVolume;
          }
        }
      }
      this.result.push({
        rangeStart,
        rangeEnd,
        bullishVolume,
        bearishVolume,
        totalVolume
      });
    }
  }
  static calculate = volumeprofile;
  nextValue(price) {
    throw 'Next value not supported for volume profile';
  }
}
exports.VolumeProfile = VolumeProfile;
function volumeprofile(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new VolumeProfile(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=VolumeProfile.js.map
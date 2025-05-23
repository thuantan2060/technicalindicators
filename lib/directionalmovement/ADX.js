"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ADXOutput = exports.ADXInput = exports.ADX = void 0;
exports.adx = adx;
var _WilderSmoothing = require("../moving_averages/WilderSmoothing");
var _indicator = require("../indicator/indicator");
var _MinusDM = require("./MinusDM");
var _PlusDM = require("./PlusDM");
var _TrueRange = require("./TrueRange");
var _WEMA = require("../moving_averages/WEMA");
class ADXInput extends _indicator.IndicatorInput {
  high;
  low;
  close;
  period;
}
exports.ADXInput = ADXInput;
;
class ADXOutput extends _indicator.IndicatorInput {
  adx;
  pdi;
  mdi;
}
exports.ADXOutput = ADXOutput;
;
class ADX extends _indicator.Indicator {
  result;
  generator;
  constructor(input) {
    super(input);
    var lows = input.low;
    var highs = input.high;
    var closes = input.close;
    var period = input.period;
    var format = this.format;
    var plusDM = new _PlusDM.PDM({
      high: [],
      low: []
    });
    var minusDM = new _MinusDM.MDM({
      high: [],
      low: []
    });
    var emaPDM = new _WilderSmoothing.WilderSmoothing({
      period: period,
      values: [],
      format: v => {
        return v;
      }
    });
    var emaMDM = new _WilderSmoothing.WilderSmoothing({
      period: period,
      values: [],
      format: v => {
        return v;
      }
    });
    var emaTR = new _WilderSmoothing.WilderSmoothing({
      period: period,
      values: [],
      format: v => {
        return v;
      }
    });
    var emaDX = new _WEMA.WEMA({
      period: period,
      values: [],
      format: v => {
        return v;
      }
    });
    var tr = new _TrueRange.TrueRange({
      low: [],
      high: [],
      close: []
    });
    if (!(lows.length === highs.length && highs.length === closes.length)) {
      throw 'Inputs(low,high, close) not of equal size';
    }
    this.result = [];
    ADXOutput;
    this.generator = function* () {
      var tick = yield;
      var index = 0;
      var lastATR, lastAPDM, lastAMDM, lastPDI, lastMDI, lastDX, smoothedDX;
      lastATR = 0;
      lastAPDM = 0;
      lastAMDM = 0;
      while (true) {
        let calcTr = tr.nextValue(tick);
        let calcPDM = plusDM.nextValue(tick);
        let calcMDM = minusDM.nextValue(tick);
        if (calcTr === undefined) {
          tick = yield;
          continue;
        }
        let lastATR = emaTR.nextValue(calcTr);
        let lastAPDM = emaPDM.nextValue(calcPDM);
        let lastAMDM = emaMDM.nextValue(calcMDM);
        if (lastATR != undefined && lastAPDM != undefined && lastAMDM != undefined) {
          lastPDI = lastAPDM * 100 / lastATR;
          lastMDI = lastAMDM * 100 / lastATR;
          let diDiff = Math.abs(lastPDI - lastMDI);
          let diSum = lastPDI + lastMDI;
          lastDX = diDiff / diSum * 100;
          smoothedDX = emaDX.nextValue(lastDX);
          // console.log(tick.high.toFixed(2), tick.low.toFixed(2), tick.close.toFixed(2) , calcTr.toFixed(2), calcPDM.toFixed(2), calcMDM.toFixed(2), lastATR.toFixed(2), lastAPDM.toFixed(2), lastAMDM.toFixed(2), lastPDI.toFixed(2), lastMDI.toFixed(2), diDiff.toFixed(2), diSum.toFixed(2), lastDX.toFixed(2));
        }
        tick = yield {
          adx: smoothedDX,
          pdi: lastPDI,
          mdi: lastMDI
        };
      }
    }();
    this.generator.next();
    lows.forEach((tick, index) => {
      var result = this.generator.next({
        high: highs[index],
        low: lows[index],
        close: closes[index]
      });
      if (result.value != undefined && result.value.adx != undefined) {
        this.result.push({
          adx: format(result.value.adx),
          pdi: format(result.value.pdi),
          mdi: format(result.value.mdi)
        });
      }
    });
  }
  static calculate = adx;
  nextValue(price) {
    let result = this.generator.next(price).value;
    if (result != undefined && result.adx != undefined) {
      return {
        adx: this.format(result.adx),
        pdi: this.format(result.pdi),
        mdi: this.format(result.mdi)
      };
    }
  }
}
exports.ADX = ADX;
function adx(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new ADX(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=ADX.js.map
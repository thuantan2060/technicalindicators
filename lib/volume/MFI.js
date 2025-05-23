"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MFIInput = exports.MFI = void 0;
exports.mfi = mfi;
var _indicator = require("../indicator/indicator");
var _TypicalPrice = require("../chart_types/TypicalPrice");
var _FixedSizeLinkedList = _interopRequireDefault(require("../Utils/FixedSizeLinkedList"));
/**
 * Created by AAravindan on 5/17/16.
 */

class MFIInput extends _indicator.IndicatorInput {
  high;
  low;
  close;
  volume;
  period;
}
exports.MFIInput = MFIInput;
class MFI extends _indicator.Indicator {
  generator;
  constructor(input) {
    super(input);
    var highs = input.high;
    var lows = input.low;
    var closes = input.close;
    var volumes = input.volume;
    var period = input.period;
    var typicalPrice = new _TypicalPrice.TypicalPrice({
      low: [],
      high: [],
      close: []
    });
    var positiveFlow = new _FixedSizeLinkedList.default(period, false, false, true);
    var negativeFlow = new _FixedSizeLinkedList.default(period, false, false, true);
    if (!(lows.length === highs.length && highs.length === closes.length && highs.length === volumes.length)) {
      throw 'Inputs(low,high, close, volumes) not of equal size';
    }
    this.result = [];
    this.generator = function* () {
      var result;
      var tick;
      var lastClose;
      var positiveFlowForPeriod;
      var rawMoneyFlow = 0;
      var moneyFlowRatio;
      var negativeFlowForPeriod;
      let typicalPriceValue = null;
      let prevousTypicalPrice = null;
      tick = yield;
      lastClose = tick.close; //Fist value 
      tick = yield;
      while (true) {
        var {
          high,
          low,
          close,
          volume
        } = tick;
        var positionMoney = 0;
        var negativeMoney = 0;
        typicalPriceValue = typicalPrice.nextValue({
          high,
          low,
          close
        });
        rawMoneyFlow = typicalPriceValue * volume;
        if (typicalPriceValue != null && prevousTypicalPrice != null) {
          typicalPriceValue > prevousTypicalPrice ? positionMoney = rawMoneyFlow : negativeMoney = rawMoneyFlow;
          positiveFlow.push(positionMoney);
          negativeFlow.push(negativeMoney);
          positiveFlowForPeriod = positiveFlow.periodSum;
          negativeFlowForPeriod = negativeFlow.periodSum;
          if (positiveFlow.totalPushed >= period && positiveFlow.totalPushed >= period) {
            moneyFlowRatio = positiveFlowForPeriod / negativeFlowForPeriod;
            result = 100 - 100 / (1 + moneyFlowRatio);
          }
        }
        prevousTypicalPrice = typicalPriceValue;
        tick = yield result;
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
        this.result.push(parseFloat(result.value.toFixed(2)));
      }
    });
  }
  static calculate = mfi;
  nextValue(price) {
    var result = this.generator.next(price);
    if (result.value != undefined) {
      return parseFloat(result.value.toFixed(2));
    }
  }
}
exports.MFI = MFI;
function mfi(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new MFI(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=MFI.js.map
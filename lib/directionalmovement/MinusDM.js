"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MDMInput = exports.MDM = void 0;
var _indicator = require("../indicator/indicator");
/**
 * Created by AAravindan on 5/8/16.
 */
"use strict";
class MDMInput extends _indicator.IndicatorInput {
  low;
  high;
}
exports.MDMInput = MDMInput;
;
class MDM extends _indicator.Indicator {
  result;
  generator;
  constructor(input) {
    super(input);
    var lows = input.low;
    var highs = input.high;
    var format = this.format;
    if (lows.length != highs.length) {
      throw 'Inputs(low,high) not of equal size';
    }
    this.result = [];
    this.generator = function* () {
      var minusDm;
      var current = yield;
      var last;
      while (true) {
        if (last) {
          let upMove = current.high - last.high;
          let downMove = last.low - current.low;
          minusDm = format(downMove > upMove && downMove > 0 ? downMove : 0);
        }
        last = current;
        current = yield minusDm;
      }
    }();
    this.generator.next();
    lows.forEach((tick, index) => {
      var result = this.generator.next({
        high: highs[index],
        low: lows[index]
      });
      if (result.value !== undefined) this.result.push(result.value);
    });
  }
  static calculate(input) {
    _indicator.Indicator.reverseInputs(input);
    var result = new MDM(input).result;
    if (input.reversedInput) {
      result.reverse();
    }
    _indicator.Indicator.reverseInputs(input);
    return result;
  }
  nextValue(price) {
    return this.generator.next(price).value;
  }
}
exports.MDM = MDM;
//# sourceMappingURL=MinusDM.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypicalPriceInput = exports.TypicalPrice = void 0;
exports.typicalprice = typicalprice;
var _indicator = require("../indicator/indicator");
/**
 * Created by AAravindan on 5/4/16.
 */

class TypicalPriceInput extends _indicator.IndicatorInput {
  low;
  high;
  close;
}
exports.TypicalPriceInput = TypicalPriceInput;
class TypicalPrice extends _indicator.Indicator {
  result = [];
  generator;
  constructor(input) {
    super(input);
    this.generator = function* () {
      let priceInput = yield;
      while (true) {
        priceInput = yield (priceInput.high + priceInput.low + priceInput.close) / 3;
      }
    }();
    this.generator.next();
    input.low.forEach((tick, index) => {
      var result = this.generator.next({
        high: input.high[index],
        low: input.low[index],
        close: input.close[index]
      });
      this.result.push(result.value);
    });
  }
  static calculate = typicalprice;
  nextValue(price) {
    var result = this.generator.next(price).value;
    return result;
  }
}
exports.TypicalPrice = TypicalPrice;
function typicalprice(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new TypicalPrice(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=TypicalPrice.js.map
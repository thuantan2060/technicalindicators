"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WMA = void 0;
exports.wma = wma;
var _indicator = require("../indicator/indicator");
var _LinkedList = require("../Utils/LinkedList");
class WMA extends _indicator.Indicator {
  period;
  price;
  result;
  generator;
  constructor(input) {
    super(input);
    var period = input.period;
    var priceArray = input.values;
    this.result = [];
    this.generator = function* () {
      let data = new _LinkedList.LinkedList();
      let denominator = period * (period + 1) / 2;
      while (true) {
        if (data.length < period) {
          data.push(yield);
        } else {
          data.resetCursor();
          let result = 0;
          for (let i = 1; i <= period; i++) {
            result = result + data.next() * i / denominator;
          }
          var next = yield result;
          data.shift();
          data.push(next);
        }
      }
    }();
    this.generator.next();
    priceArray.forEach((tick, index) => {
      var result = this.generator.next(tick);
      if (result.value != undefined) {
        this.result.push(this.format(result.value));
      }
    });
  }
  static calculate = wma;

  //STEP 5. REMOVE GET RESULT FUNCTION
  nextValue(price) {
    var result = this.generator.next(price).value;
    if (result != undefined) return this.format(result);
  }
}
exports.WMA = WMA;
;
function wma(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new WMA(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
//# sourceMappingURL=WMA.js.map
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WilderSmoothing = void 0;
exports.wildersmoothing = wildersmoothing;
var _indicator = require("../indicator/indicator");
var _LinkedList = require("../Utils/LinkedList");
//STEP3. Add class based syntax with export
class WilderSmoothing extends _indicator.Indicator {
  period;
  price;
  result;
  generator;
  constructor(input) {
    super(input);
    this.period = input.period;
    this.price = input.values;
    var genFn = function* (period) {
      var list = new _LinkedList.LinkedList();
      var sum = 0;
      var counter = 1;
      var current = yield;
      var result = 0;
      while (true) {
        if (counter < period) {
          counter++;
          sum = sum + current;
          result = undefined;
        } else if (counter == period) {
          counter++;
          sum = sum + current;
          result = sum;
        } else {
          result = result - result / period + current;
        }
        current = yield result;
      }
    };
    this.generator = genFn(this.period);
    this.generator.next();
    this.result = [];
    this.price.forEach(tick => {
      var result = this.generator.next(tick);
      if (result.value != undefined) {
        this.result.push(this.format(result.value));
      }
    });
  }
  static calculate = wildersmoothing;
  nextValue(price) {
    var result = this.generator.next(price).value;
    if (result != undefined) return this.format(result);
  }
}
exports.WilderSmoothing = WilderSmoothing;
function wildersmoothing(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new WilderSmoothing(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;

//STEP 6. Run the tests
//# sourceMappingURL=WilderSmoothing.js.map
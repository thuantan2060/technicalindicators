"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SMA = exports.MAInput = void 0;
exports.sma = sma;
var _indicator = require("../indicator/indicator");
var _LinkedList = require("../Utils/LinkedList");
//STEP 1. Import Necessary indicator or rather last step

//STEP 2. Create the input for the indicator, mandatory should be in the constructor
class MAInput extends _indicator.IndicatorInput {
  constructor(period, values) {
    super();
    this.period = period;
    this.values = values;
  }
}

//STEP3. Add class based syntax with export
exports.MAInput = MAInput;
class SMA extends _indicator.Indicator {
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
      var result;
      list.push(0);
      while (true) {
        if (counter < period) {
          counter++;
          list.push(current);
          sum = sum + current;
        } else {
          sum = sum - list.shift() + current;
          result = sum / period;
          list.push(current);
        }
        current = yield result;
      }
    };
    this.generator = genFn(this.period);
    this.generator.next();
    this.result = [];
    this.price.forEach(tick => {
      var result = this.generator.next(tick);
      if (result.value !== undefined) {
        this.result.push(this.format(result.value));
      }
    });
  }
  static calculate = sma;
  nextValue(price) {
    var result = this.generator.next(price).value;
    if (result != undefined) return this.format(result);
  }
}
exports.SMA = SMA;
function sma(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new SMA(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;

//STEP 6. Run the tests
//# sourceMappingURL=SMA.js.map
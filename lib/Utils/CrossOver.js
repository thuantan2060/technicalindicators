"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CrossOver = exports.CrossInput = void 0;
exports.crossOver = crossOver;
var _indicator = require("../indicator/indicator");
var _CrossUp = require("./CrossUp");
var _CrossDown = require("./CrossDown");
class CrossInput extends _indicator.IndicatorInput {
  constructor(lineA, lineB) {
    super();
    this.lineA = lineA;
    this.lineB = lineB;
  }
}
exports.CrossInput = CrossInput;
class CrossOver extends _indicator.Indicator {
  generator;
  result;
  constructor(input) {
    super(input);
    var crossUp = new _CrossUp.CrossUp({
      lineA: input.lineA,
      lineB: input.lineB
    });
    var crossDown = new _CrossDown.CrossDown({
      lineA: input.lineA,
      lineB: input.lineB
    });
    const genFn = function* () {
      var current = yield;
      var result = false;
      var first = true;
      while (true) {
        var nextUp = crossUp.nextValue(current.valueA, current.valueB);
        var nextDown = crossDown.nextValue(current.valueA, current.valueB);
        result = nextUp || nextDown;
        if (first) result = false;
        first = false;
        current = yield result;
      }
    };
    this.generator = genFn();
    this.generator.next();
    var resultA = crossUp.getResult();
    var resultB = crossDown.getResult();
    this.result = resultA.map((a, index) => {
      if (index === 0) return false;
      return !!(a || resultB[index]);
    });
  }
  static calculate = crossOver;
  static reverseInputs(input) {
    if (input.reversedInput) {
      input.lineA ? input.lineA.reverse() : undefined;
      input.lineB ? input.lineB.reverse() : undefined;
    }
  }
  nextValue(valueA, valueB) {
    return this.generator.next({
      valueA: valueA,
      valueB: valueB
    }).value;
  }
}
exports.CrossOver = CrossOver;
function crossOver(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new CrossOver(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
//# sourceMappingURL=CrossOver.js.map
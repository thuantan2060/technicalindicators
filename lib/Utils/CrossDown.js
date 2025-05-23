"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CrossInput = exports.CrossDown = void 0;
exports.crossDown = crossDown;
var _indicator = require("../indicator/indicator");
class CrossInput extends _indicator.IndicatorInput {
  constructor(lineA, lineB) {
    super();
    this.lineA = lineA;
    this.lineB = lineB;
  }
}
exports.CrossInput = CrossInput;
class CrossDown extends _indicator.Indicator {
  lineA;
  lineB;
  result;
  generator;
  constructor(input) {
    super(input);
    this.lineA = input.lineA;
    this.lineB = input.lineB;
    var currentLineA = [];
    var currentLineB = [];
    const genFn = function* () {
      var current = yield;
      var result = false;
      while (true) {
        currentLineA.unshift(current.valueA);
        currentLineB.unshift(current.valueB);
        result = current.valueA < current.valueB;
        var pointer = 1;
        while (result === true && currentLineA[pointer] <= currentLineB[pointer]) {
          if (currentLineA[pointer] < currentLineB[pointer]) {
            result = false;
          } else if (currentLineA[pointer] > currentLineB[pointer]) {
            result = true;
          } else if (currentLineA[pointer] === currentLineB[pointer]) {
            pointer += 1;
          }
        }
        if (result === true) {
          currentLineA = [current.valueA];
          currentLineB = [current.valueB];
        }
        current = yield result;
      }
    };
    this.generator = genFn();
    this.generator.next();
    this.result = [];
    this.lineA.forEach((value, index) => {
      var result = this.generator.next({
        valueA: this.lineA[index],
        valueB: this.lineB[index]
      });
      if (result.value !== undefined) {
        this.result.push(result.value);
      }
    });
  }
  static calculate = crossDown;
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
exports.CrossDown = CrossDown;
function crossDown(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new CrossDown(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
//# sourceMappingURL=CrossDown.js.map
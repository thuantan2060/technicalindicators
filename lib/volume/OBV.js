"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OBVInput = exports.OBV = void 0;
exports.obv = obv;
var _indicator = require("../indicator/indicator");
/**
 * Created by AAravindan on 5/17/16.
 */
"use strict";
class OBVInput extends _indicator.IndicatorInput {
  close;
  volume;
}
exports.OBVInput = OBVInput;
class OBV extends _indicator.Indicator {
  generator;
  constructor(input) {
    super(input);
    var closes = input.close;
    var volumes = input.volume;
    this.result = [];
    this.generator = function* () {
      var result = 0;
      var tick;
      var lastClose;
      tick = yield;
      if (tick.close && typeof tick.close === 'number') {
        lastClose = tick.close;
        tick = yield;
      }
      while (true) {
        if (lastClose < tick.close) {
          result = result + tick.volume;
        } else if (tick.close < lastClose) {
          result = result - tick.volume;
        }
        lastClose = tick.close;
        tick = yield result;
      }
    }();
    this.generator.next();
    closes.forEach((close, index) => {
      let tickInput = {
        close: closes[index],
        volume: volumes[index]
      };
      let result = this.generator.next(tickInput);
      if (result.value != undefined) {
        this.result.push(result.value);
      }
    });
  }
  static calculate = obv;
  nextValue(price) {
    return this.generator.next(price).value;
  }
}
exports.OBV = OBV;
function obv(input) {
  _indicator.Indicator.reverseInputs(input);
  var result = new OBV(input).result;
  if (input.reversedInput) {
    result.reverse();
  }
  _indicator.Indicator.reverseInputs(input);
  return result;
}
;
//# sourceMappingURL=OBV.js.map
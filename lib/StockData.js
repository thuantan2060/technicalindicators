"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CandleList = exports.CandleData = void 0;
class StockData {
  reversedInput;
  constructor(open, high, low, close, reversedInput) {
    this.open = open;
    this.high = high;
    this.low = low;
    this.close = close;
    this.reversedInput = reversedInput;
  }
}
exports.default = StockData;
class CandleData {
  open;
  high;
  low;
  close;
  timestamp;
  volume;
}
exports.CandleData = CandleData;
class CandleList {
  open = [];
  high = [];
  low = [];
  close = [];
  volume = [];
  timestamp = [];
}
exports.CandleList = CandleList;
//# sourceMappingURL=StockData.js.map
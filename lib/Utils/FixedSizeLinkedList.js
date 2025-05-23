"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _LinkedList = require("./LinkedList");
/**
 * Created by AAravindan on 5/7/16.
 */

class FixedSizeLinkedList extends _LinkedList.LinkedList {
  totalPushed = 0;
  periodHigh = 0;
  periodLow = Infinity;
  periodSum = 0;
  lastShift;
  _push;
  constructor(size, maintainHigh, maintainLow, maintainSum) {
    super();
    this.size = size;
    this.maintainHigh = maintainHigh;
    this.maintainLow = maintainLow;
    this.maintainSum = maintainSum;
    if (!size || typeof size !== 'number') {
      throw 'Size required and should be a number.';
    }
    this._push = this.push;
    this.push = function (data) {
      this.add(data);
      this.totalPushed++;
    };
  }
  add(data) {
    if (this.length === this.size) {
      this.lastShift = this.shift();
      this._push(data);
      //TODO: FInd a better way
      if (this.maintainHigh) if (this.lastShift == this.periodHigh) this.calculatePeriodHigh();
      if (this.maintainLow) if (this.lastShift == this.periodLow) this.calculatePeriodLow();
      if (this.maintainSum) {
        this.periodSum = this.periodSum - this.lastShift;
      }
    } else {
      this._push(data);
    }
    //TODO: FInd a better way
    if (this.maintainHigh) if (this.periodHigh <= data) this.periodHigh = data;
    if (this.maintainLow) if (this.periodLow >= data) this.periodLow = data;
    if (this.maintainSum) {
      this.periodSum = this.periodSum + data;
    }
  }
  *iterator() {
    this.resetCursor();
    while (this.next()) {
      yield this.current;
    }
  }
  calculatePeriodHigh() {
    this.resetCursor();
    if (this.next()) this.periodHigh = this.current;
    while (this.next()) {
      if (this.periodHigh <= this.current) {
        this.periodHigh = this.current;
      }
      ;
    }
    ;
  }
  calculatePeriodLow() {
    this.resetCursor();
    if (this.next()) this.periodLow = this.current;
    while (this.next()) {
      if (this.periodLow >= this.current) {
        this.periodLow = this.current;
      }
      ;
    }
    ;
  }
}
exports.default = FixedSizeLinkedList;
//# sourceMappingURL=FixedSizeLinkedList.js.map
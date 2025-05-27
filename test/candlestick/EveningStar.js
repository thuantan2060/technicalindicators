var EveningStar = require('../../lib/candlestick/EveningStar').default;
var assert = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs                      = require('fs');

// Valid Evening Star pattern:
// Day 1 (index 2): Large bullish candle
// Day 2 (index 1): Small star with gap up
// Day 3 (index 0): Bearish candle with gap down, closes below day 1 midpoint
var input = {
  open: [22.50, 24.20, 20.00],  // [day3, day2, day1] - gaps and progression
  high: [23.00, 24.50, 23.80],
  close: [21.20, 24.30, 23.50],  // day1 midpoint = 21.75, day3 closes below it
  low: [20.80, 24.00, 20.00]
}

describe('EveningStar : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(input);
    fs.writeFileSync(__dirname+'/images/EveningStar.svg',imageBuffer);
  });
  it('Check whether the supplied data has EveningStar pattern', function() {
   var eveningStar = new EveningStar ();
   var result        = eveningStar.hasPattern(input);
   assert.deepEqual(result, true, 'Invalid result for EveningStar');
  });
})




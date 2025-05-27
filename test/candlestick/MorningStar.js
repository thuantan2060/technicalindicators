var MorningStar = require('../../lib/candlestick/MorningStar').default;
var assert = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs                      = require('fs');

// Valid Morning Star pattern:
// Day 1 (index 2): Large bearish candle
// Day 2 (index 1): Small star with gap down  
// Day 3 (index 0): Bullish candle with gap up, closes above day 1 midpoint
var input = {
  open: [21.50, 18.80, 23.00],  // [day3, day2, day1] - gaps and progression
  high: [22.80, 19.20, 23.50],
  close: [22.40, 18.90, 20.50],  // day1 midpoint = 21.75, day3 closes above it
  low: [21.20, 18.60, 20.50]
}

describe('MorningStar : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(input);
    fs.writeFileSync(__dirname+'/images/MorningStar.svg',imageBuffer);
  });
  it('Check whether the supplied data has MorningStar pattern', function() {
   var morningStar = new MorningStar ();
   var result      = morningStar.hasPattern(input);
   assert.deepEqual(result, true, 'Invalid result for MorningStar');
  });
})




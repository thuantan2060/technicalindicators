var ThreeBlackCrows = require('../../lib/candlestick/ThreeBlackCrows').default;
var assert = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs                      = require('fs');

// Valid Three Black Crows pattern:
// Day 1 (index 2): First bearish candle (open=23.00, close=22.00)
// Day 2 (index 1): Opens within Day 1 body (22.50), closes lower (21.50), lower low
// Day 3 (index 0): Opens within Day 2 body (22.00), closes lower (20.80), lower low
var input = {
  open: [22.00, 22.50, 23.00],  // [day3, day2, day1] - each opens within previous body
  high: [22.30, 22.80, 23.50],  // progressively lower highs
  close: [20.80, 21.50, 22.00], // progressively lower closes
  low: [20.60, 21.30, 21.80]    // progressively lower lows
}

describe('ThreeBlackCrows : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(input);
    fs.writeFileSync(__dirname+'/images/ThreeBlackCrows.svg',imageBuffer);
  });
  it('Check whether the supplied data has ThreeBlackCrows pattern', function() {
   var threeBlackCrows = new ThreeBlackCrows ();
   var result      = threeBlackCrows.hasPattern(input);
   assert.deepEqual(result, true, 'Invalid result for ThreeBlackCrows');
  });
})




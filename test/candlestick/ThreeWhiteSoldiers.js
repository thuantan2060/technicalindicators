var ThreeWhiteSoldiers = require('../../lib/candlestick/ThreeWhiteSoldiers').default;
var assert = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs                      = require('fs');

// Valid Three White Soldiers pattern:
// Day 1 (index 2): First bullish candle (open=21.00, close=22.00)
// Day 2 (index 1): Opens within Day 1 body (21.50), closes higher (22.50), higher high
// Day 3 (index 0): Opens within Day 2 body (22.00), closes higher (23.20), higher high
var input = {
  open: [22.00, 21.50, 21.00],  // [day3, day2, day1] - each opens within previous body
  close: [23.20, 22.50, 22.00], // progressively higher closes
  high: [23.50, 22.80, 22.30],  // progressively higher highs
  low: [21.80, 21.30, 20.80]    // progressively higher lows
}

describe('ThreeWhiteSoldiers : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(input);
    fs.writeFileSync(__dirname+'/images/ThreeWhiteSoldiers.svg',imageBuffer);
  });
  it('Check whether the supplied data has ThreeWhiteSoldiers pattern', function() {
   var threeWhiteSoldiers = new ThreeWhiteSoldiers ();
   var result      = threeWhiteSoldiers.hasPattern(input);
   assert.deepEqual(result, true, 'Invalid result for ThreeWhiteSoldiers');
  });
})




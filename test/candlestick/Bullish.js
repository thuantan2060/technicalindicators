var Bullish = require('../../lib/candlestick/Bullish.js').default;
var bullish = require('../../lib/candlestick/Bullish.js').bullish;
var assert                  = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs                      = require('fs');

// Valid Three White Soldiers pattern for testing bullish patterns:
// Day 1 (index 2): Bullish candle (open=21.00, close=22.00)
// Day 2 (index 1): Opens within Day 1 body (21.50), closes higher (22.50), higher high  
// Day 3 (index 0): Opens within Day 2 body (22.20), closes higher (23.20), higher high
var input = {
  open: [22.20, 21.50, 21.00],  // [day3, day2, day1] - each opens within previous body
  close: [23.20, 22.50, 22.00], // progressively higher closes
  high: [23.50, 22.80, 22.30],  // progressively higher highs
  low: [21.80, 21.30, 20.80]    // progressively higher lows
}

describe('BullishPattern : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(input);
    fs.writeFileSync(__dirname+'/images/Bullish.svg',imageBuffer);
  });
  it('Check whether the supplied data has Bullish pattern', function() {
   var BullishPattern = new Bullish ();
   var result        = BullishPattern.hasPattern(input);
   assert.deepEqual(result, true, 'Invalid result for BullishPattern');
  });
  it('Check whether the supplied data has Bullish pattern if reversed and using static', function() {
   var BullishPattern = new Bullish ();
   input.open.reverse()
   input.high.reverse()
   input.low.reverse()
   input.close.reverse()
   input.reversedInput = true;
   var result        = bullish(input);
   assert.deepEqual(result, true, 'Invalid result for BullishPattern');
  });
})


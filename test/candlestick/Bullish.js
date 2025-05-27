var Bullish = require('../../lib/candlestick/Bullish.js').default;
var bullish = require('../../lib/candlestick/Bullish.js').bullish;
var assert                  = require('assert');
var { drawCandleStick } = require('../helpers/test-helper.js');
var fs                      = require('fs');

// Valid Three White Soldiers pattern for testing bullish patterns:
// Day 1 (index 0): Bullish candle (open=21.00, close=22.00)
// Day 2 (index 1): Opens within Day 1 body (21.50), closes higher (22.50), higher high  
// Day 3 (index 2): Opens within Day 2 body (22.20), closes higher (23.20), higher high
var input = {
  open: [21.00, 21.50, 22.20],  // [day1, day2, day3] - each opens within previous body
  close: [22.00, 22.50, 23.20], // progressively higher closes
  high: [22.30, 22.80, 23.50],  // progressively higher highs
  low: [20.80, 21.30, 21.80]    // progressively higher lows
}

// Additional test cases
var strongBullishInput = {
  open: [15.00, 15.80, 16.90],  // Strong bullish reversal
  high: [16.20, 17.50, 18.80],
  close: [16.00, 17.30, 18.50],
  low: [14.80, 15.60, 16.70],
}

var weakBullishInput = {
  open: [25.00, 25.20, 25.40],  // Weak bullish pattern
  high: [25.80, 26.00, 26.20],
  close: [25.60, 25.80, 26.00],
  low: [24.80, 25.00, 25.20],
}

var invalidBullishInput = {
  open: [30.00, 29.50, 28.80],  // Declining pattern, not bullish
  high: [30.50, 30.00, 29.20],
  close: [29.80, 29.00, 28.50],
  low: [29.50, 28.80, 28.20],
}

var bearishInput = {
  open: [22.00, 21.50, 20.80],  // Bearish pattern
  high: [22.50, 22.00, 21.20],
  close: [21.80, 21.00, 20.50],
  low: [21.60, 20.80, 20.30],
}

var twoDayBullishInput = {
  open: [18.00, 18.50],  // Two-day bullish pattern
  high: [19.20, 20.00],
  close: [19.00, 19.80],
  low: [17.80, 18.30],
}

var gapUpBullishInput = {
  open: [20.00, 20.80, 21.60],  // Three White Soldiers with gaps
  high: [21.20, 22.30, 23.50],
  close: [21.00, 22.10, 23.30],
  low: [19.80, 20.60, 21.40],
}

var dojiIncludedInput = {
  open: [19.00, 19.50, 19.52],  // Includes doji
  high: [19.80, 20.00, 20.20],
  close: [19.70, 19.51, 20.00],
  low: [18.80, 19.30, 19.40],
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

  it('Should detect strong bullish pattern', function() {
    var bullishPattern = new Bullish();
    var result = bullishPattern.hasPattern(strongBullishInput);
    assert.deepEqual(result, true, 'Should detect strong bullish pattern');
  });

  it('Should detect weak bullish pattern', function() {
    var bullishPattern = new Bullish();
    var result = bullishPattern.hasPattern(weakBullishInput);
    assert.deepEqual(result, true, 'Should detect weak bullish pattern');
  });

  it('Should reject invalid bullish pattern (declining)', function() {
    var bullishPattern = new Bullish();
    var result = bullishPattern.hasPattern(invalidBullishInput);
    assert.deepEqual(result, false, 'Should reject invalid bullish pattern');
  });

  it('Should reject bearish pattern', function() {
    var bullishPattern = new Bullish();
    var result = bullishPattern.hasPattern(bearishInput);
    assert.deepEqual(result, false, 'Should reject bearish pattern');
  });

  it('Should handle two-day bullish pattern', function() {
    var bullishPattern = new Bullish();
    var result = bullishPattern.hasPattern(twoDayBullishInput);
    assert.equal(typeof result, 'boolean', 'Should return boolean for two-day pattern');
  });

  it('Should detect gap up bullish pattern', function() {
    var bullishPattern = new Bullish();
    var result = bullishPattern.hasPattern(gapUpBullishInput);
    assert.deepEqual(result, true, 'Should detect gap up bullish pattern');
  });

  it('Should handle pattern with doji', function() {
    var bullishPattern = new Bullish();
    var result = bullishPattern.hasPattern(dojiIncludedInput);
    assert.equal(typeof result, 'boolean', 'Should handle doji in pattern');
  });

  it('Should work with static function', function() {
    var result = bullish(strongBullishInput);
    assert.deepEqual(result, true, 'Static function should detect bullish pattern');
  });

  it('Should handle empty input gracefully', function() {
    var bullishPattern = new Bullish();
    var emptyInput = { open: [], high: [], close: [], low: [] };
    var result = bullishPattern.hasPattern(emptyInput);
    assert.deepEqual(result, false, 'Should return false for empty input');
  });

  it('Should handle single candle input', function() {
    var bullishPattern = new Bullish();
    var singleInput = {
      open: [20.00],
      high: [21.00],
      close: [20.80],
      low: [19.80]
    };
    var result = bullishPattern.hasPattern(singleInput);
    assert.equal(typeof result, 'boolean', 'Should handle single candle gracefully');
  });

  it('Should handle mismatched array lengths', function() {
    var bullishPattern = new Bullish();
    var mismatchedInput = {
      open: [20.00, 21.00],
      high: [21.50, 22.00, 23.00],
      close: [21.20, 21.80],
      low: [19.80, 20.50]
    };
    var result = bullishPattern.hasPattern(mismatchedInput);
    assert.equal(typeof result, 'boolean', 'Should handle mismatched arrays gracefully');
  });
})


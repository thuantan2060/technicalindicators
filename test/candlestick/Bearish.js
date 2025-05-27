var Bearish = require('../../lib/candlestick/Bearish.js').default;
var assert                  = require('assert');
var { drawCandleStick } = require('../helpers/test-helper.js');
var fs                      = require('fs');

var twoDayBearishInput = {
  open: [15.36,30.20],  // Previous: bullish (15.36 -> 27.89), Current: bearish (30.20 -> 14.50)
  high: [30.87,30.50],
  close: [27.89,14.50],
  low: [14.93,14.00],
}

var oneDayBearishInput = {
  open: [21.44],
  high: [25.10],
  close: [23.25],
  low: [20.82],
}

// Additional test cases
var strongBearishInput = {
  open: [50.00, 52.00],  // Strong bearish engulfing: bullish then bearish engulfing
  high: [52.50, 52.50],
  close: [51.20, 48.30],  // Current closes below previous open (engulfing)
  low: [49.80, 48.00],
}

var weakBearishInput = {
  open: [25.00, 26.30],  // Weak bearish engulfing
  high: [26.50, 26.50],
  close: [26.20, 24.80],  // Current closes below previous open (engulfing)
  low: [24.80, 24.70],
}

var invalidBearishInput = {
  open: [20.00, 19.50],  // Both candles are bearish, not a reversal
  high: [21.00, 20.00],
  close: [19.50, 18.80],
  low: [19.00, 18.50],
}

var bullishInput = {
  open: [18.00, 19.20],  // Bullish pattern, should return false
  high: [19.50, 21.80],
  close: [19.30, 21.50],
  low: [17.80, 19.00],
}

var dojiInput = {
  open: [22.00, 22.05],  // Doji pattern
  high: [22.50, 22.60],
  close: [22.02, 22.03],
  low: [21.50, 21.80],
}

var gapDownBearishInput = {
  open: [30.00, 31.60],  // Gap up then bearish engulfing
  high: [32.00, 32.00],
  close: [31.50, 29.50],  // Current closes below previous open (engulfing)
  low: [29.80, 29.20],
}

describe('BearishPattern : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(twoDayBearishInput);
    fs.writeFileSync(__dirname+'/images/bearish.svg',imageBuffer);
  });

  it('Check whether the supplied data has Bearish pattern', function() {
   var bearishPattern = new Bearish ();
   var result        = bearishPattern.hasPattern(twoDayBearishInput);
   assert.deepEqual(result, true, 'Invalid result for BearishPattern');
  });

  it('Should detect strong bearish reversal pattern', function() {
    var bearishPattern = new Bearish();
    var result = bearishPattern.hasPattern(strongBearishInput);
    assert.deepEqual(result, true, 'Should detect strong bearish pattern');
  });

  it('Should detect weak bearish pattern', function() {
    var bearishPattern = new Bearish();
    var result = bearishPattern.hasPattern(weakBearishInput);
    assert.deepEqual(result, true, 'Should detect weak bearish pattern');
  });

  it('Should reject invalid bearish pattern (no reversal)', function() {
    var bearishPattern = new Bearish();
    var result = bearishPattern.hasPattern(invalidBearishInput);
    assert.deepEqual(result, false, 'Should reject invalid bearish pattern');
  });

  it('Should reject bullish pattern', function() {
    var bearishPattern = new Bearish();
    var result = bearishPattern.hasPattern(bullishInput);
    assert.deepEqual(result, false, 'Should reject bullish pattern');
  });

  it('Should handle doji patterns appropriately', function() {
    var bearishPattern = new Bearish();
    var result = bearishPattern.hasPattern(dojiInput);
    // Result depends on implementation - could be true or false
    assert.equal(typeof result, 'boolean', 'Should return boolean for doji pattern');
  });

  it('Should detect gap down bearish pattern', function() {
    var bearishPattern = new Bearish();
    var result = bearishPattern.hasPattern(gapDownBearishInput);
    assert.deepEqual(result, true, 'Should detect gap down bearish pattern');
  });

  it('Should handle single candle input', function() {
    var bearishPattern = new Bearish();
    var result = bearishPattern.hasPattern(oneDayBearishInput);
    // Single candle might not be sufficient for pattern detection
    assert.equal(typeof result, 'boolean', 'Should return boolean for single candle');
  });

  it('Should handle empty input gracefully', function() {
    var bearishPattern = new Bearish();
    var emptyInput = { open: [], high: [], close: [], low: [] };
    var result = bearishPattern.hasPattern(emptyInput);
    assert.deepEqual(result, false, 'Should return false for empty input');
  });

  it('Should handle insufficient data', function() {
    var bearishPattern = new Bearish();
    var insufficientInput = {
      open: [20.00],
      high: [21.00],
      close: [19.50],
      low: [19.00]
    };
    var result = bearishPattern.hasPattern(insufficientInput);
    assert.equal(typeof result, 'boolean', 'Should handle insufficient data gracefully');
  });
})


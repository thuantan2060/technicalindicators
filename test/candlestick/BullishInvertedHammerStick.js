var BullishInvertedHammer = require('../../lib/candlestick/BullishInvertedHammerStick').default;
var assert = require('assert');
var { drawCandleStick } = require('../helpers/test-helper');
var fs = require('fs');

describe('Bullish Inverted Hammer (Single Stick): ', function() {
  
  // Valid BullishInvertedHammer pattern
  var validPattern = {
    open: [26.13],
    high: [52.06],   // long upper shadow
    close: [30.10],  // close > open (bullish)
    low: [26.13],    // low ≈ open (small lower shadow)
  };

  // Invalid pattern - bearish candle
  var invalidPattern1 = {
    open: [30.10],
    high: [52.06],
    close: [26.13],  // close < open (bearish)
    low: [26.13],
  };

  // Invalid pattern - lower shadow too large
  var invalidPattern2 = {
    open: [30.00],
    high: [52.06],
    close: [34.10],
    low: [20.00],    // low much lower than open
  };

  // Invalid pattern - upper shadow too small
  var invalidPattern3 = {
    open: [26.13],
    high: [28.00],   // small upper shadow
    close: [27.10],
    low: [26.13],
  };

  // Invalid pattern - body too large relative to upper shadow
  var invalidPattern4 = {
    open: [26.13],
    high: [30.00],   // upper shadow smaller than body
    close: [29.13],  // large body
    low: [26.13],
  };

  // Edge case - minimal body size
  var edgeCase1 = {
    open: [26.13],
    high: [52.06],
    close: [26.14],  // very small body
    low: [26.13],
  };

  // Edge case - approximate equality for low and open
  var edgeCase2 = {
    open: [26.130],
    high: [52.06],
    close: [30.10],
    low: [26.129],   // very close to open but properly lower
  };

  // Valid pattern with different scale
  var scaleTestPattern = {
    open: [100.00],
    high: [200.00],  // 100 point upper shadow
    close: [120.00], // 20 point body
    low: [100.00],
  };

  before(function() {
    var imageBuffer = drawCandleStick(validPattern);
    fs.writeFileSync(__dirname+'/images/BullishInvertedHammerStick.svg', imageBuffer);
  });

  it('should detect valid Bullish Inverted Hammer pattern', function() {
    var bullishInvertedHammer = new BullishInvertedHammer();
    var result = bullishInvertedHammer.hasPattern(validPattern);
    assert.strictEqual(result, true, 'Should detect valid Bullish Inverted Hammer pattern');
  });

  it('should reject bearish candle', function() {
    var bullishInvertedHammer = new BullishInvertedHammer();
    var result = bullishInvertedHammer.hasPattern(invalidPattern1);
    assert.strictEqual(result, false, 'Should reject bearish candle');
  });

  it('should reject pattern with large lower shadow', function() {
    var bullishInvertedHammer = new BullishInvertedHammer();
    var result = bullishInvertedHammer.hasPattern(invalidPattern2);
    assert.strictEqual(result, false, 'Should reject pattern with large lower shadow');
  });

  it('should reject pattern with insufficient upper shadow', function() {
    var bullishInvertedHammer = new BullishInvertedHammer();
    var result = bullishInvertedHammer.hasPattern(invalidPattern3);
    assert.strictEqual(result, false, 'Should reject pattern with insufficient upper shadow');
  });

  it('should reject pattern where body is too large relative to upper shadow', function() {
    var bullishInvertedHammer = new BullishInvertedHammer();
    var result = bullishInvertedHammer.hasPattern(invalidPattern4);
    assert.strictEqual(result, false, 'Should reject pattern where body is too large relative to upper shadow');
  });

  it('should detect pattern with minimal body size', function() {
    var bullishInvertedHammer = new BullishInvertedHammer();
    var result = bullishInvertedHammer.hasPattern(edgeCase1);
    assert.strictEqual(result, true, 'Should detect pattern with minimal body size');
  });

  it('should handle approximate equality for low and open', function() {
    var bullishInvertedHammer = new BullishInvertedHammer();
    var result = bullishInvertedHammer.hasPattern(edgeCase2);
    assert.strictEqual(result, true, 'Should handle approximate equality for low and open');
  });

  it('should work with different price scales', function() {
    var bullishInvertedHammer = new BullishInvertedHammer();
    var result = bullishInvertedHammer.hasPattern(scaleTestPattern);
    assert.strictEqual(result, true, 'Should work with different price scales');
  });

  it('should handle insufficient data gracefully', function() {
    var bullishInvertedHammer = new BullishInvertedHammer();
    var emptyData = {
      open: [],
      high: [],
      close: [],
      low: [],
    };
    var result = bullishInvertedHammer.hasPattern(emptyData);
    assert.strictEqual(result, false, 'Should return false for empty data');
  });

  it('should handle invalid OHLC relationships', function() {
    var bullishInvertedHammer = new BullishInvertedHammer();
    var invalidOHLC = {
      open: [26.13],
      high: [25.00],  // high < open (invalid)
      close: [30.10],
      low: [26.13],
    };
    var result = bullishInvertedHammer.hasPattern(invalidOHLC);
    assert.strictEqual(result, false, 'Should handle invalid OHLC relationships');
  });

  it('should work with different scale values', function() {
    var bullishInvertedHammer = new BullishInvertedHammer(2);
    var result = bullishInvertedHammer.hasPattern(validPattern);
    assert.strictEqual(result, true, 'Should work with different scale values');
  });
});

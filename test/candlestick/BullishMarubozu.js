var BullishMarubozu = require('../../lib/candlestick/BullishMarubozu').default;
var assert = require('assert');
var { drawCandleStick } = require('../helpers/test-helper');
var fs = require('fs');

describe('BullishMarubozu: ', function() {
  
  // Valid BullishMarubozu pattern - close > open, close = high, open = low
  var validPattern = {
    close: [31.23],
    open: [30.50],
    high: [31.23],  // high equals close
    low: [30.50],   // low equals open
  };

  // Invalid pattern - has upper shadow
  var invalidPattern1 = {
    close: [31.23],
    open: [30.50],
    high: [31.50],  // high > close (upper shadow exists)
    low: [30.50],
  };

  // Invalid pattern - has lower shadow
  var invalidPattern2 = {
    close: [31.23],
    open: [30.50],
    high: [31.23],
    low: [30.20],   // low < open (lower shadow exists)
  };

  // Invalid pattern - bearish candle
  var invalidPattern3 = {
    close: [30.20],  // close < open (bearish)
    open: [30.50],
    high: [30.50],
    low: [30.20],
  };

  // Edge case - very small body but valid marubozu
  var edgeCase1 = {
    close: [30.51],
    open: [30.50],
    high: [30.51],
    low: [30.50],
  };

  // Edge case - approximate equality test
  var edgeCase2 = {
    close: [31.230],
    open: [30.500],
    high: [31.231],  // very close to close
    low: [30.501],   // very close to open
  };

  // Large body marubozu
  var largeBodyPattern = {
    close: [45.00],
    open: [40.00],
    high: [45.00],
    low: [40.00],
  };

  before(function() {
    var imageBuffer = drawCandleStick(validPattern);
    fs.writeFileSync(__dirname+'/images/BullishMarubozu.svg', imageBuffer);
  });

  it('should detect valid BullishMarubozu pattern', function() {
    var bullishMarubozu = new BullishMarubozu();
    var result = bullishMarubozu.hasPattern(validPattern);
    assert.strictEqual(result, true, 'Should detect valid BullishMarubozu pattern');
  });

  it('should reject pattern with upper shadow', function() {
    var bullishMarubozu = new BullishMarubozu();
    var result = bullishMarubozu.hasPattern(invalidPattern1);
    assert.strictEqual(result, false, 'Should reject pattern with upper shadow');
  });

  it('should reject pattern with lower shadow', function() {
    var bullishMarubozu = new BullishMarubozu();
    var result = bullishMarubozu.hasPattern(invalidPattern2);
    assert.strictEqual(result, false, 'Should reject pattern with lower shadow');
  });

  it('should reject bearish candle', function() {
    var bullishMarubozu = new BullishMarubozu();
    var result = bullishMarubozu.hasPattern(invalidPattern3);
    assert.strictEqual(result, false, 'Should reject bearish candle');
  });

  it('should detect small body marubozu', function() {
    var bullishMarubozu = new BullishMarubozu();
    var result = bullishMarubozu.hasPattern(edgeCase1);
    assert.strictEqual(result, true, 'Should detect small body marubozu');
  });

  it('should handle approximate equality correctly', function() {
    var bullishMarubozu = new BullishMarubozu();
    var result = bullishMarubozu.hasPattern(edgeCase2);
    assert.strictEqual(result, true, 'Should handle approximate equality correctly');
  });

  it('should detect large body marubozu', function() {
    var bullishMarubozu = new BullishMarubozu();
    var result = bullishMarubozu.hasPattern(largeBodyPattern);
    assert.strictEqual(result, true, 'Should detect large body marubozu');
  });

  it('should handle insufficient data gracefully', function() {
    var bullishMarubozu = new BullishMarubozu();
    var emptyData = {
      close: [],
      open: [],
      high: [],
      low: [],
    };
    var result = bullishMarubozu.hasPattern(emptyData);
    assert.strictEqual(result, false, 'Should return false for empty data');
  });

  it('should handle invalid OHLC relationships', function() {
    var bullishMarubozu = new BullishMarubozu();
    var invalidOHLC = {
      close: [31.23],
      open: [30.50],
      high: [30.00],  // high < close (invalid)
      low: [30.50],
    };
    var result = bullishMarubozu.hasPattern(invalidOHLC);
    assert.strictEqual(result, false, 'Should handle invalid OHLC relationships');
  });

  it('should work with different scale values', function() {
    var bullishMarubozu = new BullishMarubozu(2);
    var result = bullishMarubozu.hasPattern(validPattern);
    assert.strictEqual(result, true, 'Should work with different scale values');
  });
});

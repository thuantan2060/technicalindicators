var MorningDojiStar = require('../../lib/candlestick/MorningDojiStar').default;
var assert = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs = require('fs');

describe('MorningDojiStar: ', function() {
  
  // Valid MorningDojiStar pattern - ascending order: [day1, day2, day3]
  var validPattern = {
    open: [22.20, 20.30, 20.70],   // day1 bearish, day2 doji, day3 bullish
    high: [22.50, 20.45, 21.82],  // day2 gaps down from day1, day3 gaps up from day2
    close: [20.80, 20.30, 21.58], // day1 bearish, day2 doji, day3 bullish above day1 midpoint (21.5)
    low: [20.65, 20.10, 20.40]
  };

  // Invalid pattern - first day not bearish
  var invalidPattern1 = {
    open: [20.20, 20.30, 20.70],
    high: [22.50, 20.45, 21.82],
    close: [22.80, 20.30, 21.58],  // day1 bullish (close > open)
    low: [20.65, 20.10, 20.40]
  };

  // Invalid pattern - second day not a doji
  var invalidPattern2 = {
    open: [22.20, 20.30, 20.70],
    high: [22.50, 20.45, 21.82],
    close: [20.80, 18.00, 21.58],  // day2 not a doji (large difference between open/close)
    low: [20.65, 17.50, 20.40]
  };

  // Invalid pattern - third day not bullish
  var invalidPattern3 = {
    open: [22.20, 20.30, 20.70],
    high: [22.50, 20.45, 21.82],
    close: [20.80, 20.30, 19.00],  // day3 bearish (close < open)
    low: [20.65, 20.10, 18.50]
  };

  // Invalid pattern - no gap between day1 and day2
  var invalidPattern4 = {
    open: [22.20, 21.50, 20.70],   // day2 open higher than day1 low
    high: [22.50, 22.00, 21.82],
    close: [20.80, 21.52, 21.58],
    low: [20.65, 21.00, 20.40]
  };

  // Invalid pattern - third day doesn't close above first day midpoint
  var invalidPattern5 = {
    open: [22.20, 20.30, 20.70],
    high: [22.50, 20.45, 21.82],
    close: [20.80, 20.30, 21.40],  // day3 close below day1 midpoint (21.5)
    low: [20.65, 20.10, 20.40]
  };

  // Edge case - minimal doji difference
  var edgeCase1 = {
    open: [22.20, 20.300, 20.70],
    high: [22.50, 20.45, 21.82],
    close: [20.80, 20.301, 21.58],  // very small doji difference
    low: [20.65, 20.10, 20.40]
  };

  // Valid pattern with larger price movements
  var largeMovementPattern = {
    open: [100.00, 40.00, 80.00],
    high: [105.00, 45.00, 95.00],   // Fixed: high must be >= close
    close: [60.00, 40.00, 95.00],   // day1 midpoint = 80, day3 close (95) above it, day2 is perfect doji
    low: [55.00, 35.00, 75.00]
  };

  before(function() {
    var imageBuffer = drawCandleStick(validPattern);
    fs.writeFileSync(__dirname+'/images/MorningDojiStar.svg', imageBuffer);
  });

  it('should detect valid MorningDojiStar pattern', function() {
    var morningDojiStar = new MorningDojiStar();
    var result = morningDojiStar.hasPattern(validPattern);
    assert.strictEqual(result, true, 'Should detect valid MorningDojiStar pattern');
  });

  it('should reject pattern when first day is not bearish', function() {
    var morningDojiStar = new MorningDojiStar();
    var result = morningDojiStar.hasPattern(invalidPattern1);
    assert.strictEqual(result, false, 'Should reject when first day is not bearish');
  });

  it('should reject pattern when second day is not a doji', function() {
    var morningDojiStar = new MorningDojiStar();
    var result = morningDojiStar.hasPattern(invalidPattern2);
    assert.strictEqual(result, false, 'Should reject when second day is not a doji');
  });

  it('should reject pattern when third day is not bullish', function() {
    var morningDojiStar = new MorningDojiStar();
    var result = morningDojiStar.hasPattern(invalidPattern3);
    assert.strictEqual(result, false, 'Should reject when third day is not bullish');
  });

  it('should reject pattern when there is no gap', function() {
    var morningDojiStar = new MorningDojiStar();
    var result = morningDojiStar.hasPattern(invalidPattern4);
    assert.strictEqual(result, false, 'Should reject when there is no gap between day1 and day2');
  });

  it('should reject pattern when third day does not close above first day midpoint', function() {
    var morningDojiStar = new MorningDojiStar();
    var result = morningDojiStar.hasPattern(invalidPattern5);
    assert.strictEqual(result, false, 'Should reject when third day does not close above first day midpoint');
  });

  it('should detect pattern with minimal doji difference', function() {
    var morningDojiStar = new MorningDojiStar();
    var result = morningDojiStar.hasPattern(edgeCase1);
    assert.strictEqual(result, true, 'Should detect pattern with minimal doji difference');
  });

  it('should detect pattern with large price movements', function() {
    var morningDojiStar = new MorningDojiStar();
    var result = morningDojiStar.hasPattern(largeMovementPattern);
    assert.strictEqual(result, true, 'Should detect pattern with large price movements');
  });

  it('should handle insufficient data gracefully', function() {
    var morningDojiStar = new MorningDojiStar();
    var insufficientData = {
      open: [20.70, 20.30],  // only 2 days instead of 3
      high: [21.82, 20.45],
      close: [21.58, 20.30],
      low: [20.40, 20.10]
    };
    var result = morningDojiStar.hasPattern(insufficientData);
    assert.strictEqual(result, false, 'Should return false for insufficient data');
  });

  it('should handle invalid OHLC relationships', function() {
    var morningDojiStar = new MorningDojiStar();
    var invalidOHLC = {
      open: [22.20, 20.30, 20.70],
      high: [19.00, 20.45, 21.82],  // day1 high < open (invalid)
      close: [20.80, 20.30, 21.58],
      low: [20.65, 20.10, 20.40]
    };
    var result = morningDojiStar.hasPattern(invalidOHLC);
    assert.strictEqual(result, false, 'Should handle invalid OHLC relationships');
  });

  it('should work with different scale values', function() {
    var morningDojiStar = new MorningDojiStar(2);
    var result = morningDojiStar.hasPattern(validPattern);
    assert.strictEqual(result, true, 'Should work with different scale values');
  });
});




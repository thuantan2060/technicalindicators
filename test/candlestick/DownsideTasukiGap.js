var DownsideTasukiGap = require('../../lib/candlestick/DownsideTasukiGap').default;
var assert = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs = require('fs');

describe('DownsideTasukiGap: ', function() {
  
  // Valid DownsideTasukiGap pattern
  var validPattern = {
    open: [50.00, 35.00, 32.00],   // [day1, day2, day3] - chronological order
    high: [52.00, 36.00, 38.00],
    close: [45.00, 30.00, 37.00],  // day1 bearish (50->45), day2 bearish with gap (35->30), day3 bullish (32->37)
    low: [44.00, 29.00, 31.00],   // day2 high (36) < day1 low (44) = gap, day3 closes in gap (37 between 36 and 44)
  };

  // Invalid pattern - first day not bearish
  var invalidPattern1 = {
    open: [45.00, 35.00, 32.00],
    high: [52.00, 36.00, 38.00],
    close: [50.00, 30.00, 37.00],  // day1 bullish (45->50, close > open)
    low: [44.00, 29.00, 31.00],
  };

  // Invalid pattern - second day not bearish
  var invalidPattern2 = {
    open: [50.00, 30.00, 32.00],
    high: [52.00, 36.00, 38.00],
    close: [45.00, 35.00, 37.00],  // day2 bullish (30->35, close > open)
    low: [44.00, 29.00, 31.00],
  };

  // Invalid pattern - third day not bullish
  var invalidPattern3 = {
    open: [50.00, 35.00, 37.00],
    high: [52.00, 36.00, 38.00],
    close: [45.00, 30.00, 32.00],  // day3 bearish (37->32, close < open)
    low: [44.00, 29.00, 31.00],
  };

  // Invalid pattern - no gap between day1 and day2
  var invalidPattern4 = {
    open: [50.00, 35.00, 32.00],
    high: [52.00, 45.00, 38.00],  // day2 high (45) overlaps with day1 low (44) - no gap
    close: [45.00, 30.00, 37.00],
    low: [44.00, 29.00, 31.00],
  };

  // Invalid pattern - gap not properly filled
  var invalidPattern5 = {
    open: [50.00, 35.00, 25.00],   // day3 open too low, doesn't open within day2 body
    high: [52.00, 36.00, 27.00],
    close: [45.00, 30.00, 26.00],
    low: [44.00, 29.00, 24.00],
  };

  // Edge case - minimal gap
  var edgeCase1 = {
    open: [45.00, 33.45, 30.20],
    high: [46.20, 37.50, 38.00],   // day2 high just below day1 low (37.50 < 38.00), day3 high fixed
    close: [41.20, 29.31, 37.75],  // day3 closes in gap (37.75 between 37.50 and 38.00)
    low: [38.00, 28.00, 29.80],   // day1 low adjusted to create proper gap
  };

  // Valid pattern with larger price movements
  var largeMovementPattern = {
    open: [100.00, 60.00, 58.00],   // day3 opens within day2 body (58 between 55 and 60)
    high: [105.00, 65.00, 75.00],
    close: [90.00, 55.00, 70.00],   // day3 closes in gap (70 between 65 and 85)
    low: [85.00, 50.00, 57.00],
  };

  before(function() {
    var imageBuffer = drawCandleStick(validPattern);
    fs.writeFileSync(__dirname+'/images/downsideTasukiGap.svg', imageBuffer);
  });

  it('should detect valid DownsideTasukiGap pattern', function() {
    var downsideTasukiGap = new DownsideTasukiGap();
    var result = downsideTasukiGap.hasPattern(validPattern);
    assert.strictEqual(result, true, 'Should detect valid DownsideTasukiGap pattern');
  });

  it('should reject pattern when first day is not bearish', function() {
    var downsideTasukiGap = new DownsideTasukiGap();
    var result = downsideTasukiGap.hasPattern(invalidPattern1);
    assert.strictEqual(result, false, 'Should reject when first day is not bearish');
  });

  it('should reject pattern when second day is not bearish', function() {
    var downsideTasukiGap = new DownsideTasukiGap();
    var result = downsideTasukiGap.hasPattern(invalidPattern2);
    assert.strictEqual(result, false, 'Should reject when second day is not bearish');
  });

  it('should reject pattern when third day is not bullish', function() {
    var downsideTasukiGap = new DownsideTasukiGap();
    var result = downsideTasukiGap.hasPattern(invalidPattern3);
    assert.strictEqual(result, false, 'Should reject when third day is not bullish');
  });

  it('should reject pattern when there is no gap', function() {
    var downsideTasukiGap = new DownsideTasukiGap();
    var result = downsideTasukiGap.hasPattern(invalidPattern4);
    assert.strictEqual(result, false, 'Should reject when there is no gap between day1 and day2');
  });

  it('should reject pattern when gap is not properly filled', function() {
    var downsideTasukiGap = new DownsideTasukiGap();
    var result = downsideTasukiGap.hasPattern(invalidPattern5);
    assert.strictEqual(result, false, 'Should reject when gap is not properly filled');
  });

  it('should detect pattern with minimal gap', function() {
    var downsideTasukiGap = new DownsideTasukiGap();
    var result = downsideTasukiGap.hasPattern(edgeCase1);
    assert.strictEqual(result, true, 'Should detect pattern with minimal gap');
  });

  it('should detect pattern with large price movements', function() {
    var downsideTasukiGap = new DownsideTasukiGap();
    var result = downsideTasukiGap.hasPattern(largeMovementPattern);
    assert.strictEqual(result, true, 'Should detect pattern with large price movements');
  });

  it('should handle insufficient data gracefully', function() {
    var downsideTasukiGap = new DownsideTasukiGap();
    var insufficientData = {
      open: [30.20, 33.45],  // only 2 days instead of 3
      high: [36.63, 34.70],
      close: [36.28, 29.31],
      low: [29.80, 28.00],
    };
    var result = downsideTasukiGap.hasPattern(insufficientData);
    assert.strictEqual(result, false, 'Should return false for insufficient data');
  });

  it('should handle invalid OHLC relationships', function() {
    var downsideTasukiGap = new DownsideTasukiGap();
    var invalidOHLC = {
      open: [30.20, 33.45, 45.00],
      high: [25.00, 34.70, 46.20],  // day3 high < open (invalid)
      close: [36.28, 29.31, 41.20],
      low: [29.80, 28.00, 38.56],
    };
    var result = downsideTasukiGap.hasPattern(invalidOHLC);
    assert.strictEqual(result, false, 'Should handle invalid OHLC relationships');
  });

  it('should work with different scale values', function() {
    var downsideTasukiGap = new DownsideTasukiGap(2);
    var result = downsideTasukiGap.hasPattern(validPattern);
    assert.strictEqual(result, true, 'Should work with different scale values');
  });
});


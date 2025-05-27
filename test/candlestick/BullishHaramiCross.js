var BullishHaramiCross = require('../../lib/candlestick/BullishHaramiCross').default;
var assert = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs = require('fs');

describe('BullishHaramiCross: ', function() {
  
  // Valid BullishHaramiCross pattern
  var validPattern = {
    open: [25.20, 25.13],   // [current, previous] - current open > previous open
    high: [25.90, 25.80],   // current high > previous high  
    close: [25.10, 25.13],  // current close < open (bearish), previous close ≈ open (doji)
    low: [25.05, 21.70],    // current open > previous low
  };

  // Invalid pattern - previous day not a doji
  var invalidPattern1 = {
    open: [24.00, 25.13],
    high: [24.20, 25.80], 
    close: [23.80, 24.50],  // previous close != open (not a doji)
    low: [23.70, 21.70],
  };

  // Invalid pattern - current day not bearish
  var invalidPattern2 = {
    open: [24.00, 25.13],
    high: [24.50, 25.13],
    close: [24.30, 25.13],  // current close > open (bullish, not bearish)
    low: [23.70, 25.13],
  };

  // Invalid pattern - no proper containment
  var invalidPattern3 = {
    open: [20.00, 25.13],   // current open too low, breaks containment
    high: [21.00, 25.13],
    close: [19.50, 25.13],  
    low: [19.00, 25.13],
  };

  // Edge case - minimal doji difference
  var edgeCase1 = {
    open: [25.131, 25.130],  // current open > previous open
    high: [25.135, 25.131],  // current high > previous high
    close: [25.129, 25.131], // current bearish, previous doji (very small difference)
    low: [25.128, 21.70],    // current open > previous low
  };

  before(function() {
    var imageBuffer = drawCandleStick(validPattern);
    fs.writeFileSync(__dirname+'/images/BullishHaramiCross.svg', imageBuffer);
  });

  it('should detect valid BullishHaramiCross pattern', function() {
    var bullishHaramiCross = new BullishHaramiCross();
    var result = bullishHaramiCross.hasPattern(validPattern);
    assert.strictEqual(result, true, 'Should detect valid BullishHaramiCross pattern');
  });

  it('should reject pattern when previous day is not a doji', function() {
    var bullishHaramiCross = new BullishHaramiCross();
    var result = bullishHaramiCross.hasPattern(invalidPattern1);
    assert.strictEqual(result, false, 'Should reject when previous day is not a doji');
  });

  it('should reject pattern when current day is not bearish', function() {
    var bullishHaramiCross = new BullishHaramiCross();
    var result = bullishHaramiCross.hasPattern(invalidPattern2);
    assert.strictEqual(result, false, 'Should reject when current day is not bearish');
  });

  it('should reject pattern when there is no proper containment', function() {
    var bullishHaramiCross = new BullishHaramiCross();
    var result = bullishHaramiCross.hasPattern(invalidPattern3);
    assert.strictEqual(result, false, 'Should reject when there is no proper containment');
  });

  it('should handle edge case with minimal doji difference', function() {
    var bullishHaramiCross = new BullishHaramiCross();
    var result = bullishHaramiCross.hasPattern(edgeCase1);
    assert.strictEqual(result, true, 'Should handle minimal doji difference correctly');
  });

  it('should handle insufficient data gracefully', function() {
    var bullishHaramiCross = new BullishHaramiCross();
    var insufficientData = {
      open: [23.45],
      high: [24.59],
      close: [23.45],
      low: [23.07],
    };
    var result = bullishHaramiCross.hasPattern(insufficientData);
    assert.strictEqual(result, false, 'Should return false for insufficient data');
  });

  it('should handle invalid OHLC data', function() {
    var bullishHaramiCross = new BullishHaramiCross();
    var invalidOHLC = {
      open: [24.00, 25.13],
      high: [20.00, 25.13],  // high < open (invalid)
      close: [23.80, 25.13],
      low: [23.70, 25.13],
    };
    var result = bullishHaramiCross.hasPattern(invalidOHLC);
    assert.strictEqual(result, false, 'Should handle invalid OHLC data');
  });

  it('should work with different scale values', function() {
    var bullishHaramiCross = new BullishHaramiCross(2);
    var result = bullishHaramiCross.hasPattern(validPattern);
    assert.strictEqual(result, true, 'Should work with different scale values');
  });
});


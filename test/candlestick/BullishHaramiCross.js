var BullishHaramiCross = require('../../lib/candlestick/BullishHaramiCross').default;
var assert = require('assert');
var { drawCandleStick } = require('../helpers/test-helper');
var fs = require('fs');

describe('BullishHaramiCross: ', function() {
  
  // Valid BullishHaramiCross pattern
  // Previous: Long bearish candle, Current: Doji contained within previous body
  var validPattern = {
    open: [25.80, 25.40],   // [previous bearish open, current doji open]
    high: [26.00, 25.45],   // [previous high, current high - contained]
    close: [24.20, 25.41],  // [previous bearish close, current doji close ≈ open]
    low: [24.00, 25.35],    // [previous low, current low - contained]
  };

  // Invalid pattern - previous day not bearish enough
  var invalidPattern1 = {
    open: [25.50, 25.40],   // Previous candle not long enough
    high: [25.80, 25.45],
    close: [25.30, 25.41],  // Previous close too close to open (not bearish enough)
    low: [25.20, 25.35],
  };

  // Invalid pattern - current day not a doji
  var invalidPattern2 = {
    open: [25.80, 25.40],   // Previous bearish, current not doji
    high: [26.00, 25.60],
    close: [24.20, 25.10],  // Current close much lower than open (not a doji)
    low: [24.00, 25.05],
  };

  // Invalid pattern - no proper containment
  var invalidPattern3 = {
    open: [25.80, 26.50],   // Current candle outside previous range
    high: [26.00, 26.80],   // Current high above previous high
    close: [24.20, 26.51],  // Current not contained
    low: [24.00, 26.40],
  };

  // Edge case - minimal doji difference
  var edgeCase1 = {
    open: [26.00, 25.200],  // Previous bearish, current minimal doji
    high: [26.20, 25.205],  // Current contained
    close: [24.50, 25.201], // Current doji (very small difference)
    low: [24.30, 25.195],   // Current contained
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

  it('should reject pattern when previous day is not bearish enough', function() {
    var bullishHaramiCross = new BullishHaramiCross();
    var result = bullishHaramiCross.hasPattern(invalidPattern1);
    assert.strictEqual(result, false, 'Should reject when previous day is not bearish enough');
  });

  it('should reject pattern when current day is not a doji', function() {
    var bullishHaramiCross = new BullishHaramiCross();
    var result = bullishHaramiCross.hasPattern(invalidPattern2);
    assert.strictEqual(result, false, 'Should reject when current day is not a doji');
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
      open: [25.80, 25.40],
      high: [24.00, 25.45],  // high < open (invalid)
      close: [24.20, 25.41],
      low: [24.00, 25.35],
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


var BearishHaramiCross = require('../../lib/candlestick/BearishHaramiCross').default;
var assert = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs = require('fs');

// Valid Bearish Harami Cross - Original test case
var validBearishHaramiCross = {
  open: [20.12, 22.13],   // [doji, bullish]
  high: [23.82, 22.76],
  close: [20.12, 22.50],  // doji -> bullish (close > open)
  low: [19.88, 21.31],
}

// Valid Bearish Harami Cross - Perfect doji
var perfectDoji = {
  open: [25.00, 26.00],   // [perfect doji, bullish]
  high: [25.50, 27.00],
  close: [25.00, 27.00],  // perfect doji -> strong bullish
  low: [24.50, 25.50],
}

// Valid Bearish Harami Cross - Minimal containment
var minimalContainment = {
  open: [30.00, 31.00],   // [doji, bullish with minimal containment]
  high: [30.50, 32.00],
  close: [30.05, 31.50],  // small doji -> bullish
  low: [29.50, 30.50],
}

// Valid Bearish Harami Cross - Large price range
var largePriceRange = {
  open: [100.00, 102.00], // [doji, bullish]
  high: [105.00, 108.00],
  close: [100.50, 106.00], // small doji -> strong bullish
  low: [95.00, 101.00],
}

// Invalid - Previous day is not a doji
var noDoji = {
  open: [20.12, 22.13],   // [bearish, bullish] - no doji
  high: [23.82, 22.76],
  close: [19.50, 22.50],  // bearish -> bullish
  low: [19.88, 21.31],
}

// Invalid - Current day is bearish
var currentBearish = {
  open: [20.12, 22.13],   // [doji, bearish]
  high: [23.82, 22.76],
  close: [20.12, 21.50],  // doji -> bearish (close < open)
  low: [19.88, 21.31],
}

// Invalid - No containment
var noContainment = {
  open: [20.12, 25.00],   // [doji, bullish but no containment]
  high: [23.82, 26.00],
  close: [20.12, 26.00],  // doji -> bullish but outside range
  low: [19.88, 24.50],
}

// Invalid - Insufficient containment
var insufficientContainment = {
  open: [20.12, 22.13],   // [doji, bullish]
  high: [23.82, 22.76],
  close: [20.12, 22.50],  // doesn't meet all containment criteria
  low: [19.88, 22.00],    // currOpen not < prevLow
}

// Edge case - Exact containment boundaries
var exactContainment = {
  open: [20.00, 21.00],   // [doji, bullish]
  high: [22.00, 23.00],
  close: [20.00, 22.00],  // exact boundaries
  low: [19.00, 20.50],
}

// Invalid - Current day doji (should be bullish)
var currentDoji = {
  open: [20.12, 22.13],   // [doji, doji]
  high: [23.82, 22.76],
  close: [20.12, 22.13],  // doji -> doji
  low: [19.88, 21.31],
}

// Invalid - High less than open (invalid OHLC)
var invalidOHLC = {
  open: [20.12, 22.13],
  high: [19.82, 22.76],   // Invalid: high < open for first candle
  close: [20.12, 22.50],
  low: [19.88, 21.31],
}

// Invalid - Insufficient data (only 1 candle)
var insufficientData = {
  open: [20.12],
  high: [23.82],
  close: [20.12],
  low: [19.88],
}

// Invalid - Empty data
var emptyData = {
  open: [],
  high: [],
  close: [],
  low: []
}

// Valid - Approximate equality for doji
var approximateDoji = {
  open: [20.12, 22.13],   // [approximate doji, bullish]
  high: [23.82, 22.76],
  close: [20.13, 22.50],  // very close to open (should pass approximateEqual)
  low: [19.88, 21.31],
}

describe('BearishHaramiCross: ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(validBearishHaramiCross);
    fs.writeFileSync(__dirname+'/images/BearishHaramiCross.svg', imageBuffer);
    
    var imageBuffer2 = drawCandleStick(perfectDoji);
    fs.writeFileSync(__dirname+'/images/perfectBearishHaramiCross.svg', imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(largePriceRange);
    fs.writeFileSync(__dirname+'/images/largeBearishHaramiCross.svg', imageBuffer3);
  });
  
  // Positive test cases
  it('Check whether the supplied data has BearishHaramiCross pattern', function() {
    var bearishHaramiCross = new BearishHaramiCross();
    var result = bearishHaramiCross.hasPattern(validBearishHaramiCross);
    assert.deepEqual(result, true, 'Invalid result for BearishHaramiCross');
  });
  
  it('Should identify pattern with perfect doji', function() {
    var bearishHaramiCross = new BearishHaramiCross();
    var result = bearishHaramiCross.hasPattern(perfectDoji);
    assert.deepEqual(result, true, 'Should identify pattern with perfect doji');
  });
  
  it('Should identify pattern with minimal containment', function() {
    var bearishHaramiCross = new BearishHaramiCross();
    var result = bearishHaramiCross.hasPattern(minimalContainment);
    assert.deepEqual(result, true, 'Should identify pattern with minimal containment');
  });
  
  it('Should identify pattern with large price range', function() {
    var bearishHaramiCross = new BearishHaramiCross();
    var result = bearishHaramiCross.hasPattern(largePriceRange);
    assert.deepEqual(result, true, 'Should identify pattern with large price range');
  });
  
  it('Should identify pattern with exact containment boundaries', function() {
    var bearishHaramiCross = new BearishHaramiCross();
    var result = bearishHaramiCross.hasPattern(exactContainment);
    assert.deepEqual(result, true, 'Should identify pattern with exact boundaries');
  });
  
  it('Should handle approximate equality for doji', function() {
    var bearishHaramiCross = new BearishHaramiCross();
    var result = bearishHaramiCross.hasPattern(approximateDoji);
    assert.deepEqual(result, true, 'Should handle approximate equality for doji');
  });
  
  // Negative test cases
  it('Should return false when previous day is not a doji', function() {
    var bearishHaramiCross = new BearishHaramiCross();
    var result = bearishHaramiCross.hasPattern(noDoji);
    assert.deepEqual(result, false, 'Should return false when no doji');
  });
  
  it('Should return false when current day is bearish', function() {
    var bearishHaramiCross = new BearishHaramiCross();
    var result = bearishHaramiCross.hasPattern(currentBearish);
    assert.deepEqual(result, false, 'Should return false when current day is bearish');
  });
  
  it('Should return false when there is no containment', function() {
    var bearishHaramiCross = new BearishHaramiCross();
    var result = bearishHaramiCross.hasPattern(noContainment);
    assert.deepEqual(result, false, 'Should return false when no containment');
  });
  
  it('Should return false when containment is insufficient', function() {
    var bearishHaramiCross = new BearishHaramiCross();
    var result = bearishHaramiCross.hasPattern(insufficientContainment);
    assert.deepEqual(result, false, 'Should return false for insufficient containment');
  });
  
  it('Should return false when current day is also a doji', function() {
    var bearishHaramiCross = new BearishHaramiCross();
    var result = bearishHaramiCross.hasPattern(currentDoji);
    assert.deepEqual(result, false, 'Should return false when current day is doji');
  });
  
  it('Should return false for invalid OHLC data', function() {
    var bearishHaramiCross = new BearishHaramiCross();
    var result = bearishHaramiCross.hasPattern(invalidOHLC);
    assert.deepEqual(result, false, 'Should return false for invalid OHLC data');
  });
  
  it('Should return false for insufficient data', function() {
    var bearishHaramiCross = new BearishHaramiCross();
    var result = bearishHaramiCross.hasPattern(insufficientData);
    assert.deepEqual(result, false, 'Should return false for insufficient data');
  });
  
  it('Should return false for empty data', function() {
    var bearishHaramiCross = new BearishHaramiCross();
    var result = bearishHaramiCross.hasPattern(emptyData);
    assert.deepEqual(result, false, 'Should return false for empty data');
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
    var bearishHaramiCross = new BearishHaramiCross(2);
    var result = bearishHaramiCross.hasPattern(validBearishHaramiCross);
    assert.deepEqual(result, true, 'Should work with custom scale parameter');
  });
  
  // Test function export
  it('Should work using function export', function() {
    var bearishharamicross = require('../../lib/candlestick/BearishHaramiCross').bearishharamicross;
    var result = bearishharamicross(validBearishHaramiCross);
    assert.deepEqual(result, true, 'Should work using function export');
  });
  
  // Test pattern name
  it('Should have correct pattern name', function() {
    var bearishHaramiCross = new BearishHaramiCross();
    assert.deepEqual(bearishHaramiCross.name, 'BearishHaramiCross', 'Should have correct pattern name');
  });
  
  // Test required count
  it('Should require exactly 2 candles', function() {
    var bearishHaramiCross = new BearishHaramiCross();
    assert.deepEqual(bearishHaramiCross.requiredCount, 2, 'Should require exactly 2 candles');
  });
  
  // Test multi-day data with pattern at different positions
  it('Should find pattern in multi-day data', function() {
    var multiDayData = {
      open: [25.00, 20.12, 22.13, 30.00],   // pattern in middle
      high: [25.50, 23.82, 22.76, 30.50],
      close: [24.50, 20.12, 22.50, 30.50],  // fixed: made position 2 bullish (22.50 > 22.13)
      low: [24.00, 19.88, 21.31, 29.50]
    };
    var bearishHaramiCross = new BearishHaramiCross();
    var indices = bearishHaramiCross.getAllPatternIndex(multiDayData);
    assert.deepEqual(indices.length > 0, true, 'Should find pattern in multi-day data');
  });
  
  // Test containment logic edge cases
  it('Should validate all containment criteria', function() {
    // Test case where some but not all containment criteria are met
    var partialContainment = {
      open: [20.12, 22.13],
      high: [23.82, 22.76],
      close: [20.12, 22.13],
      low: [19.88, 19.00],    // currOpen not < prevLow
    };
    var bearishHaramiCross = new BearishHaramiCross();
    var result = bearishHaramiCross.hasPattern(partialContainment);
    assert.deepEqual(result, false, 'Should validate all containment criteria');
  });
});


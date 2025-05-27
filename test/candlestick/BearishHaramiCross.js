var BearishHaramiCross = require('../../lib/candlestick/BearishHaramiCross').default;
var assert = require('assert');
var { drawCandleStick } = require('../helpers/test-helper');
var fs = require('fs');

// Valid Bearish Harami Cross - Corrected pattern
var validBearishHaramiCross = {
  open: [20.00, 22.00],   // [previous bullish open, current doji open]
  high: [23.50, 22.05],   // [previous high, current high - contained]
  close: [23.00, 22.01],  // [previous bullish close, current doji close ≈ open]
  low: [19.80, 21.95],    // [previous low, current low - contained]
}

// Valid Bearish Harami Cross - Perfect doji
var perfectDoji = {
  open: [24.00, 26.00],   // [previous bullish open, current doji open]
  high: [27.50, 26.00],   // [previous high, current high = open (perfect doji)]
  close: [27.00, 26.00],  // [previous bullish close, current doji close = open]
  low: [23.50, 26.00],    // [previous low, current low = open (perfect doji)]
}

// Valid Bearish Harami Cross - Minimal containment
var minimalContainment = {
  open: [29.00, 30.50],   // [previous bullish open, current doji open]
  high: [32.00, 30.55],   // [previous high, current high - barely contained]
  close: [31.50, 30.52],  // [previous bullish close, current doji close ≈ open]
  low: [28.50, 30.48],    // [previous low, current low - barely contained]
}

// Valid Bearish Harami Cross - Large price range
var largePriceRange = {
  open: [95.00, 102.00],  // [previous bullish open, current doji open]
  high: [108.00, 102.50], // [previous high, current high - contained]
  close: [106.00, 102.10], // [previous bullish close, current doji close ≈ open]
  low: [94.00, 101.80],   // [previous low, current low - contained]
}

// Invalid - Previous day is not bullish enough
var notBullishEnough = {
  open: [20.00, 22.00],   // [previous not bullish enough, current doji]
  high: [20.50, 22.05],   // Previous range too small
  close: [20.30, 22.01],  // Previous close barely above open
  low: [19.80, 21.95],
}

// Invalid - Current day is not a doji
var currentNotDoji = {
  open: [20.00, 22.00],   // [previous bullish, current not doji]
  high: [23.50, 23.00],   // Current candle bullish, not doji
  close: [23.00, 22.80],  // Current close much higher than open
  low: [19.80, 21.50],
}

// Invalid - No containment
var noContainment = {
  open: [20.00, 25.00],   // [previous bullish, current outside range]
  high: [23.50, 26.00],   // Current high above previous high
  close: [23.00, 25.50],  // Current not contained
  low: [19.80, 24.50],
}

// Invalid - Insufficient containment
var insufficientContainment = {
  open: [20.00, 22.00],   // [previous bullish, current partially outside]
  high: [23.50, 24.00],   // Current high above previous high
  close: [23.00, 22.01],  // Current doji but high not contained
  low: [19.80, 21.95],
}

// Edge case - Exact containment boundaries
var exactContainment = {
  open: [20.00, 22.00],   // [previous bullish, current at boundaries]
  high: [22.50, 22.50],   // Current high exactly at previous close (body top)
  close: [22.50, 22.01],  // [previous bullish close, current doji]
  low: [19.50, 20.00],    // Current low exactly at previous open (body bottom)
}

// Invalid - Current day bullish (should be doji)
var currentBullish = {
  open: [20.00, 22.00],   // [previous bullish, current bullish]
  high: [23.50, 23.00],   // Current candle bullish
  close: [23.00, 22.80],  // Current close > open (bullish, not doji)
  low: [19.80, 21.50],
}

// Invalid - High less than open (invalid OHLC)
var invalidOHLC = {
  open: [20.00, 22.00],
  high: [19.00, 22.05],   // Invalid: high < open for first candle
  close: [23.00, 22.01],
  low: [19.80, 21.95],
}

// Invalid - Insufficient data (only 1 candle)
var insufficientData = {
  open: [20.00],
  high: [23.50],
  close: [23.00],
  low: [19.80],
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
  open: [20.00, 22.00],   // [previous bullish, current approximate doji]
  high: [23.50, 22.05],   // Current contained
  close: [23.00, 22.02],  // Very close to open (should pass approximateEqual)
  low: [19.80, 21.95],    // Current contained
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
  it('Should return false when previous day is not bullish enough', function() {
    var bearishHaramiCross = new BearishHaramiCross();
    var result = bearishHaramiCross.hasPattern(notBullishEnough);
    assert.deepEqual(result, false, 'Should return false when previous day is not bullish enough');
  });
  
  it('Should return false when current day is not a doji', function() {
    var bearishHaramiCross = new BearishHaramiCross();
    var result = bearishHaramiCross.hasPattern(currentNotDoji);
    assert.deepEqual(result, false, 'Should return false when current day is not a doji');
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
  
  it('Should return false when current day is bullish', function() {
    var bearishHaramiCross = new BearishHaramiCross();
    var result = bearishHaramiCross.hasPattern(currentBullish);
    assert.deepEqual(result, false, 'Should return false when current day is bullish');
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
      open: [25.00, 20.00, 21.50, 30.00],   // pattern at positions 1-2: bullish then doji
      high: [25.50, 23.00, 21.55, 30.50],   // position 1: bullish candle
      close: [24.50, 22.50, 21.51, 30.50],  // position 2: doji contained in position 1 body
      low: [24.00, 19.50, 21.45, 29.50]     // doji fully contained within previous body (20.00-22.50)
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


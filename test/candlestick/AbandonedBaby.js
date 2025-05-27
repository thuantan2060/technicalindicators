var AbandonedBaby = require('../../lib/candlestick/AbandonedBaby').default;
var assert = require('assert');
var { drawCandleStick } = require('../helpers/test-helper');
var fs = require('fs');

// Valid Abandoned Baby - Original test case (Bullish reversal)
var validAbandonedBaby = {
  open: [31.10, 26.18, 27.47],   // [bearish, doji, bullish]
  high: [31.80, 26.91, 30.94],
  close: [28.10, 26.18, 30.62],  // bearish -> doji -> bullish
  low: [27.50, 25.40, 27.03]     // gaps: 25.40 < 27.50 and 27.03 > 26.91
}

// Valid Abandoned Baby - Clear gaps (fixed doji to be more realistic)
var clearGaps = {
  open: [50.00, 45.00, 48.00],
  high: [50.50, 45.02, 52.00],
  close: [47.00, 45.01, 52.00],  // bearish -> doji -> bullish (smaller doji body)
  low: [46.50, 44.50, 47.50]     // clear gaps on both sides
}

// Valid Abandoned Baby - Minimal gaps (fixed doji to be more realistic)
var minimalGaps = {
  open: [30.00, 28.50, 29.00],
  high: [30.20, 28.51, 31.00],
  close: [29.50, 28.50, 31.00],  // bearish -> doji -> bullish (perfect doji)
  low: [29.40, 28.40, 28.80]     // minimal but valid gaps
}

// Invalid - No doji in middle
var noDoji = {
  open: [31.10, 26.50, 27.47],   // middle candle is not a doji
  high: [31.80, 27.00, 30.94],
  close: [28.10, 26.00, 30.62],  // bearish -> bearish -> bullish
  low: [27.50, 25.40, 27.03]
}

// Invalid - No gaps (continuous pattern)
var noGaps = {
  open: [31.10, 28.00, 28.50],
  high: [31.80, 28.10, 30.94],
  close: [28.10, 28.05, 30.62],  // no gaps between candles
  low: [27.50, 27.90, 28.00]
}

// Invalid - First candle is bullish (should be bearish)
var firstBullish = {
  open: [27.10, 26.18, 27.47],   // first candle is bullish
  high: [31.80, 26.91, 30.94],
  close: [31.10, 26.18, 30.62],  // bullish -> doji -> bullish
  low: [27.50, 25.40, 27.03]
}

// Invalid - Third candle is bearish (should be bullish)
var thirdBearish = {
  open: [31.10, 26.18, 30.47],   // third candle is bearish
  high: [31.80, 26.91, 30.94],
  close: [28.10, 26.18, 27.62],  // bearish -> doji -> bearish
  low: [27.50, 25.40, 27.03]
}

// Invalid - Only partial gap (gap on one side only)
var partialGap = {
  open: [31.10, 26.18, 27.47],
  high: [31.80, 26.91, 30.94],
  close: [28.10, 26.18, 30.62],
  low: [27.50, 26.50, 27.03]     // no gap on first side (26.50 not < 27.50)
}

// Edge case - Perfect doji with exact gaps
var perfectPattern = {
  open: [40.00, 35.00, 37.00],
  high: [40.50, 35.00, 42.00],   // perfect doji (open = close = high = low)
  close: [38.00, 35.00, 42.00],
  low: [37.50, 35.00, 36.50]     // clear gaps: 35.00 < 37.50 and 36.50 > 35.00
}

// Invalid - Insufficient data (only 2 candles)
var insufficientData = {
  open: [31.10, 26.18],
  high: [31.80, 26.91],
  close: [28.10, 26.18],
  low: [27.50, 25.40]
}

// Invalid - Empty data
var emptyData = {
  open: [],
  high: [],
  close: [],
  low: []
}

describe('AbandonedBaby : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(validAbandonedBaby);
    fs.writeFileSync(__dirname+'/images/abandonedbaby.svg', imageBuffer);
    
    var imageBuffer2 = drawCandleStick(clearGaps);
    fs.writeFileSync(__dirname+'/images/abandonedbaby_clear_gaps.svg', imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(perfectPattern);
    fs.writeFileSync(__dirname+'/images/abandonedbaby_perfect.svg', imageBuffer3);
  });
  
  // Positive test cases
  it('Check whether the supplied data has AbandonedBaby pattern', function() {
    var abandonedBaby = new AbandonedBaby();
    var result = abandonedBaby.hasPattern(validAbandonedBaby);
    assert.deepEqual(result, true, 'Invalid result for AbandonedBaby');
  });
  
  it('Should identify abandoned baby with clear gaps', function() {
    var abandonedBaby = new AbandonedBaby();
    var result = abandonedBaby.hasPattern(clearGaps);
    assert.deepEqual(result, true, 'Should identify pattern with clear gaps');
  });
  
  it('Should identify abandoned baby with minimal gaps', function() {
    var abandonedBaby = new AbandonedBaby();
    var result = abandonedBaby.hasPattern(minimalGaps);
    assert.deepEqual(result, true, 'Should identify pattern with minimal gaps');
  });
  
  it('Should identify perfect abandoned baby pattern', function() {
    var abandonedBaby = new AbandonedBaby();
    var result = abandonedBaby.hasPattern(perfectPattern);
    assert.deepEqual(result, true, 'Should identify perfect pattern');
  });
  
  // Negative test cases
  it('Should return false when middle candle is not a doji', function() {
    var abandonedBaby = new AbandonedBaby();
    var result = abandonedBaby.hasPattern(noDoji);
    assert.deepEqual(result, false, 'Should return false when no doji in middle');
  });
  
  it('Should return false when there are no gaps', function() {
    var abandonedBaby = new AbandonedBaby();
    var result = abandonedBaby.hasPattern(noGaps);
    assert.deepEqual(result, false, 'Should return false when no gaps exist');
  });
  
  it('Should return false when first candle is bullish', function() {
    var abandonedBaby = new AbandonedBaby();
    var result = abandonedBaby.hasPattern(firstBullish);
    assert.deepEqual(result, false, 'Should return false when first candle is bullish');
  });
  
  it('Should return false when third candle is bearish', function() {
    var abandonedBaby = new AbandonedBaby();
    var result = abandonedBaby.hasPattern(thirdBearish);
    assert.deepEqual(result, false, 'Should return false when third candle is bearish');
  });
  
  it('Should return false when only partial gap exists', function() {
    var abandonedBaby = new AbandonedBaby();
    var result = abandonedBaby.hasPattern(partialGap);
    assert.deepEqual(result, false, 'Should return false for partial gap');
  });
  
  it('Should return false for insufficient data', function() {
    var abandonedBaby = new AbandonedBaby();
    var result = abandonedBaby.hasPattern(insufficientData);
    assert.deepEqual(result, false, 'Should return false for insufficient data');
  });
  
  it('Should return false for empty data', function() {
    var abandonedBaby = new AbandonedBaby();
    var result = abandonedBaby.hasPattern(emptyData);
    assert.deepEqual(result, false, 'Should return false for empty data');
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
    var abandonedBaby = new AbandonedBaby(2);
    var result = abandonedBaby.hasPattern(validAbandonedBaby);
    assert.deepEqual(result, true, 'Should work with custom scale parameter');
  });
  
  // Test function export
  it('Should work using function export', function() {
    var abandonedbaby = require('../../lib/candlestick/AbandonedBaby').abandonedbaby;
    var result = abandonedbaby(validAbandonedBaby);
    assert.deepEqual(result, true, 'Should work using function export');
  });
  
  // Test pattern name
  it('Should have correct pattern name', function() {
    var abandonedBaby = new AbandonedBaby();
    assert.deepEqual(abandonedBaby.name, 'AbandonedBaby', 'Should have correct pattern name');
  });
  
  // Test required count
  it('Should require exactly 3 candles', function() {
    var abandonedBaby = new AbandonedBaby();
    assert.deepEqual(abandonedBaby.requiredCount, 3, 'Should require exactly 3 candles');
  });
  
  // Test multi-day data with pattern at different positions
  it('Should find pattern in multi-day data', function() {
    var multiDayData = {
      open: [35.00, 31.10, 26.18, 27.47, 32.00],   // pattern in middle
      high: [35.50, 31.80, 26.91, 30.94, 32.50],
      close: [34.50, 28.10, 26.18, 30.62, 32.50],
      low: [34.00, 27.50, 25.40, 27.03, 31.50]
    };
    var abandonedBaby = new AbandonedBaby();
    var indices = abandonedBaby.getAllPatternIndex(multiDayData);
    assert.deepEqual(indices.length > 0, true, 'Should find pattern in multi-day data');
  });
});




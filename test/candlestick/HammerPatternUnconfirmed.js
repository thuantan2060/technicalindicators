var HammerPatternUnconfirmed   = require('../../lib/candlestick/HammerPatternUnconfirmed').default;
var assert          = require('assert');
var { drawCandleStick } = require('../helpers/test-helper');
var fs              = require('fs');

// Valid Hammer Pattern (Unconfirmed) test cases
var validBearishHammer = {
  open: [44.00, 40.90, 36.00, 33.10],
  high: [45.00, 41.80, 37.60, 33.10],
  close: [42.00, 36.00, 33.10, 31.50],
  low: [38.00, 28.00, 27.70, 25.00],
};

var validBullishHammer = {
  open: [44.00, 40.90, 36.00, 26.13],
  high: [45.00, 41.80, 37.60, 30.10],
  close: [42.00, 36.00, 33.10, 30.10],
  low: [38.00, 28.00, 27.70, 10.06],
};

var validBearishInvertedHammer = {
  open: [44.00, 40.90, 36.00, 29.10],
  high: [45.00, 41.80, 37.60, 36.10],
  close: [42.00, 36.00, 33.10, 26.13],
  low: [38.00, 28.00, 27.70, 26.13],
};

var validBullishInvertedHammer = {
  open: [44.00, 40.90, 36.00, 26.13],
  high: [45.00, 41.80, 37.60, 36.10],
  close: [42.00, 36.00, 33.10, 29.10],
  low: [38.00, 28.00, 27.70, 26.13],
};

// Invalid test cases
var noDownwardTrend = {
  open: [30.00, 32.00, 34.00, 26.13],
  high: [31.00, 33.00, 35.00, 30.10],
  close: [31.50, 33.50, 35.50, 30.10],
  low: [29.50, 31.50, 33.50, 10.06],
};

var noHammerPattern = {
  open: [44.00, 40.90, 36.00, 30.00],
  high: [45.00, 41.80, 37.60, 32.00],
  close: [42.00, 36.00, 33.10, 31.50],
  low: [38.00, 28.00, 27.70, 29.50],
};

var insufficientData = {
  open: [44.00, 40.90],
  high: [45.00, 41.80],
  close: [42.00, 36.00],
  low: [38.00, 28.00],
};

var invalidOHLCData = {
  open: [44.00, 40.90, 36.00, 33.10],
  high: [45.00, 41.80, 37.60, 30.00], // Invalid: high < open
  close: [42.00, 36.00, 33.10, 29.50],
  low: [38.00, 28.00, 27.70, 26.90],
};

var sidewaysMarket = {
  open: [30.00, 30.10, 29.90, 30.00],
  high: [30.50, 30.60, 30.40, 30.20],
  close: [30.20, 29.80, 30.20, 30.15],
  low: [29.80, 29.60, 29.70, 29.95],
};

// Edge cases
var minimalDowntrend = {
  open: [30.00, 29.95, 29.90, 26.13],
  high: [30.20, 30.15, 30.10, 30.10],
  close: [29.90, 29.85, 29.80, 30.10],
  low: [29.70, 29.65, 29.60, 10.06],
};

var strongDowntrend = {
  open: [50.00, 45.00, 40.00, 26.13],
  high: [50.50, 45.50, 40.50, 30.10],
  close: [44.00, 39.00, 34.00, 30.10],
  low: [43.00, 38.00, 33.00, 10.06],
};

describe('Hammer Pattern (Unconfirmed) : ', function() {
  before(function() {
    var imageBuffer1 = drawCandleStick(validBearishHammer);
    fs.writeFileSync(__dirname+'/images/BearishHammerPatternUnconfirmed.svg',imageBuffer1);
    
    var imageBuffer2 = drawCandleStick(validBullishHammer);
    fs.writeFileSync(__dirname+'/images/BullishHammerPatternUnconfirmed.svg',imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(validBearishInvertedHammer);
    fs.writeFileSync(__dirname+'/images/BearishInvertedHammerPatternUnconfirmed.svg',imageBuffer3);
    
    var imageBuffer4 = drawCandleStick(validBullishInvertedHammer);
    fs.writeFileSync(__dirname+'/images/BullishInvertedHammerPatternUnconfirmed.svg',imageBuffer4);
  });
  
  // Positive test cases
  it('Should identify bearish hammer pattern (unconfirmed)', function() {
    var hammer = new HammerPatternUnconfirmed();
    var result = hammer.hasPattern(validBearishHammer);
    assert.deepEqual(result, true, 'Should identify bearish hammer pattern');
  });
  
  it('Should identify bullish hammer pattern (unconfirmed)', function() {
    var hammer = new HammerPatternUnconfirmed();
    var result = hammer.hasPattern(validBullishHammer);
    assert.deepEqual(result, true, 'Should identify bullish hammer pattern');
  });
  
  it('Should identify bearish inverted hammer pattern (unconfirmed)', function() {
    var hammer = new HammerPatternUnconfirmed();
    var result = hammer.hasPattern(validBearishInvertedHammer);
    assert.deepEqual(result, true, 'Should identify bearish inverted hammer pattern');
  });
  
  it('Should identify bullish inverted hammer pattern (unconfirmed)', function() {
    var hammer = new HammerPatternUnconfirmed();
    var result = hammer.hasPattern(validBullishInvertedHammer);
    assert.deepEqual(result, true, 'Should identify bullish inverted hammer pattern');
  });
  
  it('Should identify pattern with minimal downtrend', function() {
    var hammer = new HammerPatternUnconfirmed();
    var result = hammer.hasPattern(minimalDowntrend);
    assert.deepEqual(result, true, 'Should identify pattern with minimal downtrend');
  });
  
  it('Should identify pattern with strong downtrend', function() {
    var hammer = new HammerPatternUnconfirmed();
    var result = hammer.hasPattern(strongDowntrend);
    assert.deepEqual(result, true, 'Should identify pattern with strong downtrend');
  });
  
  // Negative test cases
  it('Should return false when there is no downward trend', function() {
    var hammer = new HammerPatternUnconfirmed();
    var result = hammer.hasPattern(noDownwardTrend);
    assert.deepEqual(result, false, 'Should return false when no downward trend');
  });
  
  it('Should return false when there is no hammer pattern', function() {
    var hammer = new HammerPatternUnconfirmed();
    var result = hammer.hasPattern(noHammerPattern);
    assert.deepEqual(result, false, 'Should return false when no hammer pattern');
  });
  
  it('Should return false with insufficient data', function() {
    var hammer = new HammerPatternUnconfirmed();
    var result = hammer.hasPattern(insufficientData);
    assert.deepEqual(result, false, 'Should return false with insufficient data');
  });
  
  it('Should return false with invalid OHLC data', function() {
    var hammer = new HammerPatternUnconfirmed();
    var result = hammer.hasPattern(invalidOHLCData);
    assert.deepEqual(result, false, 'Should return false with invalid OHLC data');
  });
  
  it('Should return false in sideways market', function() {
    var hammer = new HammerPatternUnconfirmed();
    var result = hammer.hasPattern(sidewaysMarket);
    assert.deepEqual(result, false, 'Should return false in sideways market');
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
    var hammer = new HammerPatternUnconfirmed(2);
    var result = hammer.hasPattern(validBearishHammer);
    assert.deepEqual(result, true, 'Should work with custom scale parameter');
  });
  
  // Test function export
  it('Should work using function export', function() {
    var hammerpatternunconfirmed = require('../../lib/candlestick/HammerPatternUnconfirmed').hammerpatternunconfirmed;
    var result = hammerpatternunconfirmed(validBearishHammer);
    assert.deepEqual(result, true, 'Should work using function export');
  });
  
  it('Should work using function export with custom scale', function() {
    var hammerpatternunconfirmed = require('../../lib/candlestick/HammerPatternUnconfirmed').hammerpatternunconfirmed;
    var result = hammerpatternunconfirmed(validBearishHammer, 2);
    assert.deepEqual(result, true, 'Should work using function export with custom scale');
  });
  
  // Edge cases
  it('Should handle empty data gracefully', function() {
    var hammer = new HammerPatternUnconfirmed();
    var emptyData = { open: [], high: [], close: [], low: [] };
    var result = hammer.hasPattern(emptyData);
    assert.deepEqual(result, false, 'Should handle empty data gracefully');
  });
  
  it('Should handle undefined data gracefully', function() {
    var hammer = new HammerPatternUnconfirmed();
    var result = hammer.hasPattern(undefined);
    assert.deepEqual(result, false, 'Should handle undefined data gracefully');
  });
  
  it('Should handle mismatched array lengths', function() {
    var hammer = new HammerPatternUnconfirmed();
    var mismatchedData = {
      open: [44.00, 40.90, 36.00],
      high: [45.00, 41.80],
      close: [42.00, 36.00, 33.10, 29.50],
      low: [38.00, 28.00, 27.70, 26.90, 25.00],
    };
    var result = hammer.hasPattern(mismatchedData);
    assert.deepEqual(result, false, 'Should handle mismatched array lengths');
  });
  
  // Test required count
  it('Should have correct required count for unconfirmed pattern', function() {
    var hammer = new HammerPatternUnconfirmed();
    assert.deepEqual(hammer.requiredCount, 4, 'Should require 4 candles for unconfirmed pattern');
  });
});

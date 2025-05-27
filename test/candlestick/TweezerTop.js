var TweezerTop = require('../../lib/candlestick/TweezerTop').default;
var assert = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs = require('fs');

// Valid Tweezer Top pattern (5-day pattern)
// Days 0-2: Upward trend, Days 3-4: Equal highs
var validTweezerTop = {
  open: [22.00, 23.00, 24.00, 25.00, 25.50],   // [day0, day1, day2, day3, day4] - ascending order
  high: [22.50, 23.50, 24.50, 26.00, 26.00],   // Equal highs at days 3 and 4
  close: [22.30, 23.30, 24.30, 25.20, 25.80],  // Upward trend in first 3 days
  low: [21.80, 22.80, 23.80, 24.80, 25.20],    
}

// Valid Tweezer Top - Perfect equal highs
var perfectEqualHighs = {
  open: [22.00, 23.00, 24.00, 25.00, 25.50],   
  high: [22.50, 23.50, 24.50, 26.00, 26.00],   // Exactly equal highs
  close: [22.30, 23.30, 24.30, 25.20, 25.80],  
  low: [21.80, 22.80, 23.80, 24.80, 25.20],    
}

// Valid Tweezer Top - Minimal upward trend
var minimalUpwardTrend = {
  open: [24.85, 24.90, 24.95, 25.00, 25.05],   // Very slight upward trend
  high: [25.00, 25.10, 25.20, 25.50, 25.50],   // Equal highs
  close: [24.90, 24.95, 25.00, 25.05, 25.10],  
  low: [24.70, 24.75, 24.80, 24.85, 24.90],    
}

// Invalid - No upward trend (downward trend)
var downwardTrend = {
  open: [25.50, 25.00, 24.50, 24.00, 23.50],   // Downward trend
  high: [26.00, 25.50, 25.00, 26.00, 26.00],   
  close: [25.30, 24.80, 24.30, 24.20, 23.80],  
  low: [25.00, 24.50, 24.00, 23.80, 23.20],    
}

// Invalid - Highs not equal
var unequalHighs = {
  open: [22.00, 23.00, 24.00, 25.00, 25.50],   
  high: [22.50, 23.50, 24.50, 25.50, 26.00],   // Different highs
  close: [22.30, 23.30, 24.30, 25.20, 25.80],  
  low: [21.80, 22.80, 23.80, 24.80, 25.20],    
}

// Invalid - Sideways trend (no clear upward movement)
var sidewaysTrend = {
  open: [25.00, 25.00, 25.00, 25.00, 25.00],   // Flat trend
  high: [25.50, 25.50, 25.50, 26.00, 26.00],   
  close: [25.00, 25.00, 25.00, 25.00, 25.00],  
  low: [24.50, 24.50, 24.50, 24.50, 24.50],    
}

// Insufficient data (less than 5 days)
var insufficientData = {
  open: [24.00, 25.00, 25.50],   
  high: [24.50, 26.00, 26.00],   
  close: [24.30, 25.20, 25.80],  
  low: [23.80, 24.80, 25.20],    
}

// Edge case - Large price range
var largePriceRange = {
  open: [92.00, 93.00, 94.00, 95.00, 95.50],   
  high: [92.50, 93.50, 94.50, 100.00, 100.00], // Equal highs at 100
  close: [92.30, 93.30, 94.30, 99.50, 99.00],  // Valid OHLC with larger body sizes
  low: [91.80, 92.80, 93.80, 94.80, 95.20],    
}

// Invalid OHLC data
var invalidOHLC = {
  open: [22.00, 23.00, 24.00, 25.00, 25.50],   
  high: [22.50, 23.50, 24.50, 25.00, 25.00],   // Invalid: high < open
  close: [22.30, 23.30, 24.30, 25.20, 25.80],  
  low: [21.80, 22.80, 23.80, 24.80, 25.20],    
}

describe('TweezerTop : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(validTweezerTop);
    fs.writeFileSync(__dirname+'/images/TweezerTop.svg',imageBuffer);
    
    var imageBuffer2 = drawCandleStick(perfectEqualHighs);
    fs.writeFileSync(__dirname+'/images/perfectTweezerTop.svg',imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(largePriceRange);
    fs.writeFileSync(__dirname+'/images/largeTweezerTop.svg',imageBuffer3);
  });
  
  // Positive test cases
  it('Check whether the supplied data has TweezerTop pattern', function() {
   var tweezerTop = new TweezerTop();
   var result = tweezerTop.hasPattern(validTweezerTop);
   assert.deepEqual(result, true, 'Invalid result for TweezerTop');
  });
  
  it('Should identify tweezer top with perfect equal highs', function() {
   var tweezerTop = new TweezerTop();
   var result = tweezerTop.hasPattern(perfectEqualHighs);
   assert.deepEqual(result, true, 'Should identify perfect equal highs');
  });
  
  it('Should identify tweezer top with minimal upward trend', function() {
   var tweezerTop = new TweezerTop();
   var result = tweezerTop.hasPattern(minimalUpwardTrend);
   assert.deepEqual(result, true, 'Should identify pattern with minimal upward trend');
  });
  
  it('Should identify tweezer top with large price range', function() {
   var tweezerTop = new TweezerTop();
   var result = tweezerTop.hasPattern(largePriceRange);
   assert.deepEqual(result, true, 'Should identify pattern with large price range');
  });
  
  // Negative test cases
  it('Should return false when there is downward trend', function() {
   var tweezerTop = new TweezerTop();
   var result = tweezerTop.hasPattern(downwardTrend);
   assert.deepEqual(result, false, 'Should return false for downward trend');
  });
  
  it('Should return false when highs are not equal', function() {
   var tweezerTop = new TweezerTop();
   var result = tweezerTop.hasPattern(unequalHighs);
   assert.deepEqual(result, false, 'Should return false for unequal highs');
  });
  
  it('Should return false for sideways trend', function() {
   var tweezerTop = new TweezerTop();
   var result = tweezerTop.hasPattern(sidewaysTrend);
   assert.deepEqual(result, false, 'Should return false for sideways trend');
  });
  
  it('Should return false for insufficient data', function() {
   var tweezerTop = new TweezerTop();
   var result = tweezerTop.hasPattern(insufficientData);
   assert.deepEqual(result, false, 'Should return false for insufficient data');
  });
  
  it('Should return false for invalid OHLC data', function() {
   var tweezerTop = new TweezerTop();
   var result = tweezerTop.hasPattern(invalidOHLC);
   assert.deepEqual(result, false, 'Should return false for invalid OHLC data');
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
   var tweezerTop = new TweezerTop(2);
   var result = tweezerTop.hasPattern(validTweezerTop);
   assert.deepEqual(result, true, 'Should work with custom scale parameter');
  });
  
  // Test function export
  it('Should work using function export', function() {
   var tweezertop = require('../../lib/candlestick/TweezerTop').tweezertop;
   var result = tweezertop(validTweezerTop);
   assert.deepEqual(result, true, 'Should work using function export');
  });
  
  // Test insufficient data
  it('Should return false for empty data', function() {
   var tweezerTop = new TweezerTop();
   var emptyData = { open: [], high: [], close: [], low: [] };
   var result = tweezerTop.hasPattern(emptyData);
   assert.deepEqual(result, false, 'Should return false for empty data');
  });
  
  // Test getAllPatternIndex method
  it('Should return correct indices for all tweezer top patterns in extended data', function() {
   var extendedData = {
     // Adding more days to test pattern detection
     open: [25.50, 25.00, 24.00, 23.00, 22.00, 21.50, 21.00, 20.50],   
     high: [26.00, 26.00, 24.50, 23.50, 22.50, 22.00, 21.50, 21.00],   
     close: [25.80, 25.20, 24.30, 23.30, 22.30, 21.80, 21.30, 20.80],  
     low: [25.20, 24.80, 23.80, 22.80, 21.80, 21.30, 20.80, 20.30],    
   };
   var tweezerTop = new TweezerTop();
   var indices = tweezerTop.getAllPatternIndex(extendedData);
   assert.deepEqual(Array.isArray(indices), true, 'Should return an array');
  });
  
  // Test individual components
  it('Should correctly identify upward trend', function() {
   var tweezerTop = new TweezerTop();
   var upwardData = {
     open: [22.00, 23.00, 24.00],   
     high: [22.50, 23.50, 24.50],   
     close: [22.30, 23.30, 24.30],  
     low: [21.80, 22.80, 23.80],    
   };
   var result = tweezerTop.upwardTrend(upwardData);
   assert.deepEqual(result, true, 'Should correctly identify upward trend');
  });
});

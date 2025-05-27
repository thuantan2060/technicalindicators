var GraveStoneDoji = require('../../lib/candlestick/GraveStoneDoji').default;
var assert = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs = require('fs');

// Valid GraveStone Doji - Original test case
var validGraveStone = {
  open: [30.10],
  high: [36.13],  // Long upper shadow
  close: [30.13], // Close ≈ open (doji)
  low: [30.12],   // Low ≈ open/close
}

// Valid GraveStone Doji - Perfect pattern
var perfectGraveStone = {
  open: [25.00],
  high: [28.00],  // Long upper shadow
  close: [25.00], // Perfect doji
  low: [25.00],   // Low = open = close
}

// Valid GraveStone Doji - Minimal differences
var minimalDifference = {
  open: [30.100],
  high: [32.500], // Upper shadow
  close: [30.099], // Very close to open
  low: [30.101],  // Very close to open/close
}

// Valid GraveStone Doji - Large price range
var largePriceRange = {
  open: [100.00],
  high: [105.00], // Long upper shadow
  close: [100.02], 
  low: [100.01],  
}

// Invalid - Regular doji (has lower shadow)
var regularDoji = {
  open: [30.10],
  high: [32.10],  // Upper shadow
  close: [30.13], 
  low: [28.10],   // Lower shadow present
}

// Invalid - Bullish candle
var bullishCandle = {
  open: [30.00],
  high: [32.50],  
  close: [30.40], // Close > open
  low: [30.00],   
}

// Invalid - Bearish candle
var bearishCandle = {
  open: [30.40],
  high: [32.50],  
  close: [30.00], // Close < open
  low: [30.00],   
}

// Invalid - No upper shadow (high equals open/close)
var noUpperShadow = {
  open: [30.10],
  high: [30.13],  // No significant upper shadow
  close: [30.10], 
  low: [30.10],   
}

// Invalid - DragonFly Doji (lower shadow, no upper)
var dragonFlyPattern = {
  open: [30.10],
  high: [30.13],  // High ≈ open/close
  close: [30.10], 
  low: [28.10],   // Lower shadow
}

// Invalid - High less than open/close (invalid OHLC)
var invalidOHLC = {
  open: [30.10],
  high: [29.50],  // Invalid: high < open
  close: [30.10], 
  low: [30.10],   
}

// Invalid - Low greater than open/close (invalid OHLC)
var invalidLow = {
  open: [30.10],
  high: [32.13],  
  close: [30.10], 
  low: [31.00],   // Invalid: low > open/close
}

// Edge case - Very small upper shadow
var smallUpperShadow = {
  open: [30.10],
  high: [30.15],  // Small but present upper shadow
  close: [30.10], 
  low: [30.09],   
}

// Edge case - Single point (all OHLC equal)
var singlePoint = {
  open: [30.10],
  high: [30.10],
  close: [30.10],
  low: [30.10],
}

describe('GraveStoneDoji : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(validGraveStone);
    fs.writeFileSync(__dirname+'/images/GraveStoneDoji.svg',imageBuffer);
    
    var imageBuffer2 = drawCandleStick(perfectGraveStone);
    fs.writeFileSync(__dirname+'/images/perfectGraveStoneDoji.svg',imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(largePriceRange);
    fs.writeFileSync(__dirname+'/images/largeGraveStoneDoji.svg',imageBuffer3);
  });
  
  // Positive test cases
  it('Check whether the supplied data has GraveStoneDoji pattern', function() {
   var graveStoneDoji = new GraveStoneDoji();
   var result = graveStoneDoji.hasPattern(validGraveStone);
   assert.deepEqual(result, true, 'Invalid result for GraveStoneDoji');
  });
  
  it('Should identify perfect gravestone doji pattern', function() {
   var graveStoneDoji = new GraveStoneDoji();
   var result = graveStoneDoji.hasPattern(perfectGraveStone);
   assert.deepEqual(result, true, 'Should identify perfect gravestone doji pattern');
  });
  
  it('Should identify gravestone doji with minimal differences', function() {
   var graveStoneDoji = new GraveStoneDoji();
   var result = graveStoneDoji.hasPattern(minimalDifference);
   assert.deepEqual(result, true, 'Should identify pattern with minimal differences');
  });
  
  it('Should identify gravestone doji with large price range', function() {
   var graveStoneDoji = new GraveStoneDoji();
   var result = graveStoneDoji.hasPattern(largePriceRange);
   assert.deepEqual(result, true, 'Should identify pattern with large price range');
  });
  
  it('Should identify gravestone doji with small upper shadow', function() {
   var graveStoneDoji = new GraveStoneDoji();
   var result = graveStoneDoji.hasPattern(smallUpperShadow);
   assert.deepEqual(result, true, 'Should identify pattern with small upper shadow');
  });
  
  // Negative test cases
  it('Should return false for regular doji with lower shadow', function() {
   var graveStoneDoji = new GraveStoneDoji();
   var result = graveStoneDoji.hasPattern(regularDoji);
   assert.deepEqual(result, false, 'Should return false for regular doji');
  });
  
  it('Should return false for bullish candle', function() {
   var graveStoneDoji = new GraveStoneDoji();
   var result = graveStoneDoji.hasPattern(bullishCandle);
   assert.deepEqual(result, false, 'Should return false for bullish candle');
  });
  
  it('Should return false for bearish candle', function() {
   var graveStoneDoji = new GraveStoneDoji();
   var result = graveStoneDoji.hasPattern(bearishCandle);
   assert.deepEqual(result, false, 'Should return false for bearish candle');
  });
  
  it('Should return false when there is no upper shadow', function() {
   var graveStoneDoji = new GraveStoneDoji();
   var result = graveStoneDoji.hasPattern(noUpperShadow);
   assert.deepEqual(result, false, 'Should return false when no upper shadow');
  });
  
  it('Should return false for dragonfly doji pattern', function() {
   var graveStoneDoji = new GraveStoneDoji();
   var result = graveStoneDoji.hasPattern(dragonFlyPattern);
   assert.deepEqual(result, false, 'Should return false for dragonfly pattern');
  });
  
  it('Should return false for invalid OHLC data (high < open)', function() {
   var graveStoneDoji = new GraveStoneDoji();
   var result = graveStoneDoji.hasPattern(invalidOHLC);
   assert.deepEqual(result, false, 'Should return false for invalid OHLC data');
  });
  
  it('Should return false for invalid OHLC data (low > open)', function() {
   var graveStoneDoji = new GraveStoneDoji();
   var result = graveStoneDoji.hasPattern(invalidLow);
   assert.deepEqual(result, false, 'Should return false for invalid OHLC data');
  });
  
  it('Should return false for single point (no range)', function() {
   var graveStoneDoji = new GraveStoneDoji();
   var result = graveStoneDoji.hasPattern(singlePoint);
   assert.deepEqual(result, false, 'Should return false for single point');
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
   var graveStoneDoji = new GraveStoneDoji(2);
   var result = graveStoneDoji.hasPattern(validGraveStone);
   assert.deepEqual(result, true, 'Should work with custom scale parameter');
  });
  
  // Test function export
  it('Should work using function export', function() {
   var gravestonedoji = require('../../lib/candlestick/GraveStoneDoji').gravestonedoji;
   var result = gravestonedoji(validGraveStone);
   assert.deepEqual(result, true, 'Should work using function export');
  });
  
  // Test with function export and custom scale
  it('Should work using function export with custom scale', function() {
   var gravestonedoji = require('../../lib/candlestick/GraveStoneDoji').gravestonedoji;
   var result = gravestonedoji(validGraveStone, 2);
   assert.deepEqual(result, true, 'Should work using function export with custom scale');
  });
  
  // Test edge cases
  it('Should handle empty data gracefully', function() {
   var graveStoneDoji = new GraveStoneDoji();
   var emptyData = { open: [], high: [], close: [], low: [] };
   var result = graveStoneDoji.hasPattern(emptyData);
   assert.deepEqual(result, false, 'Should handle empty data gracefully');
  });
  
  it('Should handle undefined data gracefully', function() {
   var graveStoneDoji = new GraveStoneDoji();
   var result = graveStoneDoji.hasPattern(undefined);
   assert.deepEqual(result, false, 'Should handle undefined data gracefully');
  });
});

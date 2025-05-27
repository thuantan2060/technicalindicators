var BearishMarubozu = require('../../lib/candlestick/BearishMarubozu').default;
var assert = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs = require('fs');

// Valid Bearish Marubozu - Original test case
var validBearishMarubozu = {
  close: [30.50],  // Bearish: close < open
  open: [31.23],   // Open equals high
  high: [31.23],   // High equals open
  low: [30.50],    // Low equals close
}

// Valid Bearish Marubozu - Perfect marubozu
var perfectMarubozu = {
  open: [25.00],   // Open equals high
  high: [25.00],   // High equals open
  close: [20.00],  // Bearish candle
  low: [20.00],    // Low equals close
}

// Valid Bearish Marubozu - Large price range
var largePriceRange = {
  open: [100.00],  // Open equals high
  high: [100.00],  // High equals open
  close: [90.00],  // Bearish candle
  low: [90.00],    // Low equals close
}

// Valid Bearish Marubozu - Small price range
var smallPriceRange = {
  open: [20.10],   // Open equals high
  high: [20.10],   // High equals open
  close: [20.05],  // Small bearish candle
  low: [20.05],    // Low equals close
}

// Invalid - Bullish candle (close > open)
var bullishCandle = {
  open: [30.50],   
  high: [31.23],   
  close: [31.23],  // Bullish: close > open
  low: [30.50],    
}

// Invalid - Open not equal to high
var openNotEqualHigh = {
  open: [30.50],   
  high: [31.50],   // High > open (has upper shadow)
  close: [30.00],  
  low: [30.00],    
}

// Invalid - Close not equal to low
var closeNotEqualLow = {
  open: [31.23],   
  high: [31.23],   
  close: [30.50],  
  low: [30.00],    // Low < close (has lower shadow)
}

// Invalid - Has both upper and lower shadows
var hasShadows = {
  open: [31.00],   
  high: [31.50],   // Upper shadow
  close: [30.50],  
  low: [30.00],    // Lower shadow
}

// Invalid - Doji (open equals close)
var dojiCandle = {
  open: [30.50],   
  high: [30.50],   
  close: [30.50],  // Doji: open = close
  low: [30.50],    
}

// Invalid - High less than open (invalid OHLC)
var invalidOHLC = {
  open: [31.23],   
  high: [31.00],   // Invalid: high < open
  close: [30.50],  
  low: [30.50],    
}

// Invalid - Low greater than close (invalid OHLC)
var invalidLow = {
  open: [31.23],   
  high: [31.23],   
  close: [30.50],  
  low: [30.80],    // Invalid: low > close
}

// Valid - Approximate equality test
var approximateEquality = {
  open: [31.23],   
  high: [31.24],   // Very close to open (should pass approximateEqual)
  close: [30.50],  
  low: [30.49],    // Very close to close (should pass approximateEqual)
}

// Invalid - Small upper shadow
var smallUpperShadow = {
  open: [31.20],   
  high: [31.23],   // Small upper shadow
  close: [30.50],  
  low: [30.50],    
}

// Invalid - Small lower shadow
var smallLowerShadow = {
  open: [31.23],   
  high: [31.23],   
  close: [30.50],  
  low: [30.45],    // Small lower shadow
}

// Invalid - Empty data
var emptyData = {
  open: [],
  high: [],
  close: [],
  low: []
}

// Edge case - Very small body
var verySmallBody = {
  open: [20.01],   
  high: [20.01],   
  close: [20.00],  // Very small bearish body
  low: [20.00],    
}

describe('BearishMarubozu : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(validBearishMarubozu);
    fs.writeFileSync(__dirname+'/images/BearishMarubozu.svg', imageBuffer);
    
    var imageBuffer2 = drawCandleStick(perfectMarubozu);
    fs.writeFileSync(__dirname+'/images/perfectBearishMarubozu.svg', imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(largePriceRange);
    fs.writeFileSync(__dirname+'/images/largeBearishMarubozu.svg', imageBuffer3);
  });
  
  // Positive test cases
  it('Check whether the supplied data has BearishMarubozu pattern', function() {
    var bearishMarubozu = new BearishMarubozu();
    var result = bearishMarubozu.hasPattern(validBearishMarubozu);
    assert.deepEqual(result, true, 'Invalid result for BearishMarubozu');
  });
  
  it('Should identify perfect marubozu pattern', function() {
    var bearishMarubozu = new BearishMarubozu();
    var result = bearishMarubozu.hasPattern(perfectMarubozu);
    assert.deepEqual(result, true, 'Should identify perfect marubozu pattern');
  });
  
  it('Should identify marubozu with large price range', function() {
    var bearishMarubozu = new BearishMarubozu();
    var result = bearishMarubozu.hasPattern(largePriceRange);
    assert.deepEqual(result, true, 'Should identify marubozu with large price range');
  });
  
  it('Should identify marubozu with small price range', function() {
    var bearishMarubozu = new BearishMarubozu();
    var result = bearishMarubozu.hasPattern(smallPriceRange);
    assert.deepEqual(result, true, 'Should identify marubozu with small price range');
  });
  
  it('Should handle approximate equality for open/high and close/low', function() {
    var bearishMarubozu = new BearishMarubozu();
    var result = bearishMarubozu.hasPattern(approximateEquality);
    assert.deepEqual(result, true, 'Should handle approximate equality');
  });
  
  it('Should identify very small body marubozu', function() {
    var bearishMarubozu = new BearishMarubozu();
    var result = bearishMarubozu.hasPattern(verySmallBody);
    assert.deepEqual(result, true, 'Should identify very small body marubozu');
  });
  
  // Negative test cases
  it('Should return false for bullish candle', function() {
    var bearishMarubozu = new BearishMarubozu();
    var result = bearishMarubozu.hasPattern(bullishCandle);
    assert.deepEqual(result, false, 'Should return false for bullish candle');
  });
  
  it('Should return false when open does not equal high', function() {
    var bearishMarubozu = new BearishMarubozu();
    var result = bearishMarubozu.hasPattern(openNotEqualHigh);
    assert.deepEqual(result, false, 'Should return false when open != high');
  });
  
  it('Should return false when close does not equal low', function() {
    var bearishMarubozu = new BearishMarubozu();
    var result = bearishMarubozu.hasPattern(closeNotEqualLow);
    assert.deepEqual(result, false, 'Should return false when close != low');
  });
  
  it('Should return false when candle has shadows', function() {
    var bearishMarubozu = new BearishMarubozu();
    var result = bearishMarubozu.hasPattern(hasShadows);
    assert.deepEqual(result, false, 'Should return false when candle has shadows');
  });
  
  it('Should return false for doji candle', function() {
    var bearishMarubozu = new BearishMarubozu();
    var result = bearishMarubozu.hasPattern(dojiCandle);
    assert.deepEqual(result, false, 'Should return false for doji candle');
  });
  
  it('Should return false for invalid OHLC data (high < open)', function() {
    var bearishMarubozu = new BearishMarubozu();
    var result = bearishMarubozu.hasPattern(invalidOHLC);
    assert.deepEqual(result, false, 'Should return false for invalid OHLC data');
  });
  
  it('Should return false for invalid OHLC data (low > close)', function() {
    var bearishMarubozu = new BearishMarubozu();
    var result = bearishMarubozu.hasPattern(invalidLow);
    assert.deepEqual(result, false, 'Should return false for invalid low');
  });
  
  it('Should return false when candle has small upper shadow', function() {
    var bearishMarubozu = new BearishMarubozu();
    var result = bearishMarubozu.hasPattern(smallUpperShadow);
    assert.deepEqual(result, false, 'Should return false for small upper shadow');
  });
  
  it('Should return false when candle has small lower shadow', function() {
    var bearishMarubozu = new BearishMarubozu();
    var result = bearishMarubozu.hasPattern(smallLowerShadow);
    assert.deepEqual(result, false, 'Should return false for small lower shadow');
  });
  
  it('Should return false for empty data', function() {
    var bearishMarubozu = new BearishMarubozu();
    var result = bearishMarubozu.hasPattern(emptyData);
    assert.deepEqual(result, false, 'Should return false for empty data');
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
    var bearishMarubozu = new BearishMarubozu(2);
    var result = bearishMarubozu.hasPattern(validBearishMarubozu);
    assert.deepEqual(result, true, 'Should work with custom scale parameter');
  });
  
  // Test function export
  it('Should work using function export', function() {
    var bearishmarubozu = require('../../lib/candlestick/BearishMarubozu').bearishmarubozu;
    var result = bearishmarubozu(validBearishMarubozu);
    assert.deepEqual(result, true, 'Should work using function export');
  });
  
  // Test pattern name
  it('Should have correct pattern name', function() {
    var bearishMarubozu = new BearishMarubozu();
    assert.deepEqual(bearishMarubozu.name, 'BearishMarubozu', 'Should have correct pattern name');
  });
  
  // Test required count
  it('Should require exactly 1 candle', function() {
    var bearishMarubozu = new BearishMarubozu();
    assert.deepEqual(bearishMarubozu.requiredCount, 1, 'Should require exactly 1 candle');
  });
  
  // Test multi-day data with pattern at different positions
  it('Should find pattern in multi-day data', function() {
    var multiDayData = {
      open: [25.00, 31.23, 35.00],   // marubozu in middle
      high: [25.50, 31.23, 35.50],
      close: [24.50, 30.50, 34.50],
      low: [24.00, 30.50, 34.00]
    };
    var bearishMarubozu = new BearishMarubozu();
    var indices = bearishMarubozu.getAllPatternIndex(multiDayData);
    assert.deepEqual(indices.length > 0, true, 'Should find pattern in multi-day data');
  });
  
  // Test all conditions together
  it('Should validate all marubozu conditions simultaneously', function() {
    // Test case that meets some but not all conditions
    var partialMarubozu = {
      open: [31.23],   // Open equals high ✓
      high: [31.23],   // High equals open ✓
      close: [30.60],  // Bearish ✓
      low: [30.50],    // Low does not equal close ✗
    };
    var bearishMarubozu = new BearishMarubozu();
    var result = bearishMarubozu.hasPattern(partialMarubozu);
    assert.deepEqual(result, false, 'Should validate all marubozu conditions');
  });
  
  // Test edge case with exact equality
  it('Should handle exact equality conditions', function() {
    var exactEquality = {
      open: [30.00],   
      high: [30.00],   // Exactly equal
      close: [29.00],  
      low: [29.00],    // Exactly equal
    };
    var bearishMarubozu = new BearishMarubozu();
    var result = bearishMarubozu.hasPattern(exactEquality);
    assert.deepEqual(result, true, 'Should handle exact equality conditions');
  });
});

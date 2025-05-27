var BearishHammer = require('../../lib/candlestick/BearishHammerStick').default;
var assert = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs = require('fs');

// Valid Bearish Hammer - Original test case
var validBearishHammer = {
  open: [30.10],
  high: [30.10],  // Open equals high (small upper shadow)
  close: [26.13], // Bearish: close < open
  low: [10.06],   // Long lower shadow
}

// Valid Bearish Hammer - Perfect hammer
var perfectHammer = {
  open: [25.00],
  high: [25.00],  // Open equals high exactly
  close: [23.00], // Bearish candle
  low: [19.00],   // Long lower shadow: 2 * 2.00 <= 4.00
}

// Valid Bearish Hammer - Minimal body
var minimalBody = {
  open: [30.05],
  high: [30.05],  // Very small upper shadow
  close: [30.00], // Very small body
  low: [28.50],   // Long lower shadow
}

// Valid Bearish Hammer - Larger price range
var largePriceRange = {
  open: [100.00],
  high: [100.00], // Open equals high
  close: [98.00], // Bearish
  low: [95.00],   // Long lower shadow: 2 * 2.00 <= 3.00
}

// Invalid - Bullish candle (close > open)
var bullishCandle = {
  open: [20.40],
  high: [20.40],  
  close: [20.60], // Bullish
  low: [19.50],   
}

// Invalid - Open not equal to high
var openNotEqualHigh = {
  open: [20.40],
  high: [20.80],  // High > open
  close: [20.00], 
  low: [19.50],   
}

// Invalid - Lower shadow too short
var shortLowerShadow = {
  open: [20.60],
  high: [20.60],  
  close: [20.40], 
  low: [20.30],   // Short lower shadow: 2 * 0.20 > 0.10
}

// Invalid - Body too large compared to shadow
var largeBodySmallShadow = {
  open: [22.00],
  high: [22.00],  
  close: [20.00], 
  low: [19.50],   // Body too large: 2 * 2.00 > 0.50
}

// Edge case - Doji-like (very small body)
var dojiLike = {
  open: [20.61],
  high: [20.61],  // Very small body
  close: [20.60], 
  low: [19.50],   
}

// Invalid - High less than open (invalid OHLC)
var invalidOHLC = {
  open: [20.60],
  high: [20.50],  // Invalid: high < open
  close: [20.40], 
  low: [19.50],   
}

// Invalid - Low greater than close (invalid OHLC)
var invalidLow = {
  open: [20.60],
  high: [20.60],  
  close: [20.40], 
  low: [20.80],   // Invalid: low > close
}

// Valid - Approximate equality test
var approximateEquality = {
  open: [30.10],
  high: [30.11],  // Very close to open (should pass approximateEqual)
  close: [26.13], 
  low: [20.06],   
}

// Invalid - Insufficient lower shadow relative to scale
var insufficientShadow = {
  open: [20.10],
  high: [20.10],  
  close: [20.05], 
  low: [20.00],   // Very small range, insufficient shadow
}

// Invalid - Empty data
var emptyData = {
  open: [],
  high: [],
  close: [],
  low: []
}

describe('Bearish Hammer (Single Stick) : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(validBearishHammer);
    fs.writeFileSync(__dirname+'/images/BearishHammerStick.svg', imageBuffer);
    
    var imageBuffer2 = drawCandleStick(perfectHammer);
    fs.writeFileSync(__dirname+'/images/perfectBearishHammer.svg', imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(largePriceRange);
    fs.writeFileSync(__dirname+'/images/largeBearishHammer.svg', imageBuffer3);
  });
  
  // Positive test cases
  it('Check whether the supplied data has Bearish Hammer (Single Stick) pattern', function() {
    var bearishHammer = new BearishHammer();
    var result = bearishHammer.hasPattern(validBearishHammer);
    assert.deepEqual(result, true, 'Invalid result for Bearish Hammer (Single Stick)');
  });
  
  it('Should identify perfect hammer pattern', function() {
    var bearishHammer = new BearishHammer();
    var result = bearishHammer.hasPattern(perfectHammer);
    assert.deepEqual(result, true, 'Should identify perfect hammer pattern');
  });
  
  it('Should identify hammer with minimal body', function() {
    var bearishHammer = new BearishHammer();
    var result = bearishHammer.hasPattern(minimalBody);
    assert.deepEqual(result, true, 'Should identify hammer with minimal body');
  });
  
  it('Should identify hammer with large price range', function() {
    var bearishHammer = new BearishHammer();
    var result = bearishHammer.hasPattern(largePriceRange);
    assert.deepEqual(result, true, 'Should identify hammer with large price range');
  });
  
  it('Should identify doji-like hammer pattern', function() {
    var bearishHammer = new BearishHammer();
    var result = bearishHammer.hasPattern(dojiLike);
    assert.deepEqual(result, true, 'Should identify doji-like hammer pattern');
  });
  
  it('Should handle approximate equality for open and high', function() {
    var bearishHammer = new BearishHammer();
    var result = bearishHammer.hasPattern(approximateEquality);
    assert.deepEqual(result, true, 'Should handle approximate equality');
  });
  
  // Negative test cases
  it('Should return false for bullish candle', function() {
    var bearishHammer = new BearishHammer();
    var result = bearishHammer.hasPattern(bullishCandle);
    assert.deepEqual(result, false, 'Should return false for bullish candle');
  });
  
  it('Should return false when open does not equal high', function() {
    var bearishHammer = new BearishHammer();
    var result = bearishHammer.hasPattern(openNotEqualHigh);
    assert.deepEqual(result, false, 'Should return false when open != high');
  });
  
  it('Should return false when lower shadow is too short', function() {
    var bearishHammer = new BearishHammer();
    var result = bearishHammer.hasPattern(shortLowerShadow);
    assert.deepEqual(result, false, 'Should return false for short lower shadow');
  });
  
  it('Should return false when body is too large compared to shadow', function() {
    var bearishHammer = new BearishHammer();
    var result = bearishHammer.hasPattern(largeBodySmallShadow);
    assert.deepEqual(result, false, 'Should return false for large body small shadow');
  });
  
  it('Should return false for invalid OHLC data (high < open)', function() {
    var bearishHammer = new BearishHammer();
    var result = bearishHammer.hasPattern(invalidOHLC);
    assert.deepEqual(result, false, 'Should return false for invalid OHLC data');
  });
  
  it('Should return false for invalid OHLC data (low > close)', function() {
    var bearishHammer = new BearishHammer();
    var result = bearishHammer.hasPattern(invalidLow);
    assert.deepEqual(result, false, 'Should return false for invalid low');
  });
  
  it('Should return false for insufficient shadow relative to scale', function() {
    var bearishHammer = new BearishHammer();
    var result = bearishHammer.hasPattern(insufficientShadow);
    assert.deepEqual(result, false, 'Should return false for insufficient shadow');
  });
  
  it('Should return false for empty data', function() {
    var bearishHammer = new BearishHammer();
    var result = bearishHammer.hasPattern(emptyData);
    assert.deepEqual(result, false, 'Should return false for empty data');
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
    var bearishHammer = new BearishHammer(2);
    var result = bearishHammer.hasPattern(validBearishHammer);
    assert.deepEqual(result, true, 'Should work with custom scale parameter');
  });
  
  it('Should be more restrictive with higher scale', function() {
    var bearishHammer = new BearishHammer(5);
    var result = bearishHammer.hasPattern(insufficientShadow);
    assert.deepEqual(result, false, 'Should be more restrictive with higher scale');
  });
  
  // Test function export
  it('Should work using function export', function() {
    var bearishhammerstick = require('../../lib/candlestick/BearishHammerStick').bearishhammerstick;
    var result = bearishhammerstick(validBearishHammer);
    assert.deepEqual(result, true, 'Should work using function export');
  });
  
  // Test pattern name
  it('Should have correct pattern name', function() {
    var bearishHammer = new BearishHammer();
    assert.deepEqual(bearishHammer.name, 'BearishHammerStick', 'Should have correct pattern name');
  });
  
  // Test required count
  it('Should require exactly 1 candle', function() {
    var bearishHammer = new BearishHammer();
    assert.deepEqual(bearishHammer.requiredCount, 1, 'Should require exactly 1 candle');
  });
  
  // Test multi-day data with pattern at different positions
  it('Should find pattern in multi-day data', function() {
    var multiDayData = {
      open: [25.00, 30.10, 35.00],   // hammer in middle
      high: [25.50, 30.10, 35.50],
      close: [24.50, 26.13, 34.50],
      low: [23.00, 10.06, 33.00]
    };
    var bearishHammer = new BearishHammer();
    var indices = bearishHammer.getAllPatternIndex(multiDayData);
    assert.deepEqual(indices.length > 0, true, 'Should find pattern in multi-day data');
  });
  
  // Test edge case with exact ratios
  it('Should handle exact body to shadow ratios', function() {
    var exactRatio = {
      open: [20.00],
      high: [20.00],
      close: [19.00], // Body = 1.00
      low: [17.00],   // Lower shadow = 2.00, exactly 2 * body
    };
    var bearishHammer = new BearishHammer();
    var result = bearishHammer.hasPattern(exactRatio);
    assert.deepEqual(result, true, 'Should handle exact body to shadow ratios');
  });
});

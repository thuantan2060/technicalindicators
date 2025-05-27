var BearishInvertedHammer = require('../../lib/candlestick/BearishInvertedHammerStick').default;
var assert = require('assert');
var { drawCandleStick } = require('../helpers/test-helper');
var fs = require('fs');

// Valid Bearish Inverted Hammer - Original test case
var validBearishInvertedHammer = {
  open: [30.10],
  high: [52.06],  // Long upper shadow
  close: [26.13], // Bearish: close < open
  low: [26.13],   // Close equals low (small lower shadow)
}

// Valid Bearish Inverted Hammer - Perfect inverted hammer
var perfectInvertedHammer = {
  open: [25.00],
  high: [30.00],  // Long upper shadow
  close: [23.00], // Bearish candle
  low: [23.00],   // Close equals low exactly
}

// Valid Bearish Inverted Hammer - Minimal body
var minimalBody = {
  open: [30.05],
  high: [32.00],  // Long upper shadow
  close: [30.00], // Very small body
  low: [30.00],   // Close equals low
}

// Valid Bearish Inverted Hammer - Larger price range
var largePriceRange = {
  open: [100.00],
  high: [110.00], // Long upper shadow
  close: [98.00], // Bearish
  low: [98.00],   // Close equals low
}

// Invalid - Bullish candle (close > open)
var bullishCandle = {
  open: [20.40],
  high: [25.00],  
  close: [20.60], // Bullish
  low: [20.60],   
}

// Invalid - Close not equal to low
var closeNotEqualLow = {
  open: [30.10],
  high: [52.06],  
  close: [26.13], 
  low: [25.00],   // Low < close
}

// Invalid - Upper shadow too short
var shortUpperShadow = {
  open: [20.60],
  high: [20.80],  // Short upper shadow
  close: [20.40], 
  low: [20.40],   // Close equals low
}

// Invalid - Body too large compared to shadow
var largeBodySmallShadow = {
  open: [22.00],
  high: [22.50],  // Small upper shadow
  close: [20.00], // Large body
  low: [20.00],   // Close equals low
}

// Edge case - Doji-like (very small body)
var dojiLike = {
  open: [20.61],
  high: [25.00],  // Long upper shadow
  close: [20.60], // Very small body
  low: [20.60],   
}

// Invalid - High less than open (invalid OHLC)
var invalidOHLC = {
  open: [30.10],
  high: [25.06],  // Invalid: high < open
  close: [26.13], 
  low: [26.13],   
}

// Invalid - Low greater than close (invalid OHLC)
var invalidLow = {
  open: [30.10],
  high: [52.06],  
  close: [26.13], 
  low: [27.00],   // Invalid: low > close
}

// Valid - Approximate equality test
var approximateEquality = {
  open: [30.10],
  high: [52.06],  
  close: [26.13], 
  low: [26.12],   // Very close to close (should pass approximateEqual)
}

// Invalid - Insufficient upper shadow relative to scale
var insufficientShadow = {
  open: [20.10],
  high: [20.15],  // Very small upper shadow
  close: [20.05], 
  low: [20.05],   
}

// Invalid - Empty data
var emptyData = {
  open: [],
  high: [],
  close: [],
  low: []
}

// Valid - Exact ratio test
var exactRatio = {
  open: [20.00],
  high: [24.00],  // Upper shadow = 4.00
  close: [19.00], // Body = 1.00
  low: [19.00],   // Close equals low
}

// Invalid - Body equals shadow (should be body <= shadow/2)
var bodyEqualsHalfShadow = {
  open: [20.00],
  high: [22.00],  // Upper shadow = 2.00
  close: [19.00], // Body = 1.00 (exactly half of shadow)
  low: [19.00],   
}

describe('Bearish Inverted Hammer (Single Stick) : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(validBearishInvertedHammer);
    fs.writeFileSync(__dirname+'/images/BearishInvertedHammerStick.svg', imageBuffer);
    
    var imageBuffer2 = drawCandleStick(perfectInvertedHammer);
    fs.writeFileSync(__dirname+'/images/perfectBearishInvertedHammer.svg', imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(largePriceRange);
    fs.writeFileSync(__dirname+'/images/largeBearishInvertedHammer.svg', imageBuffer3);
  });
  
  // Positive test cases
  it('Check whether the supplied data has Bearish Inverted Hammer (Single Stick) pattern', function() {
    var bearishInvertedHammer = new BearishInvertedHammer();
    var result = bearishInvertedHammer.hasPattern(validBearishInvertedHammer);
    assert.deepEqual(result, true, 'Invalid result for Bearish Inverted (Single Stick) Hammer');
  });
  
  it('Should identify perfect inverted hammer pattern', function() {
    var bearishInvertedHammer = new BearishInvertedHammer();
    var result = bearishInvertedHammer.hasPattern(perfectInvertedHammer);
    assert.deepEqual(result, true, 'Should identify perfect inverted hammer pattern');
  });
  
  it('Should identify inverted hammer with minimal body', function() {
    var bearishInvertedHammer = new BearishInvertedHammer();
    var result = bearishInvertedHammer.hasPattern(minimalBody);
    assert.deepEqual(result, true, 'Should identify inverted hammer with minimal body');
  });
  
  it('Should identify inverted hammer with large price range', function() {
    var bearishInvertedHammer = new BearishInvertedHammer();
    var result = bearishInvertedHammer.hasPattern(largePriceRange);
    assert.deepEqual(result, true, 'Should identify inverted hammer with large price range');
  });
  
  it('Should identify doji-like inverted hammer pattern', function() {
    var bearishInvertedHammer = new BearishInvertedHammer();
    var result = bearishInvertedHammer.hasPattern(dojiLike);
    assert.deepEqual(result, true, 'Should identify doji-like inverted hammer pattern');
  });
  
  it('Should handle approximate equality for close and low', function() {
    var bearishInvertedHammer = new BearishInvertedHammer();
    var result = bearishInvertedHammer.hasPattern(approximateEquality);
    assert.deepEqual(result, true, 'Should handle approximate equality');
  });
  
  it('Should handle exact body to shadow ratios', function() {
    var bearishInvertedHammer = new BearishInvertedHammer();
    var result = bearishInvertedHammer.hasPattern(exactRatio);
    assert.deepEqual(result, true, 'Should handle exact body to shadow ratios');
  });
  
  it('Should accept body exactly equal to half shadow', function() {
    var bearishInvertedHammer = new BearishInvertedHammer();
    var result = bearishInvertedHammer.hasPattern(bodyEqualsHalfShadow);
    assert.deepEqual(result, true, 'Should accept body exactly equal to half shadow');
  });
  
  // Negative test cases
  it('Should return false for bullish candle', function() {
    var bearishInvertedHammer = new BearishInvertedHammer();
    var result = bearishInvertedHammer.hasPattern(bullishCandle);
    assert.deepEqual(result, false, 'Should return false for bullish candle');
  });
  
  it('Should return false when close does not equal low', function() {
    var bearishInvertedHammer = new BearishInvertedHammer();
    var result = bearishInvertedHammer.hasPattern(closeNotEqualLow);
    assert.deepEqual(result, false, 'Should return false when close != low');
  });
  
  it('Should return false when upper shadow is too short', function() {
    var bearishInvertedHammer = new BearishInvertedHammer();
    var result = bearishInvertedHammer.hasPattern(shortUpperShadow);
    assert.deepEqual(result, false, 'Should return false for short upper shadow');
  });
  
  it('Should return false when body is too large compared to shadow', function() {
    var bearishInvertedHammer = new BearishInvertedHammer();
    var result = bearishInvertedHammer.hasPattern(largeBodySmallShadow);
    assert.deepEqual(result, false, 'Should return false for large body small shadow');
  });
  
  it('Should return false for invalid OHLC data (high < open)', function() {
    var bearishInvertedHammer = new BearishInvertedHammer();
    var result = bearishInvertedHammer.hasPattern(invalidOHLC);
    assert.deepEqual(result, false, 'Should return false for invalid OHLC data');
  });
  
  it('Should return false for invalid OHLC data (low > close)', function() {
    var bearishInvertedHammer = new BearishInvertedHammer();
    var result = bearishInvertedHammer.hasPattern(invalidLow);
    assert.deepEqual(result, false, 'Should return false for invalid low');
  });
  
  it('Should return false for insufficient shadow relative to scale', function() {
    var bearishInvertedHammer = new BearishInvertedHammer();
    var result = bearishInvertedHammer.hasPattern(insufficientShadow);
    assert.deepEqual(result, false, 'Should return false for insufficient shadow');
  });
  
  it('Should return false for empty data', function() {
    var bearishInvertedHammer = new BearishInvertedHammer();
    var result = bearishInvertedHammer.hasPattern(emptyData);
    assert.deepEqual(result, false, 'Should return false for empty data');
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
    var bearishInvertedHammer = new BearishInvertedHammer(2);
    var result = bearishInvertedHammer.hasPattern(validBearishInvertedHammer);
    assert.deepEqual(result, true, 'Should work with custom scale parameter');
  });
  
  it('Should be more restrictive with higher scale', function() {
    var bearishInvertedHammer = new BearishInvertedHammer(5);
    var result = bearishInvertedHammer.hasPattern(insufficientShadow);
    assert.deepEqual(result, false, 'Should be more restrictive with higher scale');
  });
  
  // Test function export
  it('Should work using function export', function() {
    var bearishinvertedhammerstick = require('../../lib/candlestick/BearishInvertedHammerStick').bearishinvertedhammerstick;
    var result = bearishinvertedhammerstick(validBearishInvertedHammer);
    assert.deepEqual(result, true, 'Should work using function export');
  });
  
  // Test pattern name
  it('Should have correct pattern name', function() {
    var bearishInvertedHammer = new BearishInvertedHammer();
    assert.deepEqual(bearishInvertedHammer.name, 'BearishInvertedHammerStick', 'Should have correct pattern name');
  });
  
  // Test required count
  it('Should require exactly 1 candle', function() {
    var bearishInvertedHammer = new BearishInvertedHammer();
    assert.deepEqual(bearishInvertedHammer.requiredCount, 1, 'Should require exactly 1 candle');
  });
  
  // Test multi-day data with pattern at different positions
  it('Should find pattern in multi-day data', function() {
    var multiDayData = {
      open: [25.00, 30.10, 35.00],   // inverted hammer in middle
      high: [25.50, 52.06, 35.50],
      close: [24.50, 26.13, 34.50],
      low: [24.00, 26.13, 34.00]
    };
    var bearishInvertedHammer = new BearishInvertedHammer();
    var indices = bearishInvertedHammer.getAllPatternIndex(multiDayData);
    assert.deepEqual(indices.length > 0, true, 'Should find pattern in multi-day data');
  });
  
  // Test boundary conditions
  it('Should handle boundary condition where body is just over half shadow', function() {
    var boundaryCase = {
      open: [20.00],
      high: [22.00],  // Upper shadow = 2.00
      close: [18.99], // Body = 1.01 (just over half of shadow)
      low: [18.99],   
    };
    var bearishInvertedHammer = new BearishInvertedHammer();
    var result = bearishInvertedHammer.hasPattern(boundaryCase);
    assert.deepEqual(result, false, 'Should return false when body is just over half shadow');
  });
});

var BullishHammerStick = require('../../lib/candlestick/BullishHammerStick').default;
var assert = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs = require('fs');

// Valid Bullish Hammer Stick - Original test case
var validBullishHammer = {
  open: [20.40],
  high: [20.60],  // Close equals high (approximateEqual)
  close: [20.60], // Bullish: close > open
  low: [19.50],   // Long lower shadow: 2 * (close - open) <= (open - low)
}

// Valid Bullish Hammer - Perfect hammer
var perfectHammer = {
  open: [25.00],
  high: [25.50],  // Close equals high
  close: [25.50], 
  low: [23.00],   // Long lower shadow: 2 * 0.50 <= 2.00
}

// Valid Bullish Hammer - Minimal body
var minimalBody = {
  open: [30.00],
  high: [30.05],  // Very small body
  close: [30.05], 
  low: [28.50],   // Long lower shadow
}

// Valid Bullish Hammer - Larger price range
var largePriceRange = {
  open: [100.00],
  high: [102.00],  
  close: [102.00], 
  low: [95.00],   // Long lower shadow: 2 * 2.00 <= 5.00
}

// Invalid - Bearish candle (close < open)
var bearishCandle = {
  open: [20.60],
  high: [20.80],  
  close: [20.40], // Bearish
  low: [19.50],   
}

// Invalid - Close not equal to high
var closeNotEqualHigh = {
  open: [20.40],
  high: [20.80],  // High > close
  close: [20.60], 
  low: [19.50],   
}

// Invalid - Lower shadow too short
var shortLowerShadow = {
  open: [20.40],
  high: [20.60],  
  close: [20.60], 
  low: [20.30],   // Short lower shadow: 2 * 0.20 > 0.10
}

// Invalid - Body too large compared to shadow
var largeBodaySmallShadow = {
  open: [20.00],
  high: [22.00],  
  close: [22.00], 
  low: [19.50],   // Body too large: 2 * 2.00 > 0.50
}

// Edge case - Doji-like (very small body)
var dojiLike = {
  open: [20.60],
  high: [20.61],  // Very small body
  close: [20.61], 
  low: [19.50],   
}

// Invalid - High less than close (invalid OHLC)
var invalidOHLC = {
  open: [20.40],
  high: [20.50],  // Invalid: high < close
  close: [20.60], 
  low: [19.50],   
}

// Invalid - Low greater than open (invalid OHLC)
var invalidLow = {
  open: [20.40],
  high: [20.60],  
  close: [20.60], 
  low: [20.80],   // Invalid: low > open
}

describe('BullishHammerStick : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(validBullishHammer);
    fs.writeFileSync(__dirname+'/images/BullishHammerStick.svg',imageBuffer);
    
    var imageBuffer2 = drawCandleStick(perfectHammer);
    fs.writeFileSync(__dirname+'/images/perfectBullishHammer.svg',imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(largePriceRange);
    fs.writeFileSync(__dirname+'/images/largeBullishHammer.svg',imageBuffer3);
  });
  
  // Positive test cases
  it('Check whether the supplied data has BullishHammerStick pattern', function() {
   var bullishHammerStick = new BullishHammerStick();
   var result = bullishHammerStick.hasPattern(validBullishHammer);
   assert.deepEqual(result, true, 'Invalid result for BullishHammerStick');
  });
  
  it('Should identify perfect hammer pattern', function() {
   var bullishHammerStick = new BullishHammerStick();
   var result = bullishHammerStick.hasPattern(perfectHammer);
   assert.deepEqual(result, true, 'Should identify perfect hammer pattern');
  });
  
  it('Should identify hammer with minimal body', function() {
   var bullishHammerStick = new BullishHammerStick();
   var result = bullishHammerStick.hasPattern(minimalBody);
   assert.deepEqual(result, true, 'Should identify hammer with minimal body');
  });
  
  it('Should identify hammer with large price range', function() {
   var bullishHammerStick = new BullishHammerStick();
   var result = bullishHammerStick.hasPattern(largePriceRange);
   assert.deepEqual(result, true, 'Should identify hammer with large price range');
  });
  
  it('Should identify doji-like hammer pattern', function() {
   var bullishHammerStick = new BullishHammerStick();
   var result = bullishHammerStick.hasPattern(dojiLike);
   assert.deepEqual(result, true, 'Should identify doji-like hammer pattern');
  });
  
  // Negative test cases
  it('Should return false for bearish candle', function() {
   var bullishHammerStick = new BullishHammerStick();
   var result = bullishHammerStick.hasPattern(bearishCandle);
   assert.deepEqual(result, false, 'Should return false for bearish candle');
  });
  
  it('Should return false when close does not equal high', function() {
   var bullishHammerStick = new BullishHammerStick();
   var result = bullishHammerStick.hasPattern(closeNotEqualHigh);
   assert.deepEqual(result, false, 'Should return false when close != high');
  });
  
  it('Should return false when lower shadow is too short', function() {
   var bullishHammerStick = new BullishHammerStick();
   var result = bullishHammerStick.hasPattern(shortLowerShadow);
   assert.deepEqual(result, false, 'Should return false for short lower shadow');
  });
  
  it('Should return false when body is too large compared to shadow', function() {
   var bullishHammerStick = new BullishHammerStick();
   var result = bullishHammerStick.hasPattern(largeBodaySmallShadow);
   assert.deepEqual(result, false, 'Should return false for large body small shadow');
  });
  
  it('Should return false for invalid OHLC data (high < close)', function() {
   var bullishHammerStick = new BullishHammerStick();
   var result = bullishHammerStick.hasPattern(invalidOHLC);
   assert.deepEqual(result, false, 'Should return false for invalid OHLC data');
  });
  
  it('Should return false for invalid OHLC data (low > open)', function() {
   var bullishHammerStick = new BullishHammerStick();
   var result = bullishHammerStick.hasPattern(invalidLow);
   assert.deepEqual(result, false, 'Should return false for invalid low');
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
   var bullishHammerStick = new BullishHammerStick(2);
   var result = bullishHammerStick.hasPattern(validBullishHammer);
   assert.deepEqual(result, true, 'Should work with custom scale parameter');
  });
  
  // Test function export
  it('Should work using function export', function() {
   var bullishhammerstick = require('../../lib/candlestick/BullishHammerStick').bullishhammerstick;
   var result = bullishhammerstick(validBullishHammer);
   assert.deepEqual(result, true, 'Should work using function export');
  });
  
  // Test insufficient data
  it('Should return false for insufficient data', function() {
   var bullishHammerStick = new BullishHammerStick();
   var emptyData = { open: [], high: [], close: [], low: [] };
   var result = bullishHammerStick.hasPattern(emptyData);
   assert.deepEqual(result, false, 'Should return false for empty data');
  });
  
  // Test getAllPatternIndex method
  it('Should return correct indices for all hammer patterns in multi-day data', function() {
   var multiDayData = {
     open: [20.40, 25.00, 30.00],  // Three candles: hammer, hammer, non-hammer
     high: [20.60, 25.50, 31.00],
     close: [20.60, 25.50, 30.20], // First two are bullish hammers, third is not
     low: [19.50, 23.00, 29.80],   // First two have long lower shadows, third doesn't
   };
   var bullishHammerStick = new BullishHammerStick();
   var indices = bullishHammerStick.getAllPatternIndex(multiDayData);
   assert.deepEqual(Array.isArray(indices), true, 'Should return an array');
   assert.deepEqual(indices.length, 2, 'Should find 2 hammer patterns in the data');
   assert.deepEqual(indices, [0, 1], 'Should find patterns at indices 0 and 1');
  });
  
  // Test data ordering - ascending order where last candle is most recent
  it('Should correctly handle ascending order data where last candle is most recent', function() {
   // Data in ascending order: oldest to newest (left to right)
   var ascendingData = {
     open: [20.40, 25.00, 30.00],  // Day 1, Day 2, Day 3 (most recent)
     high: [20.60, 25.50, 31.00],
     close: [20.60, 25.50, 30.20], 
     low: [19.50, 23.00, 29.80],   
   };
   
   var bullishHammerStick = new BullishHammerStick();
   
   // hasPattern should check the most recent candle (last item in arrays)
   var hasPatternResult = bullishHammerStick.hasPattern(ascendingData);
   assert.deepEqual(hasPatternResult, false, 'Most recent candle (index 2) should not be a hammer');
   
   // Test with only the most recent candle being a hammer
   var recentHammerData = {
     open: [30.00, 25.00, 20.40],  // Day 1, Day 2, Day 3 (most recent is hammer)
     high: [31.00, 25.50, 20.60],
     close: [30.20, 25.50, 20.60], 
     low: [29.80, 23.00, 19.50],   
   };
   
   var hasRecentHammer = bullishHammerStick.hasPattern(recentHammerData);
   assert.deepEqual(hasRecentHammer, true, 'Most recent candle (index 2) should be a hammer');
  });
});

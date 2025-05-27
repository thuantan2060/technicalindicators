var ShootingStar = require('../../lib/candlestick/ShootingStar').default;
var assert = require('assert');
var { drawCandleStick } = require('../helpers/test-helper');
var fs = require('fs');

// Valid Shooting Star pattern (5-day pattern)
// Days 0-2: Upward trend, Day 3: Shooting star, Day 4: Confirmation
// Data in ascending order: [oldest, ..., newest]
var validShootingStar = {
  open: [18.00, 19.00, 20.00, 21.00, 20.50],   // [day0, day1, day2, day3, day4]
  high: [18.50, 19.50, 20.50, 22.50, 20.80],   // Day 3 has long upper shadow
  close: [18.30, 19.30, 20.30, 20.70, 20.30],  // Day 3: close ≈ low for shooting star
  low: [17.80, 18.80, 19.80, 20.70, 20.20],    
}

// Valid Shooting Star - Perfect pattern
var perfectShootingStar = {
  open: [18.00, 19.00, 20.00, 21.00, 20.50],   
  high: [18.50, 19.50, 20.50, 22.00, 20.80],   // Clear shooting star at day 3
  close: [18.30, 19.30, 20.30, 20.90, 20.30],  // Day 3: close ≈ low
  low: [17.80, 18.80, 19.80, 20.90, 20.20],    
}

// Valid Shooting Star - Minimal body
var minimalBody = {
  open: [18.00, 19.00, 20.00, 21.00, 20.50],   
  high: [18.50, 19.50, 20.50, 22.50, 20.80],   
  close: [18.30, 19.30, 20.30, 20.95, 20.30],  // Day 3: very small body, close ≈ low
  low: [17.80, 18.80, 19.80, 20.95, 20.20],    
}

// Invalid - No upward trend
var noUpwardTrend = {
  open: [22.50, 22.00, 21.50, 21.00, 20.50],   // Downward trend
  high: [23.00, 22.50, 22.00, 22.50, 20.80],   
  close: [22.30, 21.80, 21.30, 20.70, 20.30],  
  low: [22.20, 21.70, 21.20, 20.70, 20.20],    
}

// Invalid - No shooting star (no long upper shadow)
var noShootingStar = {
  open: [18.00, 19.00, 20.00, 21.00, 20.50],   
  high: [18.50, 19.50, 20.50, 21.20, 20.80],   // No long upper shadow
  close: [18.30, 19.30, 20.30, 20.80, 20.30],  
  low: [17.80, 18.80, 19.80, 20.70, 20.20],    
}

// Invalid - No confirmation (day 4 doesn't confirm reversal)
var noConfirmation = {
  open: [18.00, 19.00, 20.00, 21.00, 21.50],   // Day 4 continues upward
  high: [18.50, 19.50, 20.50, 22.50, 21.80],   
  close: [18.30, 19.30, 20.30, 20.70, 21.70],  // Day 3: proper shooting star
  low: [17.80, 18.80, 19.80, 20.70, 21.40],    
}

// Invalid - Large body (not small body requirement)
var largeBody = {
  open: [18.00, 19.00, 20.00, 21.50, 20.50],   
  high: [18.50, 19.50, 20.50, 22.50, 20.80],   
  close: [18.30, 19.30, 20.30, 20.00, 20.30],  // Day 3: large body
  low: [17.80, 18.80, 19.80, 20.00, 20.20],    
}

// Insufficient data (less than 5 days)
var insufficientData = {
  open: [20.00, 21.00, 20.50],   
  high: [20.50, 22.50, 20.80],   
  close: [20.30, 20.80, 20.30],  
  low: [19.80, 20.70, 20.20],    
}

// Edge case - Large price range
var largePriceRange = {
  open: [93.00, 94.00, 95.00, 96.00, 95.50],   
  high: [93.50, 94.50, 95.50, 98.50, 95.80],   // Large shooting star
  close: [93.30, 94.30, 95.30, 95.70, 95.30],  // Day 3: close ≈ low
  low: [92.80, 93.80, 94.80, 95.70, 95.20],    
}

// Invalid OHLC data
var invalidOHLC = {
  open: [18.00, 19.00, 20.00, 21.00, 20.50],   
  high: [18.50, 19.50, 20.50, 20.50, 20.80],   // Invalid: high < open at day 3
  close: [18.30, 19.30, 20.30, 20.80, 20.30],  
  low: [17.80, 18.80, 19.80, 20.70, 20.20],    
}

describe('ShootingStar : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(validShootingStar);
    fs.writeFileSync(__dirname+'/images/ShootingStar.svg',imageBuffer);
    
    var imageBuffer2 = drawCandleStick(perfectShootingStar);
    fs.writeFileSync(__dirname+'/images/perfectShootingStar.svg',imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(largePriceRange);
    fs.writeFileSync(__dirname+'/images/largeShootingStar.svg',imageBuffer3);
  });
  
  // Positive test cases
  it('Check whether the supplied data has ShootingStar pattern', function() {
   var shootingStar = new ShootingStar();
   var result = shootingStar.hasPattern(validShootingStar);
   assert.deepEqual(result, true, 'Invalid result for ShootingStar');
  });
  
  it('Should identify perfect shooting star pattern', function() {
   var shootingStar = new ShootingStar();
   var result = shootingStar.hasPattern(perfectShootingStar);
   assert.deepEqual(result, true, 'Should identify perfect shooting star pattern');
  });
  
  it('Should identify shooting star with minimal body', function() {
   var shootingStar = new ShootingStar();
   var result = shootingStar.hasPattern(minimalBody);
   assert.deepEqual(result, true, 'Should identify pattern with minimal body');
  });
  
  it('Should identify shooting star with large price range', function() {
   var shootingStar = new ShootingStar();
   var result = shootingStar.hasPattern(largePriceRange);
   assert.deepEqual(result, true, 'Should identify pattern with large price range');
  });
  
  // Negative test cases
  it('Should return false when there is no upward trend', function() {
   var shootingStar = new ShootingStar();
   var result = shootingStar.hasPattern(noUpwardTrend);
   assert.deepEqual(result, false, 'Should return false for no upward trend');
  });
  
  it('Should return false when there is no shooting star candle', function() {
   var shootingStar = new ShootingStar();
   var result = shootingStar.hasPattern(noShootingStar);
   assert.deepEqual(result, false, 'Should return false for no shooting star');
  });
  
  it('Should return false when there is no confirmation', function() {
   var shootingStar = new ShootingStar();
   var result = shootingStar.hasPattern(noConfirmation);
   assert.deepEqual(result, false, 'Should return false for no confirmation');
  });
  
  it('Should return false when body is too large', function() {
   var shootingStar = new ShootingStar();
   var result = shootingStar.hasPattern(largeBody);
   assert.deepEqual(result, false, 'Should return false for large body');
  });
  
  it('Should return false for insufficient data', function() {
   var shootingStar = new ShootingStar();
   var result = shootingStar.hasPattern(insufficientData);
   assert.deepEqual(result, false, 'Should return false for insufficient data');
  });
  
  it('Should return false for invalid OHLC data', function() {
   var shootingStar = new ShootingStar();
   var result = shootingStar.hasPattern(invalidOHLC);
   assert.deepEqual(result, false, 'Should return false for invalid OHLC data');
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
   var shootingStar = new ShootingStar(2);
   var result = shootingStar.hasPattern(validShootingStar);
   assert.deepEqual(result, true, 'Should work with custom scale parameter');
  });
  
  // Test function export
  it('Should work using function export', function() {
   var shootingstar = require('../../lib/candlestick/ShootingStar').shootingstar;
   var result = shootingstar(validShootingStar);
   assert.deepEqual(result, true, 'Should work using function export');
  });
  
  // Test insufficient data
  it('Should return false for empty data', function() {
   var shootingStar = new ShootingStar();
   var emptyData = { open: [], high: [], close: [], low: [] };
   var result = shootingStar.hasPattern(emptyData);
   assert.deepEqual(result, false, 'Should return false for empty data');
  });
  
  // Test getAllPatternIndex method
  it('Should return correct indices for all shooting star patterns in extended data', function() {
   var extendedData = {
     // Adding more days to test pattern detection (ascending order)
     open: [16.50, 17.00, 17.50, 18.00, 19.00, 20.00, 21.00, 20.50],   
     high: [17.00, 17.50, 18.00, 18.50, 19.50, 20.50, 22.50, 20.80],   
     close: [16.80, 17.30, 17.80, 18.30, 19.30, 20.30, 20.70, 20.30],  
     low: [16.30, 16.80, 17.30, 17.80, 18.80, 19.80, 20.70, 20.20],    
   };
   var shootingStar = new ShootingStar();
   var indices = shootingStar.getAllPatternIndex(extendedData);
   assert.deepEqual(Array.isArray(indices), true, 'Should return an array');
  });
  
  // Test individual components
  it('Should correctly identify upward trend', function() {
   var shootingStar = new ShootingStar();
   var upwardData = {
     open: [18.00, 19.00, 20.00],   
     high: [18.50, 19.50, 20.50],   
     close: [18.30, 19.30, 20.30],  
     low: [17.80, 18.80, 19.80],    
   };
   var result = shootingStar.upwardTrend(upwardData);
   assert.deepEqual(result, true, 'Should correctly identify upward trend');
  });
  
  it('Should correctly identify shooting star candle', function() {
   var shootingStar = new ShootingStar();
   // Test with a full 5-candle dataset where the shooting star is at index 3
   var shootingStarData = {
     open: [18.00, 19.00, 20.00, 21.00, 20.50],   
     high: [18.50, 19.50, 20.50, 22.50, 20.80],   // Long upper shadow at day 3
     close: [18.30, 19.30, 20.30, 20.70, 20.30],  // Close ≈ low for shooting star at day 3
     low: [17.80, 18.80, 19.80, 20.70, 20.20],    
   };
   var result = shootingStar.includesInvertedHammer(shootingStarData);
   assert.deepEqual(result, true, 'Should correctly identify shooting star candle');
  });
});

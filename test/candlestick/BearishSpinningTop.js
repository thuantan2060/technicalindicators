var BearishSpinningTop = require('../../lib/candlestick/BearishSpinningTop').default;
var assert = require('assert');
var { drawCandleStick } = require('../helpers/test-helper');
var fs                      = require('fs');

// Valid BearishSpinningTop - Original test case
var validBearishSpinningTop = {
  open: [20.62],
  high: [20.75],
  close: [20.50],
  low: [20.34],
}

// Valid BearishSpinningTop - Another valid case with longer shadows
var validBearishSpinningTop2 = {
  open: [15.80],
  high: [16.50],  // Upper shadow: 0.70
  close: [15.30], // Body: 0.50
  low: [14.60],   // Lower shadow: 0.70
}

// Invalid - Bullish candle (close > open) 
var bullishCandle = {
  open: [20.50],
  high: [20.75],
  close: [20.62], // close > open = bullish
  low: [20.34],
}

// Invalid - Body too large compared to shadows
var largeBodaySmallShadows = {
  open: [20.80],
  high: [20.85],  // Upper shadow: 0.05
  close: [20.20], // Body: 0.60
  low: [20.15],   // Lower shadow: 0.05
}

// Invalid - Upper shadow too small
var smallUpperShadow = {
  open: [20.60],
  high: [20.65],  // Upper shadow: 0.05
  close: [20.40], // Body: 0.20
  low: [20.10],   // Lower shadow: 0.30
}

// Invalid - Lower shadow too small
var smallLowerShadow = {
  open: [20.60],
  high: [20.90],  // Upper shadow: 0.30
  close: [20.40], // Body: 0.20
  low: [20.35],   // Lower shadow: 0.05
}

// Edge case - Doji-like (very small body)
var dojiLikeBearish = {
  open: [20.61],
  high: [20.85],  // Upper shadow: 0.24
  close: [20.60], // Body: 0.01 (very small)
  low: [20.35],   // Lower shadow: 0.25
}

// Valid - Larger price range
var largePriceRange = {
  open: [100.50],
  high: [102.00], // Upper shadow: 1.50
  close: [99.80], // Body: 0.70
  low: [98.50],   // Lower shadow: 1.30
}

describe('BearishSpinningTop : ', function() {
   before(function() {
    var imageBuffer = drawCandleStick(validBearishSpinningTop);
    fs.writeFileSync(__dirname+'/images/BearishSpinningTop.svg',imageBuffer);
    
    var imageBuffer2 = drawCandleStick(validBearishSpinningTop2);
    fs.writeFileSync(__dirname+'/images/BearishSpinningTop2.svg',imageBuffer2);
    
    var imageBufferLarge = drawCandleStick(largePriceRange);
    fs.writeFileSync(__dirname+'/images/BearishSpinningTopLarge.svg',imageBufferLarge);
  });
  
  // Positive test cases
  it('Check whether the supplied data has BearishSpinningTop pattern', function() {
   var bearishSpinningTop = new BearishSpinningTop ();
   var result = bearishSpinningTop.hasPattern(validBearishSpinningTop);
   assert.deepEqual(result, true, 'Invalid result for BearishSpinningTop')
  });
  
  it('Should identify valid BearishSpinningTop with longer shadows', function() {
   var bearishSpinningTop = new BearishSpinningTop ();
   var result = bearishSpinningTop.hasPattern(validBearishSpinningTop2);
   assert.deepEqual(result, true, 'Should identify valid BearishSpinningTop with longer shadows')
  });
  
  it('Should identify valid BearishSpinningTop with larger price range', function() {
   var bearishSpinningTop = new BearishSpinningTop ();
   var result = bearishSpinningTop.hasPattern(largePriceRange);
   assert.deepEqual(result, true, 'Should identify valid BearishSpinningTop with larger price range')
  });
  
  it('Should identify doji-like bearish pattern as spinning top', function() {
   var bearishSpinningTop = new BearishSpinningTop ();
   var result = bearishSpinningTop.hasPattern(dojiLikeBearish);
   assert.deepEqual(result, true, 'Should identify doji-like bearish pattern as spinning top')
  });
  
  // Negative test cases
  it('Should return false for bullish candle', function() {
   var bearishSpinningTop = new BearishSpinningTop ();
   var result = bearishSpinningTop.hasPattern(bullishCandle);
   assert.deepEqual(result, false, 'Should return false for bullish candle (close > open)')
  });
  
  it('Should return false when body is too large compared to shadows', function() {
   var bearishSpinningTop = new BearishSpinningTop ();
   var result = bearishSpinningTop.hasPattern(largeBodaySmallShadows);
   assert.deepEqual(result, false, 'Should return false when body is larger than shadows')
  });
  
  it('Should return false when upper shadow is too small', function() {
   var bearishSpinningTop = new BearishSpinningTop ();
   var result = bearishSpinningTop.hasPattern(smallUpperShadow);
   assert.deepEqual(result, false, 'Should return false when upper shadow is smaller than body')
  });
  
  it('Should return false when lower shadow is too small', function() {
   var bearishSpinningTop = new BearishSpinningTop ();
   var result = bearishSpinningTop.hasPattern(smallLowerShadow);
   assert.deepEqual(result, false, 'Should return false when lower shadow is smaller than body')
  });
  
  // Test with scale parameter
  it('Should work with custom scale parameter', function() {
   var bearishSpinningTop = new BearishSpinningTop(2);
   var result = bearishSpinningTop.hasPattern(validBearishSpinningTop);
   assert.deepEqual(result, true, 'Should work with custom scale parameter')
  });
  
  // Test function export
  it('Should work using function export', function() {
   var bearishspinningtop = require('../../lib/candlestick/BearishSpinningTop').bearishspinningtop;
   var result = bearishspinningtop(validBearishSpinningTop);
   assert.deepEqual(result, true, 'Should work using function export')
  });
})


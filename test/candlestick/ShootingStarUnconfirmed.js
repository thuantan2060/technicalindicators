var ShootingStar    = require('../../lib/candlestick/ShootingStarUnconfirmed').default;
var assert          = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs              = require('fs');

// Valid Shooting Star (Unconfirmed) test cases
// Data in ascending order: [oldest, ..., newest]
var validBearishShootingStar = {
  open: [28.90, 29.50, 33.10, 41.00],   // [day0, day1, day2, day3]
  high: [36.10, 35.90, 37.60, 48.80],   // Day 3 has long upper shadow
  close: [29.50, 33.10, 36.00, 40.90],  // Day 3: bearish (close < open), close ≈ low
  low: [27.00, 26.90, 27.70, 40.90],    // Upward trend, shooting star at day 3
};

var validBullishShootingStar = {
  open: [28.90, 29.50, 33.10, 36.00],   
  high: [36.10, 35.90, 37.60, 48.80],   
  close: [29.50, 33.10, 36.00, 38.00],  // Day 3: small bullish body (close > open)
  low: [27.00, 26.90, 27.70, 36.00],    // Day 3: low ≈ open for bullish inverted hammer
};

var strongUptrend = {
  open: [20.00, 25.00, 30.00, 40.00],   
  high: [25.50, 30.50, 35.50, 50.00],   // Strong shooting star
  close: [25.00, 30.00, 35.00, 39.50],  // Day 3: bearish, close ≈ low
  low: [19.50, 24.50, 29.50, 39.50],    
};

var minimalUptrend = {
  open: [30.00, 30.50, 31.00, 32.00],   
  high: [30.50, 31.00, 31.50, 36.00],   // Minimal but valid shooting star
  close: [30.40, 30.90, 31.40, 31.90],  // Day 3: bearish, close ≈ low
  low: [29.90, 30.40, 30.90, 31.90],    
};

// Invalid test cases
var noUptrendPattern = {
  open: [40.90, 36.00, 33.10, 29.50],   // Downward trend
  high: [41.80, 37.60, 35.90, 35.00],   
  close: [36.00, 33.10, 29.50, 26.90],  
  low: [35.00, 32.00, 28.00, 25.00],    
};

var noInvertedHammerPattern = {
  open: [28.90, 29.50, 33.10, 36.00],   
  high: [36.10, 35.90, 37.60, 41.80],   // No long upper shadow
  close: [29.50, 33.10, 36.00, 40.90],  
  low: [27.00, 26.90, 27.70, 28.00],    // Has lower shadow instead
};

var insufficientData = {
  open: [28.90, 29.50],
  high: [36.10, 35.90],
  close: [29.50, 33.10],
  low: [27.00, 26.90],
};

var invalidOHLCData = {
  open: [28.90, 29.50, 33.10, 36.00],
  high: [36.10, 35.90, 37.60, 35.00],   // Invalid: high < open
  close: [29.50, 33.10, 36.00, 40.90],
  low: [27.00, 26.90, 27.70, 28.00],
};

var sidewaysMarket = {
  open: [30.00, 30.10, 29.90, 30.05],
  high: [30.50, 30.60, 30.40, 35.00],
  close: [30.20, 29.80, 30.20, 30.10],
  low: [29.80, 29.60, 29.70, 30.00],
};

var downtrendMarket = {
  open: [40.00, 38.00, 36.00, 34.00],
  high: [40.50, 38.50, 36.50, 40.00],
  close: [37.50, 35.50, 33.50, 31.50],
  low: [37.00, 35.00, 33.00, 31.00],
};

// Edge cases
var perfectInvertedHammer = {
  open: [28.90, 29.50, 33.10, 36.00],   
  high: [36.10, 35.90, 37.60, 45.00],   // Perfect inverted hammer with long upper shadow
  close: [29.50, 33.10, 36.00, 35.00],  // Day 3: bearish, close ≈ low (doji-like)
  low: [27.00, 26.90, 27.70, 35.00],    
};

var regularHammer = {
  open: [28.90, 29.50, 33.10, 35.00],   
  high: [36.10, 35.90, 37.60, 35.10],   // Regular hammer (not inverted)
  close: [29.50, 33.10, 36.00, 35.05],  
  low: [27.00, 26.90, 27.70, 30.00],    // Long lower shadow
};

var doji = {
  open: [28.90, 29.50, 33.10, 35.00],   
  high: [36.10, 35.90, 37.60, 45.00],   // Long upper shadow
  close: [29.50, 33.10, 36.00, 35.00],  // Day 3: doji (open = close)
  low: [27.00, 26.90, 27.70, 35.00],    // Day 3: low ≈ open/close
};

describe('Shooting Star (Unconfirmed) : ', function() {
  before(function() {
    var imageBuffer1 = drawCandleStick(validBearishShootingStar);
    fs.writeFileSync(__dirname+'/images/BearishShootingStarUnconfirmed.svg',imageBuffer1);
    
    var imageBuffer2 = drawCandleStick(validBullishShootingStar);
    fs.writeFileSync(__dirname+'/images/BullishShootingStarUnconfirmed.svg',imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(strongUptrend);
    fs.writeFileSync(__dirname+'/images/StrongUptrendShootingStarUnconfirmed.svg',imageBuffer3);
    
    var imageBuffer4 = drawCandleStick(perfectInvertedHammer);
    fs.writeFileSync(__dirname+'/images/PerfectInvertedHammerUnconfirmed.svg',imageBuffer4);
  });
  
  // Positive test cases
  it('Should identify bearish shooting star pattern (unconfirmed)', function() {
    var shootingStar = new ShootingStar();
    var result = shootingStar.hasPattern(validBearishShootingStar);
    assert.deepEqual(result, true, 'Should identify bearish shooting star pattern');
  });
  
  it('Should identify bullish shooting star pattern (unconfirmed)', function() {
    var shootingStar = new ShootingStar();
    var result = shootingStar.hasPattern(validBullishShootingStar);
    assert.deepEqual(result, true, 'Should identify bullish shooting star pattern');
  });
  
  it('Should identify pattern with strong uptrend', function() {
    var shootingStar = new ShootingStar();
    var result = shootingStar.hasPattern(strongUptrend);
    assert.deepEqual(result, true, 'Should identify pattern with strong uptrend');
  });
  
  it('Should identify pattern with minimal uptrend', function() {
    var shootingStar = new ShootingStar();
    var result = shootingStar.hasPattern(minimalUptrend);
    assert.deepEqual(result, true, 'Should identify pattern with minimal uptrend');
  });
  
  it('Should identify perfect inverted hammer pattern', function() {
    var shootingStar = new ShootingStar();
    var result = shootingStar.hasPattern(perfectInvertedHammer);
    assert.deepEqual(result, true, 'Should identify perfect inverted hammer pattern');
  });
  
  it('Should identify doji with upper shadow', function() {
    var shootingStar = new ShootingStar();
    var result = shootingStar.hasPattern(doji);
    assert.deepEqual(result, true, 'Should identify doji with upper shadow');
  });
  
  // Negative test cases
  it('Should return false when there is no upward trend', function() {
    var shootingStar = new ShootingStar();
    var result = shootingStar.hasPattern(noUptrendPattern);
    assert.deepEqual(result, false, 'Should return false when no upward trend');
  });
  
  it('Should return false when there is no inverted hammer pattern', function() {
    var shootingStar = new ShootingStar();
    var result = shootingStar.hasPattern(noInvertedHammerPattern);
    assert.deepEqual(result, false, 'Should return false when no inverted hammer pattern');
  });
  
  it('Should return false with insufficient data', function() {
    var shootingStar = new ShootingStar();
    var result = shootingStar.hasPattern(insufficientData);
    assert.deepEqual(result, false, 'Should return false with insufficient data');
  });
  
  it('Should return false with invalid OHLC data', function() {
    var shootingStar = new ShootingStar();
    var result = shootingStar.hasPattern(invalidOHLCData);
    assert.deepEqual(result, false, 'Should return false with invalid OHLC data');
  });
  
  it('Should return false in sideways market', function() {
    var shootingStar = new ShootingStar();
    var result = shootingStar.hasPattern(sidewaysMarket);
    assert.deepEqual(result, false, 'Should return false in sideways market');
  });
  
  it('Should return false in downtrend market', function() {
    var shootingStar = new ShootingStar();
    var result = shootingStar.hasPattern(downtrendMarket);
    assert.deepEqual(result, false, 'Should return false in downtrend market');
  });
  
  it('Should return false for regular hammer pattern', function() {
    var shootingStar = new ShootingStar();
    var result = shootingStar.hasPattern(regularHammer);
    assert.deepEqual(result, false, 'Should return false for regular hammer pattern');
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
    var shootingStar = new ShootingStar(2);
    var result = shootingStar.hasPattern(validBearishShootingStar);
    assert.deepEqual(result, true, 'Should work with custom scale parameter');
  });
  
  // Test function export
  it('Should work using function export', function() {
    var shootingstarunconfirmed = require('../../lib/candlestick/ShootingStarUnconfirmed').shootingstarunconfirmed;
    var result = shootingstarunconfirmed(validBearishShootingStar);
    assert.deepEqual(result, true, 'Should work using function export');
  });
  
  it('Should work using function export with custom scale', function() {
    var shootingstarunconfirmed = require('../../lib/candlestick/ShootingStarUnconfirmed').shootingstarunconfirmed;
    var result = shootingstarunconfirmed(validBearishShootingStar, 2);
    assert.deepEqual(result, true, 'Should work using function export with custom scale');
  });
  
  // Edge cases
  it('Should handle empty data gracefully', function() {
    var shootingStar = new ShootingStar();
    var emptyData = { open: [], high: [], close: [], low: [] };
    var result = shootingStar.hasPattern(emptyData);
    assert.deepEqual(result, false, 'Should handle empty data gracefully');
  });
  
  it('Should handle undefined data gracefully', function() {
    var shootingStar = new ShootingStar();
    var result = shootingStar.hasPattern(undefined);
    assert.deepEqual(result, false, 'Should handle undefined data gracefully');
  });
  
  it('Should handle mismatched array lengths', function() {
    var shootingStar = new ShootingStar();
    var mismatchedData = {
      open: [28.90, 29.50, 33.10],
      high: [36.10, 35.90],
      close: [29.50, 33.10, 36.00, 40.90],
      low: [27.00, 26.90, 27.70],
    };
    var result = shootingStar.hasPattern(mismatchedData);
    assert.deepEqual(result, false, 'Should handle mismatched array lengths');
  });
  
  // Test required count
  it('Should have correct required count for unconfirmed pattern', function() {
    var shootingStar = new ShootingStar();
    assert.deepEqual(shootingStar.requiredCount, 4, 'Should require 4 candles for unconfirmed pattern');
  });
  
  // Test difference from confirmed pattern
  it('Should not require confirmation candle', function() {
    var ShootingStarConfirmed = require('../../lib/candlestick/ShootingStar').default;
    var shootingStarConfirmed = new ShootingStarConfirmed();
    var shootingStarUnconfirmed = new ShootingStar();
    
    // This pattern should fail confirmed version but pass unconfirmed
    // 4-candle pattern with proper shooting star at index 3
    var patternWithoutConfirmation = {
      open: [28.90, 29.50, 33.10, 41.00],
      high: [36.10, 35.90, 37.60, 48.80],
      close: [29.50, 33.10, 36.00, 40.90],
      low: [27.00, 26.90, 27.70, 40.90],
    };
    
    // 5-candle pattern for confirmed version (should fail due to lack of proper confirmation)
    var patternForConfirmed = {
      open: [28.90, 29.50, 33.10, 41.00, 40.50],
      high: [36.10, 35.90, 37.60, 48.80, 41.00],
      close: [29.50, 33.10, 36.00, 40.90, 40.80],  // No proper bearish confirmation
      low: [27.00, 26.90, 27.70, 40.90, 40.30],
    };
    
    var confirmedResult = shootingStarConfirmed.hasPattern(patternForConfirmed);
    var unconfirmedResult = shootingStarUnconfirmed.hasPattern(patternWithoutConfirmation);
    
    assert.deepEqual(confirmedResult, false, 'Confirmed version should require confirmation');
    assert.deepEqual(unconfirmedResult, true, 'Unconfirmed version should not require confirmation');
  });
});

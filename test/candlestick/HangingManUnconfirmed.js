var HangingMan      = require('../../lib/candlestick/HangingManUnconfirmed').default;
var assert          = require('assert');
var { drawCandleStick } = require('../helpers/test-helper');
var fs              = require('fs');

// Valid Hanging Man (Unconfirmed) test cases
var validBearishHangingMan = {
  open: [28.90, 29.50, 33.10, 36.00],
  high: [36.10, 35.90, 37.60, 41.80],
  close: [29.50, 33.10, 36.00, 40.90],
  low: [27.00, 26.90, 27.70, 28.00],
};

var validBullishHangingMan = {
  open: [28.90, 29.50, 33.10, 36.00],
  high: [36.10, 35.90, 37.60, 41.80],
  close: [29.50, 33.10, 36.00, 40.90],
  low: [27.00, 26.90, 27.70, 28.00],
};

var strongUptrend = {
  open: [20.00, 25.00, 30.00, 35.00],
  high: [25.50, 30.50, 35.50, 40.50],
  close: [25.00, 30.00, 35.00, 40.00],
  low: [19.50, 24.50, 29.50, 34.50],
};

var minimalUptrend = {
  open: [30.00, 30.50, 31.00, 31.50],
  high: [30.50, 31.00, 31.50, 32.00],
  close: [30.40, 30.90, 31.40, 31.90],
  low: [29.90, 30.40, 30.90, 31.40],
};

// Invalid test cases
var noUptrendPattern = {
  open: [40.90, 36.00, 33.10, 29.50],
  high: [41.80, 37.60, 35.90, 33.10],
  close: [36.00, 33.10, 29.50, 26.90],
  low: [35.00, 32.00, 28.00, 25.00],
};

var noHammerPattern = {
  open: [28.90, 29.50, 33.10, 36.00],
  high: [36.10, 35.90, 37.60, 41.80],
  close: [29.50, 33.10, 36.00, 40.90],
  low: [27.00, 26.90, 27.70, 35.00], // No hammer - low too high
};

var insufficientData = {
  open: [28.90, 29.50],
  high: [36.10, 35.90],
  close: [29.50, 33.10],
  low: [27.00, 26.90],
};

var invalidOHLCData = {
  open: [28.90, 29.50, 33.10, 36.00],
  high: [36.10, 35.90, 37.60, 35.00], // Invalid: high < open
  close: [29.50, 33.10, 36.00, 40.90],
  low: [27.00, 26.90, 27.70, 28.00],
};

var sidewaysMarket = {
  open: [30.00, 30.10, 29.90, 30.05],
  high: [30.50, 30.60, 30.40, 30.55],
  close: [30.20, 29.80, 30.20, 30.10],
  low: [29.80, 29.60, 29.70, 29.85],
};

var downtrendMarket = {
  open: [40.00, 38.00, 36.00, 34.00],
  high: [40.50, 38.50, 36.50, 34.50],
  close: [37.50, 35.50, 33.50, 31.50],
  low: [37.00, 35.00, 33.00, 31.00],
};

// Edge cases
var perfectHammer = {
  open: [28.90, 29.50, 33.10, 30.00],
  high: [36.10, 35.90, 37.60, 30.10],
  close: [29.50, 33.10, 36.00, 30.05],
  low: [27.00, 26.90, 27.70, 25.00], // Perfect hammer with long lower shadow
};

var invertedHammer = {
  open: [28.90, 29.50, 33.10, 30.00],
  high: [36.10, 35.90, 37.60, 35.00], // Inverted hammer with long upper shadow
  close: [29.50, 33.10, 36.00, 30.05],
  low: [27.00, 26.90, 27.70, 30.00],
};

describe('Hanging Man (Unconfirmed) : ', function() {
  before(function() {
    var imageBuffer1 = drawCandleStick(validBearishHangingMan);
    fs.writeFileSync(__dirname+'/images/BearishHangingManUnconfirmed.svg',imageBuffer1);
    
    var imageBuffer2 = drawCandleStick(validBullishHangingMan);
    fs.writeFileSync(__dirname+'/images/BullishHangingManUnconfirmed.svg',imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(strongUptrend);
    fs.writeFileSync(__dirname+'/images/StrongUptrendHangingManUnconfirmed.svg',imageBuffer3);
    
    var imageBuffer4 = drawCandleStick(perfectHammer);
    fs.writeFileSync(__dirname+'/images/PerfectHammerUnconfirmed.svg',imageBuffer4);
  });
  
  // Positive test cases
  it('Should identify bearish hanging man pattern (unconfirmed)', function() {
    var hangingMan = new HangingMan();
    var result = hangingMan.hasPattern(validBearishHangingMan);
    assert.deepEqual(result, true, 'Should identify bearish hanging man pattern');
  });
  
  it('Should identify bullish hanging man pattern (unconfirmed)', function() {
    var hangingMan = new HangingMan();
    var result = hangingMan.hasPattern(validBullishHangingMan);
    assert.deepEqual(result, true, 'Should identify bullish hanging man pattern');
  });
  
  it('Should identify pattern with strong uptrend', function() {
    var hangingMan = new HangingMan();
    var result = hangingMan.hasPattern(strongUptrend);
    assert.deepEqual(result, true, 'Should identify pattern with strong uptrend');
  });
  
  it('Should identify pattern with minimal uptrend', function() {
    var hangingMan = new HangingMan();
    var result = hangingMan.hasPattern(minimalUptrend);
    assert.deepEqual(result, true, 'Should identify pattern with minimal uptrend');
  });
  
  it('Should identify perfect hammer pattern', function() {
    var hangingMan = new HangingMan();
    var result = hangingMan.hasPattern(perfectHammer);
    assert.deepEqual(result, true, 'Should identify perfect hammer pattern');
  });
  
  it('Should identify inverted hammer pattern', function() {
    var hangingMan = new HangingMan();
    var result = hangingMan.hasPattern(invertedHammer);
    assert.deepEqual(result, true, 'Should identify inverted hammer pattern');
  });
  
  // Negative test cases
  it('Should return false when there is no upward trend', function() {
    var hangingMan = new HangingMan();
    var result = hangingMan.hasPattern(noUptrendPattern);
    assert.deepEqual(result, false, 'Should return false when no upward trend');
  });
  
  it('Should return false when there is no hammer pattern', function() {
    var hangingMan = new HangingMan();
    var result = hangingMan.hasPattern(noHammerPattern);
    assert.deepEqual(result, false, 'Should return false when no hammer pattern');
  });
  
  it('Should return false with insufficient data', function() {
    var hangingMan = new HangingMan();
    var result = hangingMan.hasPattern(insufficientData);
    assert.deepEqual(result, false, 'Should return false with insufficient data');
  });
  
  it('Should return false with invalid OHLC data', function() {
    var hangingMan = new HangingMan();
    var result = hangingMan.hasPattern(invalidOHLCData);
    assert.deepEqual(result, false, 'Should return false with invalid OHLC data');
  });
  
  it('Should return false in sideways market', function() {
    var hangingMan = new HangingMan();
    var result = hangingMan.hasPattern(sidewaysMarket);
    assert.deepEqual(result, false, 'Should return false in sideways market');
  });
  
  it('Should return false in downtrend market', function() {
    var hangingMan = new HangingMan();
    var result = hangingMan.hasPattern(downtrendMarket);
    assert.deepEqual(result, false, 'Should return false in downtrend market');
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
    var hangingMan = new HangingMan(2);
    var result = hangingMan.hasPattern(validBearishHangingMan);
    assert.deepEqual(result, true, 'Should work with custom scale parameter');
  });
  
  // Test function export
  it('Should work using function export', function() {
    var hangingmanunconfirmed = require('../../lib/candlestick/HangingManUnconfirmed').hangingmanunconfirmed;
    var result = hangingmanunconfirmed(validBearishHangingMan);
    assert.deepEqual(result, true, 'Should work using function export');
  });
  
  it('Should work using function export with custom scale', function() {
    var hangingmanunconfirmed = require('../../lib/candlestick/HangingManUnconfirmed').hangingmanunconfirmed;
    var result = hangingmanunconfirmed(validBearishHangingMan, 2);
    assert.deepEqual(result, true, 'Should work using function export with custom scale');
  });
  
  // Edge cases
  it('Should handle empty data gracefully', function() {
    var hangingMan = new HangingMan();
    var emptyData = { open: [], high: [], close: [], low: [] };
    var result = hangingMan.hasPattern(emptyData);
    assert.deepEqual(result, false, 'Should handle empty data gracefully');
  });
  
  it('Should handle undefined data gracefully', function() {
    var hangingMan = new HangingMan();
    var result = hangingMan.hasPattern(undefined);
    assert.deepEqual(result, false, 'Should handle undefined data gracefully');
  });
  
  it('Should handle mismatched array lengths', function() {
    var hangingMan = new HangingMan();
    var mismatchedData = {
      open: [28.90, 29.50, 33.10],
      high: [36.10, 35.90],
      close: [29.50, 33.10, 36.00, 40.90],
      low: [27.00, 26.90, 27.70],
    };
    var result = hangingMan.hasPattern(mismatchedData);
    assert.deepEqual(result, false, 'Should handle mismatched array lengths');
  });
  
  // Test required count
  it('Should have correct required count for unconfirmed pattern', function() {
    var hangingMan = new HangingMan();
    assert.deepEqual(hangingMan.requiredCount, 4, 'Should require 4 candles for unconfirmed pattern');
  });
  
  // Test difference from confirmed pattern
  it('Should not require confirmation candle', function() {
    var HangingManConfirmed = require('../../lib/candlestick/HangingMan').default;
    var hangingManConfirmed = new HangingManConfirmed();
    var hangingManUnconfirmed = new HangingMan();
    
    // This pattern should fail confirmed version but pass unconfirmed
    var patternWithoutConfirmation = {
      open: [28.90, 29.50, 33.10, 36.00],
      high: [36.10, 35.90, 37.60, 41.80],
      close: [29.50, 33.10, 36.00, 40.90],
      low: [27.00, 26.90, 27.70, 28.00],
    };
    
    var confirmedResult = hangingManConfirmed.hasPattern(patternWithoutConfirmation);
    var unconfirmedResult = hangingManUnconfirmed.hasPattern(patternWithoutConfirmation);
    
    assert.deepEqual(confirmedResult, false, 'Confirmed version should require confirmation');
    assert.deepEqual(unconfirmedResult, true, 'Unconfirmed version should not require confirmation');
  });
});

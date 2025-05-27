var HangingMan      = require('../../lib/candlestick/HangingMan').default;
var assert          = require('assert');
var { drawCandleStick } = require('../helpers/test-helper');
var fs              = require('fs');

// Valid Hanging Man test cases
var validBearishHangingMan = {
  open: [29.50, 33.10, 36.00, 42.80, 40.90],
  high: [35.90, 37.60, 41.80, 42.80, 43.10],
  close: [33.10, 36.00, 40.90, 40.90, 38.05],
  low: [26.90, 27.70, 28.00, 33.10, 37.50],
};

var validBullishHangingMan = {
  open: [29.50, 33.10, 36.00, 40.90, 40.90],
  high: [35.90, 37.60, 41.80, 42.80, 43.10],
  close: [33.10, 36.00, 40.90, 42.80, 38.05],
  low: [26.90, 27.70, 28.00, 33.10, 37.50],
};

var strongUptrend = {
  open: [20.00, 25.00, 30.00, 35.00, 40.90],
  high: [25.50, 30.50, 35.50, 40.50, 43.10],
  close: [25.00, 30.00, 35.00, 40.00, 38.05],
  low: [19.50, 24.50, 29.50, 34.50, 37.50],
};

var minimalUptrend = {
  open: [30.00, 30.50, 31.00, 31.50, 31.90],
  high: [30.50, 31.00, 31.50, 32.00, 32.10],
  close: [30.40, 30.90, 31.40, 31.90, 30.05],
  low: [29.90, 30.40, 30.90, 31.40, 29.50],
};

// Invalid test cases
var noUptrendPattern = {
  open: [40.90, 36.00, 33.10, 29.50, 40.90],
  high: [41.80, 37.60, 35.90, 33.10, 43.10],
  close: [36.00, 33.10, 29.50, 26.90, 38.05],
  low: [35.00, 32.00, 28.00, 25.00, 37.50],
};

var noHammerPattern = {
  open: [29.50, 33.10, 36.00, 40.90, 41.00],
  high: [35.90, 37.60, 41.80, 42.80, 42.50],
  close: [33.10, 36.00, 40.90, 42.80, 41.80],
  low: [26.90, 27.70, 28.00, 33.10, 40.50],
};

var noConfirmation = {
  open: [29.50, 33.10, 36.00, 40.90, 40.90],
  high: [35.90, 37.60, 41.80, 42.80, 43.10],
  close: [33.10, 36.00, 40.90, 42.80, 42.80], // No bearish confirmation
  low: [26.90, 27.70, 28.00, 33.10, 37.50],
};

var insufficientData = {
  open: [29.50, 33.10, 36.00],
  high: [35.90, 37.60, 41.80],
  close: [33.10, 36.00, 40.90],
  low: [26.90, 27.70, 28.00],
};

var invalidOHLCData = {
  open: [29.50, 33.10, 36.00, 42.80, 40.90],
  high: [35.90, 37.60, 41.80, 40.00, 43.10], // Invalid: high < open
  close: [33.10, 36.00, 40.90, 40.90, 38.05],
  low: [26.90, 27.70, 28.00, 33.10, 37.50],
};

var sidewaysMarket = {
  open: [30.00, 30.10, 29.90, 30.05, 30.90],
  high: [30.50, 30.60, 30.40, 30.55, 31.10],
  close: [30.20, 29.80, 30.20, 30.10, 29.05],
  low: [29.80, 29.60, 29.70, 29.85, 28.50],
};

var weakConfirmation = {
  open: [29.50, 33.10, 36.00, 40.90, 40.90],
  high: [35.90, 37.60, 41.80, 42.80, 43.10],
  close: [33.10, 36.00, 40.90, 42.80, 40.85], // Very weak bearish confirmation
  low: [26.90, 27.70, 28.00, 33.10, 37.50],
};

describe('Hanging Man : ', function() {
  before(function() {
    var imageBuffer1 = drawCandleStick(validBearishHangingMan);
    fs.writeFileSync(__dirname+'/images/BearishHangingMan.svg',imageBuffer1);
    
    var imageBuffer2 = drawCandleStick(validBullishHangingMan);
    fs.writeFileSync(__dirname+'/images/BullishHangingMan.svg',imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(strongUptrend);
    fs.writeFileSync(__dirname+'/images/StrongUptrendHangingMan.svg',imageBuffer3);
  });
  
  // Positive test cases
  it('Should identify bearish hanging man pattern', function() {
    var hangingMan = new HangingMan();
    var result = hangingMan.hasPattern(validBearishHangingMan);
    assert.deepEqual(result, true, 'Should identify bearish hanging man pattern');
  });
  
  it('Should identify bullish hanging man pattern', function() {
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
  
  it('Should return false when there is no confirmation', function() {
    var hangingMan = new HangingMan();
    var result = hangingMan.hasPattern(noConfirmation);
    assert.deepEqual(result, false, 'Should return false when no confirmation');
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
  
  it('Should return false with weak confirmation', function() {
    var hangingMan = new HangingMan();
    var result = hangingMan.hasPattern(weakConfirmation);
    assert.deepEqual(result, false, 'Should return false with weak confirmation');
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
    var hangingMan = new HangingMan(2);
    var result = hangingMan.hasPattern(validBearishHangingMan);
    assert.deepEqual(result, true, 'Should work with custom scale parameter');
  });
  
  // Test function export
  it('Should work using function export', function() {
    var hangingman = require('../../lib/candlestick/HangingMan').hangingman;
    var result = hangingman(validBearishHangingMan);
    assert.deepEqual(result, true, 'Should work using function export');
  });
  
  it('Should work using function export with custom scale', function() {
    var hangingman = require('../../lib/candlestick/HangingMan').hangingman;
    var result = hangingman(validBearishHangingMan, 2);
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
      open: [29.50, 33.10, 36.00],
      high: [35.90, 37.60],
      close: [33.10, 36.00, 40.90, 42.80, 38.05],
      low: [26.90, 27.70, 28.00, 33.10],
    };
    var result = hangingMan.hasPattern(mismatchedData);
    assert.deepEqual(result, false, 'Should handle mismatched array lengths');
  });
  
  // Test required count
  it('Should have correct required count', function() {
    var hangingMan = new HangingMan();
    assert.deepEqual(hangingMan.requiredCount, 5, 'Should require 5 candles for hanging man pattern');
  });
});

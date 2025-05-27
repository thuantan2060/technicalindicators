var TweezerBottom   = require('../../lib/candlestick/TweezerBottom').default;
var assert          = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs              = require('fs');

// Valid Tweezer Bottom test cases
var validTweezerBottom = {
  open: [50.00, 45.00, 40.00, 35.00, 30.00],
  high: [51.00, 46.00, 41.00, 36.00, 31.00],
  close: [44.00, 39.00, 34.00, 29.00, 28.50],
  low: [43.00, 38.00, 33.00, 28.00, 28.00], // Same lows on last two candles
};

var strongDowntrend = {
  open: [50.00, 45.00, 40.00, 35.00, 30.00],
  high: [51.00, 46.00, 41.00, 36.00, 31.00],
  close: [44.00, 39.00, 34.00, 29.00, 28.50],
  low: [43.00, 38.00, 33.00, 28.00, 28.00], // Tweezer bottom at 28.00
};

var minimalDowntrend = {
  open: [32.00, 31.50, 31.00, 30.50, 30.00],
  high: [32.50, 32.00, 31.50, 31.00, 30.50],
  close: [31.40, 30.90, 30.40, 29.90, 30.20],
  low: [31.00, 30.50, 30.00, 29.50, 29.50], // Tweezer bottom at 29.50
};

var perfectTweezerBottom = {
  open: [50.00, 45.00, 40.00, 35.00, 30.00],
  high: [51.00, 46.00, 41.00, 36.00, 31.00],
  close: [44.00, 39.00, 34.00, 29.00, 28.50],
  low: [43.00, 38.00, 33.00, 27.70, 27.70], // Perfect match on lows
};

var nearTweezerBottom = {
  open: [50.00, 45.00, 40.00, 35.00, 30.00],
  high: [51.00, 46.00, 41.00, 36.00, 31.00],
  close: [44.00, 39.00, 34.00, 29.00, 28.50],
  low: [43.00, 38.00, 33.00, 27.69, 27.71], // Very close lows
};

// Invalid test cases
var noDowntrendPattern = {
  open: [30.00, 32.00, 34.00, 36.00, 38.00],
  high: [31.00, 33.00, 35.00, 37.00, 39.00],
  close: [31.50, 33.50, 35.50, 37.50, 39.50],
  low: [29.50, 31.50, 33.50, 35.50, 35.50], // Uptrend
};

var noTweezerPattern = {
  open: [30.10, 33.10, 36.00, 40.90, 44.00],
  high: [33.10, 35.90, 37.60, 41.80, 45.00],
  close: [32.50, 29.50, 33.10, 36.00, 42.00],
  low: [25.00, 26.50, 27.70, 28.00, 38.00], // Different lows
};

var insufficientData = {
  open: [36.00, 40.90, 44.00],
  high: [37.60, 41.80, 45.00],
  close: [33.10, 36.00, 42.00],
  low: [27.70, 28.00, 38.00],
};

var invalidOHLCData = {
  open: [30.10, 33.10, 36.00, 40.90, 44.00],
  high: [33.10, 32.00, 37.60, 41.80, 45.00], // Invalid: high < open
  close: [32.50, 29.50, 33.10, 36.00, 42.00],
  low: [29.50, 27.70, 27.70, 28.00, 38.00],
};

var sidewaysMarket = {
  open: [30.00, 30.05, 29.90, 30.10, 30.00],
  high: [30.50, 30.55, 30.40, 30.60, 30.50],
  close: [30.20, 30.10, 30.20, 29.80, 30.20],
  low: [29.85, 29.85, 29.70, 29.60, 29.80], // Sideways
};

var uptrendMarket = {
  open: [25.00, 27.00, 29.00, 31.00, 33.00],
  high: [27.50, 29.50, 31.50, 33.50, 35.50],
  close: [27.00, 29.00, 31.00, 33.00, 35.00],
  low: [24.50, 26.50, 28.50, 30.50, 30.50], // Uptrend
};

var tooFarApartLows = {
  open: [30.10, 33.10, 36.00, 40.90, 44.00],
  high: [33.10, 35.90, 37.60, 41.80, 45.00],
  close: [32.50, 29.50, 33.10, 36.00, 42.00],
  low: [27.00, 25.00, 27.70, 28.00, 38.00], // Lows too far apart
};

// Edge cases
var threeCandleTweezer = {
  open: [50.00, 45.00, 40.00, 35.00, 30.00],
  high: [51.00, 46.00, 41.00, 36.00, 31.00],
  close: [44.00, 39.00, 34.00, 29.00, 28.50],
  low: [43.00, 38.00, 33.00, 27.70, 27.70], // Two candles with same low (last two)
};

var reversingPattern = {
  open: [50.00, 45.00, 40.00, 35.00, 30.00],
  high: [51.00, 46.00, 41.00, 36.00, 35.00], // Higher high on last candle
  close: [44.00, 39.00, 34.00, 29.00, 34.00], // Higher close on last candle (bullish reversal)
  low: [43.00, 38.00, 33.00, 28.00, 28.00], // Tweezer bottom with reversal
};

describe('Tweezer Bottom : ', function() {
  before(function() {
    var imageBuffer1 = drawCandleStick(validTweezerBottom);
    fs.writeFileSync(__dirname+'/images/ValidTweezerBottom.svg',imageBuffer1);
    
    var imageBuffer2 = drawCandleStick(strongDowntrend);
    fs.writeFileSync(__dirname+'/images/StrongDowntrendTweezerBottom.svg',imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(perfectTweezerBottom);
    fs.writeFileSync(__dirname+'/images/PerfectTweezerBottom.svg',imageBuffer3);
    
    var imageBuffer4 = drawCandleStick(reversingPattern);
    fs.writeFileSync(__dirname+'/images/ReversingTweezerBottom.svg',imageBuffer4);
  });
  
  // Positive test cases
  it('Should identify valid tweezer bottom pattern', function() {
    var tweezerBottom = new TweezerBottom();
    var result = tweezerBottom.hasPattern(validTweezerBottom);
    assert.deepEqual(result, true, 'Should identify valid tweezer bottom pattern');
  });
  
  it('Should identify pattern with strong downtrend', function() {
    var tweezerBottom = new TweezerBottom();
    var result = tweezerBottom.hasPattern(strongDowntrend);
    assert.deepEqual(result, true, 'Should identify pattern with strong downtrend');
  });
  
  it('Should identify pattern with minimal downtrend', function() {
    var tweezerBottom = new TweezerBottom();
    var result = tweezerBottom.hasPattern(minimalDowntrend);
    assert.deepEqual(result, true, 'Should identify pattern with minimal downtrend');
  });
  
  it('Should identify perfect tweezer bottom pattern', function() {
    var tweezerBottom = new TweezerBottom();
    var result = tweezerBottom.hasPattern(perfectTweezerBottom);
    assert.deepEqual(result, true, 'Should identify perfect tweezer bottom pattern');
  });
  
  it('Should identify near tweezer bottom pattern', function() {
    var tweezerBottom = new TweezerBottom();
    var result = tweezerBottom.hasPattern(nearTweezerBottom);
    assert.deepEqual(result, true, 'Should identify near tweezer bottom pattern');
  });
  
  it('Should identify three candle tweezer pattern', function() {
    var tweezerBottom = new TweezerBottom();
    var result = tweezerBottom.hasPattern(threeCandleTweezer);
    assert.deepEqual(result, true, 'Should identify three candle tweezer pattern');
  });
  
  it('Should identify reversing pattern', function() {
    var tweezerBottom = new TweezerBottom();
    var result = tweezerBottom.hasPattern(reversingPattern);
    assert.deepEqual(result, true, 'Should identify reversing pattern');
  });
  
  // Negative test cases
  it('Should return false when there is no downward trend', function() {
    var tweezerBottom = new TweezerBottom();
    var result = tweezerBottom.hasPattern(noDowntrendPattern);
    assert.deepEqual(result, false, 'Should return false when no downward trend');
  });
  
  it('Should return false when there is no tweezer pattern', function() {
    var tweezerBottom = new TweezerBottom();
    var result = tweezerBottom.hasPattern(noTweezerPattern);
    assert.deepEqual(result, false, 'Should return false when no tweezer pattern');
  });
  
  it('Should return false with insufficient data', function() {
    var tweezerBottom = new TweezerBottom();
    var result = tweezerBottom.hasPattern(insufficientData);
    assert.deepEqual(result, false, 'Should return false with insufficient data');
  });
  
  it('Should return false with invalid OHLC data', function() {
    var tweezerBottom = new TweezerBottom();
    var result = tweezerBottom.hasPattern(invalidOHLCData);
    assert.deepEqual(result, false, 'Should return false with invalid OHLC data');
  });
  
  it('Should return false in sideways market', function() {
    var tweezerBottom = new TweezerBottom();
    var result = tweezerBottom.hasPattern(sidewaysMarket);
    assert.deepEqual(result, false, 'Should return false in sideways market');
  });
  
  it('Should return false in uptrend market', function() {
    var tweezerBottom = new TweezerBottom();
    var result = tweezerBottom.hasPattern(uptrendMarket);
    assert.deepEqual(result, false, 'Should return false in uptrend market');
  });
  
  it('Should return false when lows are too far apart', function() {
    var tweezerBottom = new TweezerBottom();
    var result = tweezerBottom.hasPattern(tooFarApartLows);
    assert.deepEqual(result, false, 'Should return false when lows are too far apart');
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
    var tweezerBottom = new TweezerBottom(2);
    var result = tweezerBottom.hasPattern(validTweezerBottom);
    assert.deepEqual(result, true, 'Should work with custom scale parameter');
  });
  
  // Test function export
  it('Should work using function export', function() {
    var tweezerbottom = require('../../lib/candlestick/TweezerBottom').tweezerbottom;
    var result = tweezerbottom(validTweezerBottom);
    assert.deepEqual(result, true, 'Should work using function export');
  });
  
  it('Should work using function export with custom scale', function() {
    var tweezerbottom = require('../../lib/candlestick/TweezerBottom').tweezerbottom;
    var result = tweezerbottom(validTweezerBottom, 2);
    assert.deepEqual(result, true, 'Should work using function export with custom scale');
  });
  
  // Edge cases
  it('Should handle empty data gracefully', function() {
    var tweezerBottom = new TweezerBottom();
    var emptyData = { open: [], high: [], close: [], low: [] };
    var result = tweezerBottom.hasPattern(emptyData);
    assert.deepEqual(result, false, 'Should handle empty data gracefully');
  });
  
  it('Should handle undefined data gracefully', function() {
    var tweezerBottom = new TweezerBottom();
    var result = tweezerBottom.hasPattern(undefined);
    assert.deepEqual(result, false, 'Should handle undefined data gracefully');
  });
  
  it('Should handle mismatched array lengths', function() {
    var tweezerBottom = new TweezerBottom();
    var mismatchedData = {
      open: [36.00, 40.90, 44.00],
      high: [37.60, 41.80],
      close: [32.50, 29.50, 33.10, 36.00, 42.00],
      low: [27.70, 27.70, 28.00, 38.00],
    };
    var result = tweezerBottom.hasPattern(mismatchedData);
    assert.deepEqual(result, false, 'Should handle mismatched array lengths');
  });
  
  // Test required count
  it('Should have correct required count', function() {
    var tweezerBottom = new TweezerBottom();
    assert.deepEqual(tweezerBottom.requiredCount, 5, 'Should require 5 candles for tweezer bottom pattern');
  });
  
  // Test tolerance for approximate equality
  it('Should accept lows within tolerance', function() {
    var tweezerBottom = new TweezerBottom();
    var toleranceData = {
      open: [50.00, 45.00, 40.00, 35.00, 30.00],
      high: [51.00, 46.00, 41.00, 36.00, 31.00],
      close: [44.00, 39.00, 34.00, 29.00, 28.50],
      low: [43.00, 38.00, 33.00, 27.70, 27.70], // Exactly equal lows
    };
    var result = tweezerBottom.hasPattern(toleranceData);
    assert.deepEqual(result, true, 'Should accept lows within tolerance');
  });
  
  it('Should reject lows outside tolerance', function() {
    var tweezerBottom = new TweezerBottom();
    var outsideToleranceData = {
      open: [30.10, 33.10, 36.00, 40.90, 44.00],
      high: [33.10, 35.90, 37.60, 41.80, 45.00],
      close: [32.50, 29.50, 33.10, 36.00, 42.00],
      low: [27.90, 27.50, 27.70, 28.00, 38.00], // Outside tolerance
    };
    var result = tweezerBottom.hasPattern(outsideToleranceData);
    assert.deepEqual(result, false, 'Should reject lows outside tolerance');
  });
});

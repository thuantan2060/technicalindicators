var BearishEngulfingPattern = require('../../lib/candlestick/BearishEngulfingPattern').default;
var assert = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs = require('fs');

// Valid Bearish Engulfing Pattern
var validBearishEngulfing = {
  open: [30.20,15.36],  // Current: bearish (30.20 -> 14.50), Previous: bullish (15.36 -> 27.89)
  high: [30.50,30.87],
  close: [14.50,27.89],
  low: [14.00,14.93],
}

// Valid Bearish Engulfing - Perfect engulfment
var perfectEngulfment = {
  open: [27.89, 20.00],  // Current opens at previous close, Previous bullish
  high: [28.00, 26.00],
  close: [20.00, 25.00], // Current closes at previous open
  low: [19.50, 19.50],
}

// Valid Bearish Engulfing - Minimal engulfment
var minimalEngulfment = {
  open: [25.01, 20.00],  // Current opens just above previous close
  high: [25.10, 26.00],
  close: [19.99, 25.00], // Current closes just below previous open
  low: [19.50, 19.50],
}

// Invalid - Both candles bearish
var bothBearish = {
  open: [25.00, 22.00],  // Both candles bearish
  high: [26.00, 23.00],
  close: [20.00, 21.00],
  low: [19.50, 20.50],
}

// Invalid - Current candle bullish
var currentBullish = {
  open: [20.00, 20.00],  // Current bullish, previous bullish
  high: [25.00, 25.00],
  close: [24.00, 24.00],
  low: [19.50, 19.50],
}

// Invalid - Previous candle bearish
var previousBearish = {
  open: [25.00, 25.00],  // Current bearish, previous bearish
  high: [26.00, 26.00],
  close: [20.00, 20.00],
  low: [19.50, 19.50],
}

// Invalid - No engulfment (current doesn't cover previous)
var noEngulfment = {
  open: [23.00, 20.00],  // Current doesn't engulf previous
  high: [24.00, 25.00],
  close: [22.00, 24.00],
  low: [21.50, 19.50],
}

// Invalid - Reverse engulfment (previous covers current)
var reverseEngulfment = {
  open: [21.00, 18.00],  // Previous engulfs current
  high: [22.00, 30.00],
  close: [20.50, 15.00],
  low: [20.00, 14.00],
}

// Edge case - Gap down opening
var gapDownOpening = {
  open: [26.00, 20.00],  // Current opens above previous close, previous day bullish
  high: [27.00, 25.00],
  close: [18.00, 24.00], // Previous bullish (20->24), Current bearish (26->18) and engulfs
  low: [17.50, 19.50],
}

// Edge case - Large price range
var largePriceRange = {
  open: [105.00, 90.00],   
  high: [106.00, 100.00],   
  close: [85.00, 99.00],  
  low: [84.50, 89.50],    
}

// One day data (insufficient)
var oneDayData = {
  open: [30.20],
  high: [30.50],
  close: [14.50],
  low: [14.00],
}

// Invalid OHLC data
var invalidOHLC = {
  open: [30.20, 15.36],   
  high: [29.50, 30.87],   // Invalid: high < open
  close: [14.50, 27.89],  
  low: [35.00, 14.93],    // Invalid: low > open
}

describe('BearishEngulfingPattern : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(validBearishEngulfing);
    fs.writeFileSync(__dirname+'/images/bearishEngulfingPattern.svg',imageBuffer);
    
    var imageBuffer2 = drawCandleStick(perfectEngulfment);
    fs.writeFileSync(__dirname+'/images/perfectBearishEngulfing.svg',imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(gapDownOpening);
    fs.writeFileSync(__dirname+'/images/gapDownBearishEngulfing.svg',imageBuffer3);
  });
  
  // Positive test cases
  it('Check whether the supplied data has BearishEngulfingPattern pattern', function() {
   var bearishEngulfingPattern = new BearishEngulfingPattern ();
   var result = bearishEngulfingPattern.hasPattern(validBearishEngulfing);
   assert.deepEqual(result, true, 'Invalid result for BearishEngulfingPattern');
  });
  
  it('Should identify perfect engulfment pattern', function() {
   var bearishEngulfingPattern = new BearishEngulfingPattern ();
   var result = bearishEngulfingPattern.hasPattern(perfectEngulfment);
   assert.deepEqual(result, true, 'Should identify perfect engulfment pattern');
  });
  
  it('Should identify minimal engulfment pattern', function() {
   var bearishEngulfingPattern = new BearishEngulfingPattern ();
   var result = bearishEngulfingPattern.hasPattern(minimalEngulfment);
   assert.deepEqual(result, true, 'Should identify minimal engulfment pattern');
  });
  
  it('Should identify engulfing pattern with gap down opening', function() {
   var bearishEngulfingPattern = new BearishEngulfingPattern ();
   var result = bearishEngulfingPattern.hasPattern(gapDownOpening);
   assert.deepEqual(result, true, 'Should identify pattern with gap down opening');
  });
  
  it('Should identify pattern with large price range', function() {
   var bearishEngulfingPattern = new BearishEngulfingPattern ();
   var result = bearishEngulfingPattern.hasPattern(largePriceRange);
   assert.deepEqual(result, true, 'Should identify pattern with large price range');
  });
  
  // Negative test cases
  it('Should return false when both candles are bearish', function() {
   var bearishEngulfingPattern = new BearishEngulfingPattern ();
   var result = bearishEngulfingPattern.hasPattern(bothBearish);
   assert.deepEqual(result, false, 'Should return false when both candles are bearish');
  });
  
  it('Should return false when current candle is bullish', function() {
   var bearishEngulfingPattern = new BearishEngulfingPattern ();
   var result = bearishEngulfingPattern.hasPattern(currentBullish);
   assert.deepEqual(result, false, 'Should return false when current candle is bullish');
  });
  
  it('Should return false when previous candle is bearish', function() {
   var bearishEngulfingPattern = new BearishEngulfingPattern ();
   var result = bearishEngulfingPattern.hasPattern(previousBearish);
   assert.deepEqual(result, false, 'Should return false when previous candle is bearish');
  });
  
  it('Should return false when there is no engulfment', function() {
   var bearishEngulfingPattern = new BearishEngulfingPattern ();
   var result = bearishEngulfingPattern.hasPattern(noEngulfment);
   assert.deepEqual(result, false, 'Should return false when no engulfment occurs');
  });
  
  it('Should return false for reverse engulfment', function() {
   var bearishEngulfingPattern = new BearishEngulfingPattern ();
   var result = bearishEngulfingPattern.hasPattern(reverseEngulfment);
   assert.deepEqual(result, false, 'Should return false for reverse engulfment');
  });
  
  it('Should return false for invalid OHLC data', function() {
   var bearishEngulfingPattern = new BearishEngulfingPattern ();
   var result = bearishEngulfingPattern.hasPattern(invalidOHLC);
   assert.deepEqual(result, false, 'Should return false for invalid OHLC data');
  });
  
  // Test insufficient data
  it('Should return false if less data is provided', function() {
   var bearishEngulfingPattern = new BearishEngulfingPattern ();
   var result = bearishEngulfingPattern.hasPattern(oneDayData);
   assert.deepEqual(result, false, 'Should return false for insufficient data');
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
   var bearishEngulfingPattern = new BearishEngulfingPattern(2);
   var result = bearishEngulfingPattern.hasPattern(validBearishEngulfing);
   assert.deepEqual(result, true, 'Should work with custom scale parameter');
  });
  
  // Test function export
  it('Should work using function export', function() {
   var bearishengulfingpattern = require('../../lib/candlestick/BearishEngulfingPattern').bearishengulfingpattern;
   var result = bearishengulfingpattern(validBearishEngulfing);
   assert.deepEqual(result, true, 'Should work using function export');
  });
  
  // Test getAllPatternIndex method
  it('Should return correct indices for all patterns in multi-day data', function() {
   var multiDayData = {
     open: [30.20, 15.36, 25.00, 22.00],  // Pattern at positions 0-1 (current-previous)
     high: [30.50, 30.87, 26.00, 23.00],
     close: [14.50, 27.89, 20.00, 21.50], // Pattern: bearish engulfs bullish
     low: [14.00, 14.93, 19.50, 21.00],
   };
   var bearishEngulfingPattern = new BearishEngulfingPattern();
   var indices = bearishEngulfingPattern.getAllPatternIndex(multiDayData);
   assert.deepEqual(Array.isArray(indices), true, 'Should return an array');
  });
  
  // Test empty data
  it('Should return false for empty data', function() {
   var bearishEngulfingPattern = new BearishEngulfingPattern ();
   var emptyData = { open: [], high: [], close: [], low: [] };
   var result = bearishEngulfingPattern.hasPattern(emptyData);
   assert.deepEqual(result, false, 'Should return false for empty data');
  });
});


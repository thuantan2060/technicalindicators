var BearishEngulfingPattern = require('../../lib/candlestick/BearishEngulfingPattern').default;
var assert = require('assert');
var { drawCandleStick } = require('../helpers/test-helper');
var fs = require('fs');

// Valid Bearish Engulfing Pattern
var validBearishEngulfing = {
  open: [15.36,30.20],  // Previous: bullish (15.36 -> 27.89), Current: bearish (30.20 -> 14.50)
  high: [30.87,30.50],
  close: [27.89,14.50],
  low: [14.93,14.00],
}

// Valid Bearish Engulfing - Perfect engulfment
var perfectEngulfment = {
  open: [20.00, 27.89],  // Previous bullish, Current opens at previous close
  high: [26.00, 28.00],
  close: [25.00, 20.00], // Previous open, Current closes at previous open
  low: [19.50, 19.50],
}

// Valid Bearish Engulfing - Minimal engulfment
var minimalEngulfment = {
  open: [20.00, 25.01],  // Previous bullish, Current opens just above previous close
  high: [26.00, 25.10],
  close: [25.00, 19.99], // Previous close, Current closes just below previous open
  low: [19.50, 19.50],
}

// Invalid - Both candles bearish
var bothBearish = {
  open: [22.00, 25.00],  // Both candles bearish
  high: [23.00, 26.00],
  close: [21.00, 20.00],
  low: [20.50, 19.50],
}

// Invalid - Current candle bullish
var currentBullish = {
  open: [20.00, 20.00],  // Previous bullish, current bullish
  high: [25.00, 25.00],
  close: [24.00, 24.00],
  low: [19.50, 19.50],
}

// Invalid - Previous candle bearish
var previousBearish = {
  open: [25.00, 25.00],  // Previous bearish, current bearish
  high: [26.00, 26.00],
  close: [20.00, 20.00],
  low: [19.50, 19.50],
}

// Invalid - No engulfment (current doesn't cover previous)
var noEngulfment = {
  open: [20.00, 23.00],  // Previous bullish, current doesn't engulf previous
  high: [25.00, 24.00],
  close: [24.00, 22.00],
  low: [19.50, 21.50],
}

// Invalid - Reverse engulfment (previous covers current)
var reverseEngulfment = {
  open: [18.00, 21.00],  // Previous bullish, current smaller bearish (reverse engulfment)
  high: [30.00, 22.00],
  close: [15.00, 20.50],
  low: [14.00, 20.00],
}

// Edge case - Gap down opening
var gapDownOpening = {
  open: [20.00, 26.00],  // Previous bullish (20->24), Current opens above previous close
  high: [25.00, 27.00],
  close: [24.00, 18.00], // Previous bullish, Current bearish (26->18) and engulfs
  low: [19.50, 17.50],
}

// Edge case - Large price range
var largePriceRange = {
  open: [90.00, 105.00],   // Previous bullish (90->99), Current bearish (105->85)
  high: [100.00, 106.00],   
  close: [99.00, 85.00],  
  low: [89.50, 84.50],    
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
  open: [15.36, 30.20],   
  high: [30.87, 29.50],   // Invalid: high < open for current candle
  close: [27.89, 14.50],  
  low: [14.93, 35.00],    // Invalid: low > open for current candle
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
     open: [15.36, 30.20, 22.00, 25.00],  // Pattern at positions 0-1 (previous-current)
     high: [30.87, 30.50, 23.00, 26.00],
     close: [27.89, 14.50, 21.50, 20.00], // Pattern: bullish engulfed by bearish
     low: [14.93, 14.00, 21.00, 19.50],
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


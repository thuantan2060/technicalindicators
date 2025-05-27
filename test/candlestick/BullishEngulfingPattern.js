var BullishEngulfingPattern = require('../../lib/candlestick/BullishEngulfingPattern').default;
var assert = require('assert');
var { drawCandleStick } = require('../helpers/test-helper');
var fs = require('fs');

// Valid Bullish Engulfing Pattern
// Data in ascending order: [older/previous, newer/current]
var validBullishEngulfing = {
  open: [27.89, 14.50],  // Previous: bearish (27.89 -> 15.36), Current: bullish (14.50 -> 30.20)
  high: [30.87, 30.50],
  close: [15.36, 30.20],
  low: [14.93, 14.00],
}

// Valid Bullish Engulfing - Perfect engulfment
var perfectEngulfment = {
  open: [25.00, 19.00],  // Previous bearish, Current opens at previous close
  high: [26.00, 27.00],
  close: [20.00, 26.00], // Previous bearish, Current closes at previous open
  low: [19.50, 18.50],
}

// Valid Bullish Engulfing - Minimal engulfment
var minimalEngulfment = {
  open: [25.00, 19.99],  // Previous bearish, Current opens just below previous close
  high: [26.00, 25.10],
  close: [20.00, 25.01], // Previous bearish, Current closes just above previous open
  low: [19.50, 19.50],
}

// Invalid - Both candles bullish
var bothBullish = {
  open: [22.00, 20.00],  // Both candles bullish
  high: [26.00, 25.00],
  close: [25.00, 24.00],
  low: [21.50, 19.50],
}

// Invalid - Current candle bearish
var currentBearish = {
  open: [25.00, 25.00],  // Previous bearish, current bearish
  high: [26.00, 26.00],
  close: [20.00, 20.00],
  low: [19.50, 19.50],
}

// Invalid - Previous candle bullish
var previousBullish = {
  open: [20.00, 20.00],  // Previous bullish, current bullish
  high: [25.00, 25.00],
  close: [24.00, 24.00],
  low: [19.50, 19.50],
}

// Invalid - No engulfment (current doesn't cover previous)
var noEngulfment = {
  open: [25.00, 21.00],  // Current doesn't engulf previous
  high: [26.00, 23.00],
  close: [20.00, 22.50],
  low: [19.50, 20.50],
}

// Invalid - Reverse engulfment (previous covers current)
var reverseEngulfment = {
  open: [18.00, 20.00],  // Previous engulfs current
  high: [30.00, 21.00],
  close: [15.00, 20.50],
  low: [14.00, 19.50],
}

// Edge case - Gap up opening
var gapUpOpening = {
  open: [25.00, 26.00],  // Gap up opening
  high: [26.00, 30.00],
  close: [20.00, 29.00],
  low: [19.50, 25.50],
}

// One day data (insufficient)
var oneDayData = {
  open: [20.00],
  high: [25.00],
  close: [24.00],
  low: [19.50],
}

describe('BullishEngulfingPattern : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(validBullishEngulfing);
    fs.writeFileSync(__dirname+'/images/bullishEngulfingPattern.svg',imageBuffer);
    
    var imageBuffer2 = drawCandleStick(perfectEngulfment);
    fs.writeFileSync(__dirname+'/images/perfectBullishEngulfing.svg',imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(gapUpOpening);
    fs.writeFileSync(__dirname+'/images/gapUpBullishEngulfing.svg',imageBuffer3);
  });
  
  // Positive test cases
  it('Check whether the supplied data has BullishEngulfingPattern pattern', function() {
   var bullishEngulfingPattern = new BullishEngulfingPattern ();
   var result = bullishEngulfingPattern.hasPattern(validBullishEngulfing);
   assert.deepEqual(result, true, 'Invalid result for BullishEngulfingPattern');
  });
  
  it('Should identify perfect engulfment pattern', function() {
   var bullishEngulfingPattern = new BullishEngulfingPattern ();
   var result = bullishEngulfingPattern.hasPattern(perfectEngulfment);
   assert.deepEqual(result, true, 'Should identify perfect engulfment pattern');
  });
  
  it('Should identify minimal engulfment pattern', function() {
   var bullishEngulfingPattern = new BullishEngulfingPattern ();
   var result = bullishEngulfingPattern.hasPattern(minimalEngulfment);
   assert.deepEqual(result, true, 'Should identify minimal engulfment pattern');
  });
  
  it('Should identify engulfing pattern with gap up opening', function() {
   var bullishEngulfingPattern = new BullishEngulfingPattern ();
   var result = bullishEngulfingPattern.hasPattern(gapUpOpening);
   assert.deepEqual(result, true, 'Should identify pattern with gap up opening');
  });
  
  // Negative test cases
  it('Should return false when both candles are bullish', function() {
   var bullishEngulfingPattern = new BullishEngulfingPattern ();
   var result = bullishEngulfingPattern.hasPattern(bothBullish);
   assert.deepEqual(result, false, 'Should return false when both candles are bullish');
  });
  
  it('Should return false when current candle is bearish', function() {
   var bullishEngulfingPattern = new BullishEngulfingPattern ();
   var result = bullishEngulfingPattern.hasPattern(currentBearish);
   assert.deepEqual(result, false, 'Should return false when current candle is bearish');
  });
  
  it('Should return false when previous candle is bullish', function() {
   var bullishEngulfingPattern = new BullishEngulfingPattern ();
   var result = bullishEngulfingPattern.hasPattern(previousBullish);
   assert.deepEqual(result, false, 'Should return false when previous candle is bullish');
  });
  
  it('Should return false when there is no engulfment', function() {
   var bullishEngulfingPattern = new BullishEngulfingPattern ();
   var result = bullishEngulfingPattern.hasPattern(noEngulfment);
   assert.deepEqual(result, false, 'Should return false when no engulfment occurs');
  });
  
  it('Should return false for reverse engulfment', function() {
   var bullishEngulfingPattern = new BullishEngulfingPattern ();
   var result = bullishEngulfingPattern.hasPattern(reverseEngulfment);
   assert.deepEqual(result, false, 'Should return false for reverse engulfment');
  });
  
  // Test insufficient data
  it('Should return false if less data is provided', function() {
   var bullishEngulfingPattern = new BullishEngulfingPattern ();
   var result = bullishEngulfingPattern.hasPattern(oneDayData);
   assert.deepEqual(result, false, 'Should return false for insufficient data');
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
   var bullishEngulfingPattern = new BullishEngulfingPattern(2);
   var result = bullishEngulfingPattern.hasPattern(validBullishEngulfing);
   assert.deepEqual(result, true, 'Should work with custom scale parameter');
  });
  
  // Test function export
  it('Should work using function export', function() {
   var bullishengulfingpattern = require('../../lib/candlestick/BullishEngulfingPattern').bullishengulfingpattern;
   var result = bullishengulfingpattern(validBullishEngulfing);
   assert.deepEqual(result, true, 'Should work using function export');
  });
  
  // Test getAllPatternIndex method
  it('Should return correct indices for all patterns in multi-day data', function() {
   var multiDayData = {
     // Creating a valid bullish engulfing pattern at position 1
     // Position 0: Random candle
     // Position 1: Valid bullish engulfing (previous bearish, current bullish)
     // Position 2: Random candle
     open: [20.00, 27.89, 14.50, 25.00],  // Position 1: previous=27.89, current=14.50
     high: [25.00, 30.87, 30.50, 26.00],
     close: [24.00, 15.36, 30.20, 20.00], // Position 1: previous=15.36 (bearish), current=30.20 (bullish)
     low: [19.50, 14.93, 14.00, 19.50],
   };
   var bullishEngulfingPattern = new BullishEngulfingPattern();
   var indices = bullishEngulfingPattern.getAllPatternIndex(multiDayData);
   assert.deepEqual(indices.length >= 1, true, 'Should find at least one pattern');
  });
  
  // Test empty data
  it('Should return false for empty data', function() {
   var bullishEngulfingPattern = new BullishEngulfingPattern ();
   var emptyData = { open: [], high: [], close: [], low: [] };
   var result = bullishEngulfingPattern.hasPattern(emptyData);
   assert.deepEqual(result, false, 'Should return false for empty data');
  });
});


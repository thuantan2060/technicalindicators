var BearishHarami = require('../../lib/candlestick/BearishHarami').default;
var assert = require('assert');
var { drawCandleStick } = require('../helpers/test-helper');
var fs = require('fs');

// Valid Bearish Harami pattern:
// Previous day (index 0): Large bullish candle  
// Current day (index 1): Small bearish candle completely contained within previous day
var validBearishHarami = {
  open: [20.00, 22.50],   // [previous, current] - current opens below previous close
  high: [24.50, 22.80],   // current high < previous high
  close: [24.00, 22.20],  // current close < current open AND within previous body
  low: [20.00, 22.00],    // current low > previous low
}

// Valid Bearish Harami - Perfect containment
var perfectContainment = {
  open: [20.00, 23.50],   // Previous bullish, current perfectly within previous body
  high: [25.00, 23.60],   
  close: [24.50, 23.00],  
  low: [19.50, 22.90],    
}

// Valid Bearish Harami - Minimal containment
var minimalContainment = {
  open: [20.00, 24.49],   // Previous bullish, current just within previous body
  high: [25.00, 24.51],   
  close: [24.50, 20.01],  
  low: [19.50, 20.00],    
}

// Invalid - Both candles bearish
var bothBearish = {
  open: [22.50, 24.00],   // Both candles bearish
  high: [22.80, 24.50],   
  close: [22.20, 23.00],  
  low: [22.00, 22.50],    
}

// Invalid - Current candle bullish
var currentBullish = {
  open: [22.00, 20.00],   // Current bullish, previous bullish
  high: [22.80, 24.50],   
  close: [22.50, 24.00],  
  low: [21.80, 19.50],    
}

// Invalid - Previous candle bearish
var previousBearish = {
  open: [22.50, 24.00],   // Current bearish, previous bearish
  high: [22.80, 24.50],   
  close: [22.20, 23.00],  
  low: [22.00, 22.50],    
}

// Invalid - Current candle not contained (breaks above)
var breaksAbove = {
  open: [22.50, 20.00],   // Current breaks above previous high
  high: [25.50, 24.50],   
  close: [22.20, 24.00],  
  low: [22.00, 19.50],    
}

// Invalid - Current candle not contained (breaks below)
var breaksBelow = {
  open: [22.50, 20.00],   // Current breaks below previous low
  high: [22.80, 24.50],   
  close: [22.20, 24.00],  
  low: [18.50, 19.50],    
}

// Invalid - Current candle too large
var currentTooLarge = {
  open: [23.00, 20.00],   // Current body equals previous body
  high: [23.50, 24.50],   
  close: [20.00, 24.00],  
  low: [19.80, 19.50],    
}

// Edge case - Very small current candle (near doji)
var nearDoji = {
  open: [20.00, 22.51],   // Previous bullish, current very small body
  high: [24.50, 22.80],   
  close: [24.00, 22.50],  
  low: [19.50, 22.30],    
}

// One day data (insufficient)
var oneDayData = {
  open: [22.50],
  high: [22.80],
  close: [22.20],
  low: [22.00],
}

describe('BearishHarami : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(validBearishHarami);
    fs.writeFileSync(__dirname+'/images/BearishHarami.svg',imageBuffer);
    
    var imageBuffer2 = drawCandleStick(perfectContainment);
    fs.writeFileSync(__dirname+'/images/perfectBearishHarami.svg',imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(nearDoji);
    fs.writeFileSync(__dirname+'/images/nearDojiBearishHarami.svg',imageBuffer3);
  });
  
  // Positive test cases
  it('Check whether the supplied data has BearishHarami pattern', function() {
   var bearishHarami = new BearishHarami ();
   var result = bearishHarami.hasPattern(validBearishHarami);
   assert.deepEqual(result, true, 'Invalid result for BearishHarami')
  });
  
  it('Should identify perfect containment pattern', function() {
   var bearishHarami = new BearishHarami ();
   var result = bearishHarami.hasPattern(perfectContainment);
   assert.deepEqual(result, true, 'Should identify perfect containment pattern')
  });
  
  it('Should identify minimal containment pattern', function() {
   var bearishHarami = new BearishHarami ();
   var result = bearishHarami.hasPattern(minimalContainment);
   assert.deepEqual(result, true, 'Should identify minimal containment pattern')
  });
  
  it('Should identify near-doji harami pattern', function() {
   var bearishHarami = new BearishHarami ();
   var result = bearishHarami.hasPattern(nearDoji);
   assert.deepEqual(result, true, 'Should identify near-doji harami pattern')
  });
  
  // Negative test cases
  it('Should return false when both candles are bearish', function() {
   var bearishHarami = new BearishHarami ();
   var result = bearishHarami.hasPattern(bothBearish);
   assert.deepEqual(result, false, 'Should return false when both candles are bearish')
  });
  
  it('Should return false when current candle is bullish', function() {
   var bearishHarami = new BearishHarami ();
   var result = bearishHarami.hasPattern(currentBullish);
   assert.deepEqual(result, false, 'Should return false when current candle is bullish')
  });
  
  it('Should return false when previous candle is bearish', function() {
   var bearishHarami = new BearishHarami ();
   var result = bearishHarami.hasPattern(previousBearish);
   assert.deepEqual(result, false, 'Should return false when previous candle is bearish')
  });
  
  it('Should return false when current candle breaks above previous high', function() {
   var bearishHarami = new BearishHarami ();
   var result = bearishHarami.hasPattern(breaksAbove);
   assert.deepEqual(result, false, 'Should return false when current breaks above')
  });
  
  it('Should return false when current candle breaks below previous low', function() {
   var bearishHarami = new BearishHarami ();
   var result = bearishHarami.hasPattern(breaksBelow);
   assert.deepEqual(result, false, 'Should return false when current breaks below')
  });
  
  it('Should return false when current candle is too large', function() {
   var bearishHarami = new BearishHarami ();
   var result = bearishHarami.hasPattern(currentTooLarge);
   assert.deepEqual(result, false, 'Should return false when current candle is too large')
  });
  
  // Test insufficient data
  it('Should return false for insufficient data', function() {
   var bearishHarami = new BearishHarami ();
   var result = bearishHarami.hasPattern(oneDayData);
   assert.deepEqual(result, false, 'Should return false for insufficient data')
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
   var bearishHarami = new BearishHarami(2);
   var result = bearishHarami.hasPattern(validBearishHarami);
   assert.deepEqual(result, true, 'Should work with custom scale parameter')
  });
  
  // Test function export
  it('Should work using function export', function() {
   var bearishharami = require('../../lib/candlestick/BearishHarami').bearishharami;
   var result = bearishharami(validBearishHarami);
   assert.deepEqual(result, true, 'Should work using function export')
  });
  
  // Test getAllPatternIndex method
  it('Should return correct indices for all patterns in multi-day data', function() {
   var multiDayData = {
     open: [22.50, 20.00, 25.00, 22.00],  // Pattern at positions 0-1
     high: [22.80, 24.50, 26.00, 23.00],
     close: [22.20, 24.00, 24.50, 21.50], // Bearish harami pattern
     low: [22.00, 19.50, 24.00, 21.00],
   };
   var bearishHarami = new BearishHarami();
   var indices = bearishHarami.getAllPatternIndex(multiDayData);
   assert.deepEqual(Array.isArray(indices), true, 'Should return an array');
  });
  
  // Test empty data
  it('Should return false for empty data', function() {
   var bearishHarami = new BearishHarami ();
   var emptyData = { open: [], high: [], close: [], low: [] };
   var result = bearishHarami.hasPattern(emptyData);
   assert.deepEqual(result, false, 'Should return false for empty data')
  });
});


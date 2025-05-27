var BullishHarami = require('../../lib/candlestick/BullishHarami').default;
var assert = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs = require('fs');

// Valid Bullish Harami pattern:
// Previous day (index 1): Large bearish candle  
// Current day (index 0): Small bullish candle completely contained within previous day
var validBullishHarami = {
  open: [21.80, 24.00],   // [current, previous] - current opens above previous close
  high: [22.50, 24.50],   // current high < previous high
  close: [22.20, 21.00],  // current close > current open AND within previous body
  low: [21.60, 21.00],    // current low > previous low
}

// Valid Bullish Harami - Perfect containment
var perfectContainment = {
  open: [21.50, 25.00],   // Current perfectly within previous body
  high: [22.00, 26.00],   
  close: [21.80, 20.00],  
  low: [21.40, 19.50],    
}

// Valid Bullish Harami - Minimal containment
var minimalContainment = {
  open: [20.01, 25.00],   // Current just within previous body
  high: [24.99, 26.00],   
  close: [24.49, 20.00],  
  low: [20.01, 19.50],    
}

// Invalid - Both candles bullish
var bothBullish = {
  open: [21.80, 20.00],   // Both candles bullish
  high: [22.50, 24.50],   
  close: [22.20, 24.00],  
  low: [21.60, 19.50],    
}

// Invalid - Current candle bearish
var currentBearish = {
  open: [22.20, 24.00],   // Current bearish, previous bearish
  high: [22.50, 24.50],   
  close: [21.80, 21.00],  
  low: [21.60, 20.50],    
}

// Invalid - Previous candle bullish
var previousBullish = {
  open: [21.80, 20.00],   // Current bullish, previous bullish
  high: [22.50, 24.50],   
  close: [22.20, 24.00],  
  low: [21.60, 19.50],    
}

// Invalid - Current candle not contained (breaks above)
var breaksAbove = {
  open: [21.80, 24.00],   // Current breaks above previous high
  high: [25.50, 24.50],   
  close: [22.20, 21.00],  
  low: [21.60, 20.50],    
}

// Invalid - Current candle not contained (breaks below)
var breaksBelow = {
  open: [21.80, 24.00],   // Current breaks below previous low
  high: [22.50, 24.50],   
  close: [22.20, 21.00],  
  low: [20.50, 21.00],    
}

// Invalid - Current candle body not contained
var bodyNotContained = {
  open: [20.50, 24.00],   // Current open below previous close
  high: [22.50, 24.50],   
  close: [22.20, 21.00],  
  low: [20.30, 20.50],    
}

// Invalid - Current candle too large
var currentTooLarge = {
  open: [21.00, 24.00],   // Current body equals previous body
  high: [22.50, 24.50],   
  close: [24.00, 21.00],  
  low: [20.80, 20.50],    
}

// Edge case - Very small current candle (near doji)
var nearDoji = {
  open: [22.01, 24.00],   // Very small body
  high: [22.50, 24.50],   
  close: [22.00, 21.00],  
  low: [21.80, 20.50],    
}

// Edge case - Large price range
var largePriceRange = {
  open: [95.50, 100.00],   
  high: [96.00, 102.00],   
  close: [95.80, 90.00],  
  low: [95.20, 89.50],    
}

// One day data (insufficient)
var oneDayData = {
  open: [21.80],
  high: [22.50],
  close: [22.20],
  low: [21.60],
}

// Invalid OHLC data
var invalidOHLC = {
  open: [21.80, 24.00],   
  high: [21.50, 24.50],   // Invalid: high < open
  close: [22.20, 21.00],  
  low: [22.80, 21.00],    // Invalid: low > close
}

describe('BullishHarami : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(validBullishHarami);
    fs.writeFileSync(__dirname+'/images/BullishHarami.svg',imageBuffer);
    
    var imageBuffer2 = drawCandleStick(perfectContainment);
    fs.writeFileSync(__dirname+'/images/perfectBullishHarami.svg',imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(largePriceRange);
    fs.writeFileSync(__dirname+'/images/largeBullishHarami.svg',imageBuffer3);
  });
  
  // Positive test cases
  it('Check whether the supplied data has BullishHarami pattern', function() {
   var bullishHarami = new BullishHarami ();
   var result = bullishHarami.hasPattern(validBullishHarami);
   assert.deepEqual(result, true, 'Invalid result for BullishHarami')
  });
  
  it('Should identify perfect containment pattern', function() {
   var bullishHarami = new BullishHarami ();
   var result = bullishHarami.hasPattern(perfectContainment);
   assert.deepEqual(result, true, 'Should identify perfect containment pattern')
  });
  
  it('Should identify minimal containment pattern', function() {
   var bullishHarami = new BullishHarami ();
   var result = bullishHarami.hasPattern(minimalContainment);
   assert.deepEqual(result, true, 'Should identify minimal containment pattern')
  });
  
  it('Should identify near-doji harami pattern', function() {
   var bullishHarami = new BullishHarami ();
   var result = bullishHarami.hasPattern(nearDoji);
   assert.deepEqual(result, true, 'Should identify near-doji harami pattern')
  });
  
  it('Should identify pattern with large price range', function() {
   var bullishHarami = new BullishHarami ();
   var result = bullishHarami.hasPattern(largePriceRange);
   assert.deepEqual(result, true, 'Should identify pattern with large price range')
  });
  
  // Negative test cases
  it('Should return false when both candles are bullish', function() {
   var bullishHarami = new BullishHarami ();
   var result = bullishHarami.hasPattern(bothBullish);
   assert.deepEqual(result, false, 'Should return false when both candles are bullish')
  });
  
  it('Should return false when current candle is bearish', function() {
   var bullishHarami = new BullishHarami ();
   var result = bullishHarami.hasPattern(currentBearish);
   assert.deepEqual(result, false, 'Should return false when current candle is bearish')
  });
  
  it('Should return false when previous candle is bullish', function() {
   var bullishHarami = new BullishHarami ();
   var result = bullishHarami.hasPattern(previousBullish);
   assert.deepEqual(result, false, 'Should return false when previous candle is bullish')
  });
  
  it('Should return false when current candle breaks above previous high', function() {
   var bullishHarami = new BullishHarami ();
   var result = bullishHarami.hasPattern(breaksAbove);
   assert.deepEqual(result, false, 'Should return false when current breaks above')
  });
  
  it('Should return false when current candle breaks below previous low', function() {
   var bullishHarami = new BullishHarami ();
   var result = bullishHarami.hasPattern(breaksBelow);
   assert.deepEqual(result, false, 'Should return false when current breaks below')
  });
  
  it('Should return false when current candle body is not contained', function() {
   var bullishHarami = new BullishHarami ();
   var result = bullishHarami.hasPattern(bodyNotContained);
   assert.deepEqual(result, false, 'Should return false when body not contained')
  });
  
  it('Should return false when current candle is too large', function() {
   var bullishHarami = new BullishHarami ();
   var result = bullishHarami.hasPattern(currentTooLarge);
   assert.deepEqual(result, false, 'Should return false when current candle is too large')
  });
  
  it('Should return false for invalid OHLC data', function() {
   var bullishHarami = new BullishHarami ();
   var result = bullishHarami.hasPattern(invalidOHLC);
   assert.deepEqual(result, false, 'Should return false for invalid OHLC data')
  });
  
  // Test insufficient data
  it('Should return false for insufficient data', function() {
   var bullishHarami = new BullishHarami ();
   var result = bullishHarami.hasPattern(oneDayData);
   assert.deepEqual(result, false, 'Should return false for insufficient data')
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
   var bullishHarami = new BullishHarami(2);
   var result = bullishHarami.hasPattern(validBullishHarami);
   assert.deepEqual(result, true, 'Should work with custom scale parameter')
  });
  
  // Test function export
  it('Should work using function export', function() {
   var bullishharami = require('../../lib/candlestick/BullishHarami').bullishharami;
   var result = bullishharami(validBullishHarami);
   assert.deepEqual(result, true, 'Should work using function export')
  });
  
  // Test getAllPatternIndex method
  it('Should return correct indices for all patterns in multi-day data', function() {
   var multiDayData = {
     open: [21.80, 24.00, 25.00, 22.00],  // Pattern at positions 0-1
     high: [22.50, 24.50, 26.00, 23.00],
     close: [22.20, 21.00, 24.50, 21.50], // Bullish harami pattern
     low: [21.60, 20.50, 24.00, 21.00],
   };
   var bullishHarami = new BullishHarami();
   var indices = bullishHarami.getAllPatternIndex(multiDayData);
   assert.deepEqual(Array.isArray(indices), true, 'Should return an array');
  });
  
  // Test empty data
  it('Should return false for empty data', function() {
   var bullishHarami = new BullishHarami ();
   var emptyData = { open: [], high: [], close: [], low: [] };
   var result = bullishHarami.hasPattern(emptyData);
   assert.deepEqual(result, false, 'Should return false for empty data')
  });
});


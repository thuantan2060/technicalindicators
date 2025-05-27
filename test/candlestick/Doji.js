var Doji = require('../../lib/candlestick/Doji').default;
var assert = require('assert');
var { drawCandleStick } = require('../helpers/test-helper');
var fs = require('fs');

// Valid Doji - original test case
var validDoji = {
  open: [30.10],
  high: [32.10],
  close: [30.13],
  low: [28.10],
}

// Valid Doji - Perfect doji (open = close)
var perfectDoji = {
  open: [30.10],
  high: [30.11],
  close: [30.10],
  low: [30.09],
}

// Valid Doji - Long-legged doji
var longLeggedDoji = {
  open: [50.00],
  high: [55.00],  // Long upper shadow
  close: [49.98], // Almost equals open
  low: [45.00],   // Long lower shadow
}

// Invalid - Bullish candle with large body
var bullishCandle = {
  open: [30.00],
  high: [32.00],
  close: [31.50], // Clear body
  low: [29.50],
}

// Invalid - Bearish candle with large body
var bearishCandle = {
  open: [31.50],
  high: [32.00],
  close: [30.00], // Clear body
  low: [29.50],
}

// Invalid - High less than close (invalid OHLC)
var invalidHighLow = {
  open: [30.10],
  high: [29.50],  // Invalid: high < open and close
  close: [30.13],
  low: [31.00],   // Invalid: low > open and close
}

// Edge case - Minimal price movement
var minimalMovement = {
  open: [100.0001],
  high: [100.0002],
  close: [100.0000],
  low: [99.9999],
}

// Valid Doji - Different scale
var largePriceDoji = {
  open: [1000.50],
  high: [1020.00],
  close: [1000.52], // Very close to open
  low: [980.00],
}

describe('Doji : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(validDoji);
    fs.writeFileSync(__dirname+'/images/doji.svg',imageBuffer);
    
    var imageBuffer2 = drawCandleStick(perfectDoji);
    fs.writeFileSync(__dirname+'/images/perfectDoji.svg',imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(longLeggedDoji);
    fs.writeFileSync(__dirname+'/images/longLeggedDoji.svg',imageBuffer3);
  });
  
  // Positive test cases
  it('Check whether the supplied data has Doji pattern', function() {
   var doji = new Doji();
   var result = doji.hasPattern(validDoji);
   assert.deepEqual(result, true, 'Invalid result for Doji');
  });
  
  it('Check whether the supplied data has perfect Doji pattern', function() {
   var doji = new Doji();
   var result = doji.hasPattern(perfectDoji);
   assert.deepEqual(result, true, 'Invalid result for a perfect Doji');
  });
  
  it('Should identify long-legged doji', function() {
   var doji = new Doji();
   var result = doji.hasPattern(longLeggedDoji);
   assert.deepEqual(result, true, 'Should identify long-legged doji');
  });
  
  it('Should identify doji with minimal price movement', function() {
   var doji = new Doji();
   var result = doji.hasPattern(minimalMovement);
   assert.deepEqual(result, true, 'Should identify doji with minimal price movement');
  });
  
  it('Should identify doji at larger price scale', function() {
   var doji = new Doji();
   var result = doji.hasPattern(largePriceDoji);
   assert.deepEqual(result, true, 'Should identify doji at larger price scale');
  });
  
  // Negative test cases
  it('Should return false for bullish candle with clear body', function() {
   var doji = new Doji();
   var result = doji.hasPattern(bullishCandle);
   assert.deepEqual(result, false, 'Should return false for bullish candle');
  });
  
  it('Should return false for bearish candle with clear body', function() {
   var doji = new Doji();
   var result = doji.hasPattern(bearishCandle);
   assert.deepEqual(result, false, 'Should return false for bearish candle');
  });
  
  it('Should return false for invalid OHLC data', function() {
   var doji = new Doji();
   var result = doji.hasPattern(invalidHighLow);
   assert.deepEqual(result, false, 'Should return false for invalid OHLC data');
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
   var doji = new Doji(2);
   var result = doji.hasPattern(validDoji);
   assert.deepEqual(result, true, 'Should work with custom scale parameter');
  });
  
  // Test function export
  it('Should work using function export', function() {
   var dojiFunction = require('../../lib/candlestick/Doji').doji;
   var result = dojiFunction(validDoji);
   assert.deepEqual(result, true, 'Should work using function export');
  });
  
  // Test insufficient data
  it('Should return false for insufficient data', function() {
   var doji = new Doji();
   var emptyData = { open: [], high: [], close: [], low: [] };
   var result = doji.hasPattern(emptyData);
   assert.deepEqual(result, false, 'Should return false for empty data');
  });
  
  // Test getAllPatternIndex method
  it('Should return correct indices for all doji patterns in multi-day data', function() {
   var multiDayData = {
     open: [30.10, 25.00, 30.10, 40.00],  // Day with doji at index 0 and 2
     high: [32.10, 27.00, 30.11, 42.00],
     close: [30.13, 24.50, 30.10, 41.50], // Doji at index 0, not at 1, doji at 2, not at 3
     low: [28.10, 23.00, 30.09, 39.00],
   };
   var doji = new Doji();
   var indices = doji.getAllPatternIndex(multiDayData);
   assert.deepEqual(indices.length, 2, 'Should find 2 doji patterns');
   assert.deepEqual(indices.includes(0), true, 'Should include index 0');
   assert.deepEqual(indices.includes(2), true, 'Should include index 2');
  });
});

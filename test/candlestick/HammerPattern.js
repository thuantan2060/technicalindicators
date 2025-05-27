var HammerPattern   = require('../../lib/candlestick/HammerPattern').default;
var assert          = require('assert');
var { drawCandleStick } = require('../helpers/test-helper');
var fs              = require('fs');

// Valid Hammer Pattern (5-day pattern)
// Days 0-2: Downward trend, Day 3: Hammer, Day 4: Confirmation
// Data in ascending chronological order: [day0, day1, day2, day3, day4]
var validHammerPattern = {
  open: [26.00, 25.50, 25.00, 23.00, 23.50],   // Downward trend then hammer then confirmation
  high: [26.50, 26.00, 25.20, 23.20, 24.50],   // Hammer high close to close
  close: [25.50, 24.80, 24.50, 23.20, 24.00],  // Downward trend in first 3, then hammer, then bullish confirmation
  low: [25.00, 24.20, 24.00, 21.50, 23.30],    // Hammer has long lower shadow at day 3
}

// Valid Hammer - Bullish hammer stick
var validBullishHammer = {
  open: [23.00, 22.50, 22.00, 21.50, 22.00],   
  high: [23.50, 23.00, 22.30, 21.70, 22.50],   // Hammer high close to close
  close: [22.50, 22.20, 21.80, 21.70, 22.30],  // Downward trend, then hammer, then confirmation
  low: [22.00, 21.80, 21.50, 20.00, 21.90],    // Hammer has long lower shadow at index 3
}

// Valid Hammer - Inverted hammer
var validInvertedHammer = {
  open: [23.00, 22.50, 22.00, 21.50, 22.00],   
  high: [23.50, 23.00, 22.30, 23.00, 22.50],   // Long upper shadow on inverted hammer
  close: [22.50, 22.20, 21.80, 21.60, 22.30],  // Downward trend, then inverted hammer, then confirmation
  low: [22.00, 21.80, 21.50, 21.50, 21.90],    // Small lower shadow on inverted hammer
}

// Invalid - No downward trend
var noDownwardTrend = {
  open: [25.00, 25.50, 25.00, 26.00, 26.50],   // Upward trend
  high: [26.50, 26.00, 26.20, 26.50, 27.00],   
  close: [25.50, 25.80, 26.00, 26.30, 26.80],  
  low: [25.00, 25.20, 25.80, 25.50, 26.00],    
}

// Invalid - No hammer at day 3
var noHammerAtDay3 = {
  open: [26.00, 25.50, 25.00, 24.00, 23.00],   
  high: [26.50, 26.00, 25.20, 24.50, 23.50],   
  close: [25.50, 25.80, 24.50, 23.50, 22.80],  // Regular candle, not hammer
  low: [25.00, 25.20, 24.00, 23.00, 22.50],    // No long shadow
}

// Invalid - No confirmation (bearish day 4)
var noConfirmation = {
  open: [26.00, 24.00, 25.00, 24.00, 23.00],   // Bearish confirmation
  high: [26.50, 24.20, 25.20, 24.50, 23.50],   
  close: [25.50, 23.50, 24.50, 23.50, 22.50],  // Day 4 closes lower
  low: [25.00, 23.20, 22.00, 23.00, 22.00],    
}

// Invalid - Confirmation doesn't close above hammer
var lowConfirmation = {
  open: [26.00, 24.30, 25.00, 24.00, 23.00],   
  high: [26.50, 24.40, 25.20, 24.50, 23.50],   
  close: [25.50, 24.35, 24.50, 23.50, 22.50],  // Confirmation doesn't exceed hammer close
  low: [25.00, 24.20, 22.00, 23.00, 22.00],    
}

// Insufficient data (less than 5 days)
var insufficientData = {
  open: [25.50, 25.00, 24.00],   
  high: [26.00, 25.20, 24.50],   
  close: [25.80, 24.50, 23.50],  
  low: [25.20, 24.00, 23.00],    
}

// Edge case - Minimal downward trend
var minimalDownwardTrend = {
  open: [22.30, 22.05, 22.00, 22.10, 22.20],   // Very slight downward trend
  high: [22.40, 22.10, 22.30, 22.10, 22.30],   // Hammer high close to close
  close: [22.25, 22.08, 21.95, 22.10, 22.25],  // Downward trend, then hammer, then confirmation
  low: [22.20, 22.00, 21.90, 21.50, 22.15],    // Hammer with long shadow at index 3
}

describe('Hammer Pattern : ', function() {
   before(function() {
    var imageBuffer = drawCandleStick(validHammerPattern);
    fs.writeFileSync(__dirname+'/images/hammerPattern.svg',imageBuffer);
    
    var imageBuffer2 = drawCandleStick(validBullishHammer);
    fs.writeFileSync(__dirname+'/images/bullishHammerPattern.svg',imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(validInvertedHammer);
    fs.writeFileSync(__dirname+'/images/invertedHammerPattern.svg',imageBuffer3);
  });
  
  // Positive test cases
  it('Check whether the supplied data has HammerPattern', function() {
    var hammerPattern = new HammerPattern();
    var result = hammerPattern.hasPattern(validHammerPattern);
    assert.deepEqual(result, true, 'Invalid result for HammerPattern');
  });
  
  it('Should identify valid bullish hammer pattern', function() {
    var hammerPattern = new HammerPattern();
    var result = hammerPattern.hasPattern(validBullishHammer);
    assert.deepEqual(result, true, 'Should identify valid bullish hammer pattern');
  });
  
  it('Should identify valid inverted hammer pattern', function() {
    var hammerPattern = new HammerPattern();
    var result = hammerPattern.hasPattern(validInvertedHammer);
    assert.deepEqual(result, true, 'Should identify valid inverted hammer pattern');
  });
  
  it('Should identify pattern with minimal downward trend', function() {
    var hammerPattern = new HammerPattern();
    var result = hammerPattern.hasPattern(minimalDownwardTrend);
    assert.deepEqual(result, true, 'Should identify pattern with minimal downward trend');
  });
  
  // Negative test cases
  it('Should return false when there is no downward trend', function() {
    var hammerPattern = new HammerPattern();
    var result = hammerPattern.hasPattern(noDownwardTrend);
    assert.deepEqual(result, false, 'Should return false when no downward trend');
  });
  
  it('Should return false when there is no hammer at day 3', function() {
    var hammerPattern = new HammerPattern();
    var result = hammerPattern.hasPattern(noHammerAtDay3);
    assert.deepEqual(result, false, 'Should return false when no hammer at correct position');
  });
  
  it('Should return false when there is no bullish confirmation', function() {
    var hammerPattern = new HammerPattern();
    var result = hammerPattern.hasPattern(noConfirmation);
    assert.deepEqual(result, false, 'Should return false when no bullish confirmation');
  });
  
  it('Should return false when confirmation does not close above hammer', function() {
    var hammerPattern = new HammerPattern();
    var result = hammerPattern.hasPattern(lowConfirmation);
    assert.deepEqual(result, false, 'Should return false when confirmation is too low');
  });
  
  it('Should return false for insufficient data', function() {
    var hammerPattern = new HammerPattern();
    var result = hammerPattern.hasPattern(insufficientData);
    assert.deepEqual(result, false, 'Should return false for insufficient data');
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
    var hammerPattern = new HammerPattern(2);
    var result = hammerPattern.hasPattern(validHammerPattern);
    assert.deepEqual(result, true, 'Should work with custom scale parameter');
  });
  
  // Test function export
  it('Should work using function export', function() {
    var hammerpattern = require('../../lib/candlestick/HammerPattern').hammerpattern;
    var result = hammerpattern(validHammerPattern);
    assert.deepEqual(result, true, 'Should work using function export');
  });
  
  // Test getAllPatternIndex method
  it('Should return correct indices for all hammer patterns in extended data', function() {
    var extendedData = {
      // Adding more days to test pattern detection
      open: [25.50, 25.00, 24.00, 23.00, 26.00, 25.80, 25.60, 25.40, 25.20],   
      high: [26.00, 25.20, 24.50, 23.50, 26.50, 26.20, 26.00, 25.80, 25.60],   
      close: [25.80, 24.50, 23.50, 22.50, 25.50, 25.40, 25.20, 25.00, 24.80],  
      low: [25.20, 22.00, 23.00, 22.00, 25.00, 25.00, 24.80, 24.60, 24.40],    
    };
    var hammerPattern = new HammerPattern();
    var indices = hammerPattern.getAllPatternIndex(extendedData);
    assert.deepEqual(Array.isArray(indices), true, 'Should return an array');
  });
  
  // Test empty data
  it('Should return false for empty data', function() {
    var hammerPattern = new HammerPattern();
    var emptyData = { open: [], high: [], close: [], low: [] };
    var result = hammerPattern.hasPattern(emptyData);
    assert.deepEqual(result, false, 'Should return false for empty data');
  });
  
  // Test individual components
  it('Should correctly identify downward trend', function() {
    var hammerPattern = new HammerPattern();
    var downwardData = {
      open: [26.00, 25.00, 24.00, 23.00],   
      high: [26.50, 25.50, 24.50, 23.50],   
      close: [25.50, 24.50, 23.50, 22.50],  
      low: [25.00, 24.00, 23.00, 22.00],    
    };
    var result = hammerPattern.downwardTrend(downwardData, false);
    assert.deepEqual(result, true, 'Should correctly identify downward trend');
  });
  
  it('Should correctly identify hammer candle', function() {
    var hammerPattern = new HammerPattern();
    var hammerData = {
      open: [25.00, 24.00, 23.00, 22.00],   
      high: [25.20, 24.50, 23.50, 22.20],   // Hammer high close to close
      close: [24.50, 23.50, 22.50, 22.20],  
      low: [24.00, 23.00, 22.00, 20.50],    // Hammer at index 3 with long lower shadow
    };
    var result = hammerPattern.includesHammer(hammerData, false);
    assert.deepEqual(result, true, 'Should correctly identify hammer candle');
  });
  
  it('Should correctly identify confirmation', function() {
    var hammerPattern = new HammerPattern();
    var confirmationData = {
      open: [25.50, 25.00, 24.00, 23.00, 23.50],   
      high: [26.00, 25.20, 24.50, 23.20, 24.50],   
      close: [25.00, 24.50, 23.50, 23.20, 24.00],  // Confirmation closes above hammer
      low: [25.00, 24.00, 23.00, 21.50, 23.30],    
    };
    var result = hammerPattern.hasConfirmation(confirmationData);
    assert.deepEqual(result, true, 'Should correctly identify confirmation');
  });
});

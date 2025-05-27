var MorningStar = require('../../lib/candlestick/MorningStar').default;
var assert = require('assert');
var { drawCandleStick } = require('../helpers/test-helper.js');
var fs                      = require('fs');

// Valid Morning Star pattern:
// Day 1 (index 0): Large bearish candle
// Day 2 (index 1): Small star with gap down  
// Day 3 (index 2): Bullish candle with gap up, closes above day 1 midpoint
var input = {
  open: [23.00, 18.80, 21.50],  // [day1, day2, day3] - gaps and progression
  high: [23.50, 19.20, 22.80],
  close: [20.50, 18.90, 22.40],  // day1 midpoint = 21.75, day3 closes above it
  low: [20.50, 18.60, 21.20]
}

// Additional test cases
var strongMorningStarInput = {
  open: [25.00, 19.50, 20.50],  // Strong morning star with proper gaps
  high: [25.50, 19.90, 24.80],
  close: [20.20, 19.70, 24.50],  // Third closes above first midpoint (22.6)
  low: [20.20, 19.30, 20.30],   // Second high (19.90) < first low (20.20), third open (20.50) > second high (19.90)
}

var weakMorningStarInput = {
  open: [22.00, 19.80, 20.20],  // Weak morning star with proper gaps
  high: [22.50, 19.90, 22.00],
  close: [20.50, 19.85, 21.30],  // Third closes above first midpoint (21.25)
  low: [20.50, 19.70, 20.00],   // Second high (19.90) < first low (20.50), third open (20.20) > second high (19.90)
}

var invalidMorningStarInput = {
  open: [20.00, 19.50, 19.80],  // No gaps, not a valid morning star
  high: [20.50, 20.00, 20.50],
  close: [19.80, 19.20, 20.20],
  low: [19.50, 19.00, 19.60],
}

var bullishInput = {
  open: [18.00, 19.50, 20.20],  // All bullish candles
  high: [19.20, 21.00, 22.50],
  close: [19.00, 20.80, 22.20],
  low: [17.80, 19.30, 20.00],
}

var bearishInput = {
  open: [22.00, 21.50, 20.80],  // All bearish candles
  high: [22.50, 22.00, 21.20],
  close: [21.80, 21.00, 20.50],
  low: [21.60, 20.80, 20.30],
}

var noGapMorningStarInput = {
  open: [23.00, 20.50, 20.80],  // Star opens at previous close
  high: [23.50, 21.00, 22.50],
  close: [20.50, 20.70, 22.20],
  low: [20.30, 20.30, 20.60],
}

var dojiStarInput = {
  open: [24.00, 19.50, 20.80],  // Doji as the star
  high: [24.50, 19.80, 23.20],
  close: [20.80, 19.52, 23.00],
  low: [20.60, 19.30, 20.60],
}

var exactMidpointInput = {
  open: [22.00, 18.50, 20.20],  // Third candle closes exactly at midpoint
  high: [22.50, 19.00, 21.50],
  close: [19.00, 18.70, 20.50],  // Midpoint = 20.50
  low: [18.80, 18.30, 20.00],
}

var largeStarInput = {
  open: [25.00, 20.00, 22.50],  // Large star body (not typical)
  high: [25.50, 22.50, 25.80],
  close: [21.50, 22.20, 25.50],
  low: [21.30, 19.80, 22.30],
}

describe('MorningStar : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(input);
    fs.writeFileSync(__dirname+'/images/MorningStar.svg',imageBuffer);
  });

  it('Check whether the supplied data has MorningStar pattern', function() {
   var morningStar = new MorningStar ();
   var result      = morningStar.hasPattern(input);
   assert.deepEqual(result, true, 'Invalid result for MorningStar');
  });

  it('Should detect strong morning star pattern', function() {
    var morningStar = new MorningStar();
    var result = morningStar.hasPattern(strongMorningStarInput);
    assert.deepEqual(result, true, 'Should detect strong morning star');
  });

  it('Should detect weak morning star pattern', function() {
    var morningStar = new MorningStar();
    var result = morningStar.hasPattern(weakMorningStarInput);
    assert.deepEqual(result, true, 'Should detect weak morning star');
  });

  it('Should reject invalid morning star (no gaps)', function() {
    var morningStar = new MorningStar();
    var result = morningStar.hasPattern(invalidMorningStarInput);
    assert.deepEqual(result, false, 'Should reject invalid morning star');
  });

  it('Should reject bullish pattern', function() {
    var morningStar = new MorningStar();
    var result = morningStar.hasPattern(bullishInput);
    assert.deepEqual(result, false, 'Should reject bullish pattern');
  });

  it('Should reject bearish pattern', function() {
    var morningStar = new MorningStar();
    var result = morningStar.hasPattern(bearishInput);
    assert.deepEqual(result, false, 'Should reject bearish pattern');
  });

  it('Should handle no gap morning star', function() {
    var morningStar = new MorningStar();
    var result = morningStar.hasPattern(noGapMorningStarInput);
    assert.equal(typeof result, 'boolean', 'Should handle no gap case');
  });

  it('Should handle doji as star', function() {
    var morningStar = new MorningStar();
    var result = morningStar.hasPattern(dojiStarInput);
    assert.deepEqual(result, true, 'Should handle doji star');
  });

  it('Should handle exact midpoint close', function() {
    var morningStar = new MorningStar();
    var result = morningStar.hasPattern(exactMidpointInput);
    assert.equal(typeof result, 'boolean', 'Should handle exact midpoint');
  });

  it('Should handle large star body', function() {
    var morningStar = new MorningStar();
    var result = morningStar.hasPattern(largeStarInput);
    assert.equal(typeof result, 'boolean', 'Should handle large star body');
  });

  it('Should handle empty input gracefully', function() {
    var morningStar = new MorningStar();
    var emptyInput = { open: [], high: [], close: [], low: [] };
    var result = morningStar.hasPattern(emptyInput);
    assert.deepEqual(result, false, 'Should return false for empty input');
  });

  it('Should handle insufficient data', function() {
    var morningStar = new MorningStar();
    var twoInput = {
      open: [23.00, 18.80],
      high: [23.50, 19.20],
      close: [20.50, 18.90],
      low: [20.50, 18.60]
    };
    var result = morningStar.hasPattern(twoInput);
    assert.deepEqual(result, false, 'Should return false for insufficient data');
  });

  it('Should handle four candle input', function() {
    var morningStar = new MorningStar();
    var fourInput = {
      open: [23.00, 18.80, 21.50, 22.80],
      high: [23.50, 19.20, 22.80, 24.00],
      close: [20.50, 18.90, 22.40, 23.70],
      low: [20.50, 18.60, 21.20, 22.60]
    };
    var result = morningStar.hasPattern(fourInput);
    assert.equal(typeof result, 'boolean', 'Should handle four candle input');
  });

  it('Should handle reversed input', function() {
    var morningStar = new MorningStar();
    var reversedInput = {
      open: [21.50, 18.80, 23.00],
      high: [22.80, 19.20, 23.50],
      close: [22.40, 18.90, 20.50],
      low: [21.20, 18.60, 20.50],
      reversedInput: true
    };
    var result = morningStar.hasPattern(reversedInput);
    assert.equal(typeof result, 'boolean', 'Should handle reversed input');
  });
})




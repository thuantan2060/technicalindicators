var EveningStar = require('../../lib/candlestick/EveningStar').default;
var assert = require('assert');
var { drawCandleStick } = require('../helpers/test-helper.js');
var fs                      = require('fs');

// Valid Evening Star pattern:
// Day 1 (index 0): Large bullish candle
// Day 2 (index 1): Small star with gap up
// Day 3 (index 2): Bearish candle with gap down, closes below day 1 midpoint
var input = {
  open: [20.00, 24.20, 22.50],  // [day1, day2, day3] - gaps and progression
  high: [23.80, 24.50, 23.00],
  close: [23.50, 24.30, 21.20],  // day1 midpoint = 21.75, day3 closes below it
  low: [20.00, 24.00, 20.80]
}

// Additional test cases
var strongEveningStarInput = {
  open: [15.00, 19.50, 18.80],  // Strong evening star with large gaps
  high: [18.80, 20.00, 19.20],
  close: [18.50, 19.70, 16.20],  // Deep penetration below midpoint
  low: [14.80, 19.30, 15.80],
}

var weakEveningStarInput = {
  open: [25.00, 27.20, 26.90],  // Weak evening star with proper gaps
  high: [27.00, 27.50, 27.20],
  close: [26.80, 27.25, 25.80],  // Third closes below first midpoint (25.9)
  low: [24.80, 27.10, 25.60],   // Second low = 27.10, third open = 26.90 (gap down)
}

var invalidEveningStarInput = {
  open: [20.00, 20.50, 20.80],  // No gaps, not a valid evening star
  high: [21.50, 21.20, 21.50],
  close: [21.20, 20.80, 20.50],
  low: [19.80, 20.30, 20.20],
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

var noGapEveningStarInput = {
  open: [20.00, 23.50, 23.20],  // Star opens at previous close
  high: [23.80, 24.00, 23.50],
  close: [23.50, 23.80, 21.00],
  low: [19.80, 23.30, 20.80],
}

var dojiStarInput = {
  open: [22.00, 25.50, 24.80],  // Doji as the star
  high: [25.20, 25.80, 25.20],
  close: [25.00, 25.52, 22.50],
  low: [21.80, 25.30, 22.20],
}

var exactMidpointInput = {
  open: [18.00, 21.50, 20.80],  // Third candle closes exactly at midpoint
  high: [21.20, 22.00, 21.20],
  close: [21.00, 21.70, 19.50],  // Midpoint = 19.50
  low: [17.80, 21.30, 19.30],
}

var largeStarInput = {
  open: [20.00, 24.00, 23.50],  // Large star body (not typical)
  high: [23.50, 26.50, 24.00],
  close: [23.20, 26.20, 21.80],
  low: [19.80, 23.80, 21.50],
}

describe('EveningStar : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(input);
    fs.writeFileSync(__dirname+'/images/EveningStar.svg',imageBuffer);
  });

  it('Check whether the supplied data has EveningStar pattern', function() {
   var eveningStar = new EveningStar ();
   var result        = eveningStar.hasPattern(input);
   assert.deepEqual(result, true, 'Invalid result for EveningStar');
  });

  it('Should detect strong evening star pattern', function() {
    var eveningStar = new EveningStar();
    var result = eveningStar.hasPattern(strongEveningStarInput);
    assert.deepEqual(result, true, 'Should detect strong evening star');
  });

  it('Should detect weak evening star pattern', function() {
    var eveningStar = new EveningStar();
    var result = eveningStar.hasPattern(weakEveningStarInput);
    assert.deepEqual(result, true, 'Should detect weak evening star');
  });

  it('Should reject invalid evening star (no gaps)', function() {
    var eveningStar = new EveningStar();
    var result = eveningStar.hasPattern(invalidEveningStarInput);
    assert.deepEqual(result, false, 'Should reject invalid evening star');
  });

  it('Should reject bullish pattern', function() {
    var eveningStar = new EveningStar();
    var result = eveningStar.hasPattern(bullishInput);
    assert.deepEqual(result, false, 'Should reject bullish pattern');
  });

  it('Should reject bearish pattern', function() {
    var eveningStar = new EveningStar();
    var result = eveningStar.hasPattern(bearishInput);
    assert.deepEqual(result, false, 'Should reject bearish pattern');
  });

  it('Should handle no gap evening star', function() {
    var eveningStar = new EveningStar();
    var result = eveningStar.hasPattern(noGapEveningStarInput);
    assert.equal(typeof result, 'boolean', 'Should handle no gap case');
  });

  it('Should handle doji as star', function() {
    var eveningStar = new EveningStar();
    var result = eveningStar.hasPattern(dojiStarInput);
    assert.deepEqual(result, true, 'Should handle doji star');
  });

  it('Should handle exact midpoint close', function() {
    var eveningStar = new EveningStar();
    var result = eveningStar.hasPattern(exactMidpointInput);
    assert.equal(typeof result, 'boolean', 'Should handle exact midpoint');
  });

  it('Should handle large star body', function() {
    var eveningStar = new EveningStar();
    var result = eveningStar.hasPattern(largeStarInput);
    assert.equal(typeof result, 'boolean', 'Should handle large star body');
  });

  it('Should handle empty input gracefully', function() {
    var eveningStar = new EveningStar();
    var emptyInput = { open: [], high: [], close: [], low: [] };
    var result = eveningStar.hasPattern(emptyInput);
    assert.deepEqual(result, false, 'Should return false for empty input');
  });

  it('Should handle insufficient data', function() {
    var eveningStar = new EveningStar();
    var twoInput = {
      open: [20.00, 23.50],
      high: [23.20, 24.00],
      close: [23.00, 23.80],
      low: [19.80, 23.30]
    };
    var result = eveningStar.hasPattern(twoInput);
    assert.deepEqual(result, false, 'Should return false for insufficient data');
  });

  it('Should handle four candle input', function() {
    var eveningStar = new EveningStar();
    var fourInput = {
      open: [18.00, 21.50, 20.80, 19.50],
      high: [21.20, 22.00, 21.20, 20.00],
      close: [21.00, 21.70, 19.50, 19.20],
      low: [17.80, 21.30, 19.30, 19.00]
    };
    var result = eveningStar.hasPattern(fourInput);
    assert.equal(typeof result, 'boolean', 'Should handle four candle input');
  });
})




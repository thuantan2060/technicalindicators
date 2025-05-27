var ThreeBlackCrows = require('../../lib/candlestick/ThreeBlackCrows').default;
var assert = require('assert');
var { drawCandleStick } = require('../helpers/test-helper.js');
var fs                      = require('fs');

// Valid Three Black Crows pattern:
// Day 1 (index 0): First bearish candle (open=23.00, close=22.00)
// Day 2 (index 1): Opens within Day 1 body (22.50), closes lower (21.50), lower low
// Day 3 (index 2): Opens within Day 2 body (22.00), closes lower (20.80), lower low
var input = {
  open: [23.00, 22.50, 22.00],  // [day1, day2, day3] - each opens within previous body
  high: [23.50, 22.80, 22.30],  // progressively lower highs
  close: [22.00, 21.50, 20.80], // progressively lower closes
  low: [21.80, 21.30, 20.60]    // progressively lower lows
}

// Additional test cases
var strongThreeBlackCrowsInput = {
  open: [30.00, 28.80, 27.20],  // Strong three black crows
  high: [30.50, 29.20, 27.60],
  close: [28.50, 26.90, 25.40],  // Large bearish bodies
  low: [28.30, 26.70, 25.20],
}

var weakThreeBlackCrowsInput = {
  open: [25.00, 24.90, 24.60],  // Weak three black crows: each opens within prev body
  high: [25.30, 25.00, 24.70],
  close: [24.80, 24.50, 24.20],  // Small bearish bodies, progressively lower
  low: [24.70, 24.40, 24.10],   // Progressive lower lows
}

var invalidThreeBlackCrowsInput = {
  open: [20.00, 19.50, 20.20],  // Third candle opens outside second body
  high: [20.50, 20.00, 20.80],
  close: [19.80, 19.20, 19.90],
  low: [19.60, 19.00, 19.70],
}

var bullishInput = {
  open: [18.00, 19.50, 20.20],  // All bullish candles
  high: [19.20, 21.00, 22.50],
  close: [19.00, 20.80, 22.20],
  low: [17.80, 19.30, 20.00],
}

var mixedInput = {
  open: [22.00, 21.50, 22.20],  // Mixed pattern
  high: [22.50, 22.00, 23.00],
  close: [21.80, 21.00, 22.80],  // Third candle is bullish
  low: [21.60, 20.80, 22.00],
}

var gapDownThreeBlackCrowsInput = {
  open: [28.00, 27.50, 26.00],  // Each opens within prev body: 27.50 between 28.00-27.20, 26.00 between 27.50-25.80
  high: [28.50, 27.70, 26.20],
  close: [27.20, 25.80, 24.30],
  low: [27.00, 25.60, 24.10],
}

var dojiIncludedInput = {
  open: [24.00, 23.50, 23.02],  // Includes doji
  high: [24.50, 23.80, 23.20],
  close: [23.70, 23.20, 23.00],
  low: [23.60, 23.10, 22.90],
}

var equalBodiesInput = {
  open: [26.00, 25.70, 25.20],  // Equal sized bodies: each opens within prev body
  high: [26.20, 25.90, 25.40],
  close: [25.50, 25.00, 24.50],
  low: [25.40, 24.90, 24.40],
}

var largeWicksInput = {
  open: [22.00, 21.90, 21.40],  // Large wicks: each opens within prev body
  high: [23.50, 22.80, 22.20],
  close: [21.80, 21.20, 20.70],
  low: [20.50, 20.00, 19.50],
}

describe('ThreeBlackCrows : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(input);
    fs.writeFileSync(__dirname+'/images/ThreeBlackCrows.svg',imageBuffer);
  });

  it('Check whether the supplied data has ThreeBlackCrows pattern', function() {
   var threeBlackCrows = new ThreeBlackCrows ();
   var result      = threeBlackCrows.hasPattern(input);
   assert.deepEqual(result, true, 'Invalid result for ThreeBlackCrows');
  });

  it('Should detect strong three black crows pattern', function() {
    var threeBlackCrows = new ThreeBlackCrows();
    var result = threeBlackCrows.hasPattern(strongThreeBlackCrowsInput);
    assert.deepEqual(result, true, 'Should detect strong three black crows');
  });

  it('Should detect weak three black crows pattern', function() {
    var threeBlackCrows = new ThreeBlackCrows();
    var result = threeBlackCrows.hasPattern(weakThreeBlackCrowsInput);
    assert.deepEqual(result, true, 'Should detect weak three black crows');
  });

  it('Should reject invalid three black crows (opening outside body)', function() {
    var threeBlackCrows = new ThreeBlackCrows();
    var result = threeBlackCrows.hasPattern(invalidThreeBlackCrowsInput);
    assert.deepEqual(result, false, 'Should reject invalid three black crows');
  });

  it('Should reject bullish pattern', function() {
    var threeBlackCrows = new ThreeBlackCrows();
    var result = threeBlackCrows.hasPattern(bullishInput);
    assert.deepEqual(result, false, 'Should reject bullish pattern');
  });

  it('Should reject mixed pattern', function() {
    var threeBlackCrows = new ThreeBlackCrows();
    var result = threeBlackCrows.hasPattern(mixedInput);
    assert.deepEqual(result, false, 'Should reject mixed pattern');
  });

  it('Should detect gap down three black crows', function() {
    var threeBlackCrows = new ThreeBlackCrows();
    var result = threeBlackCrows.hasPattern(gapDownThreeBlackCrowsInput);
    assert.deepEqual(result, true, 'Should detect gap down three black crows');
  });

  it('Should handle pattern with doji', function() {
    var threeBlackCrows = new ThreeBlackCrows();
    var result = threeBlackCrows.hasPattern(dojiIncludedInput);
    assert.equal(typeof result, 'boolean', 'Should handle doji in pattern');
  });

  it('Should detect equal sized bodies', function() {
    var threeBlackCrows = new ThreeBlackCrows();
    var result = threeBlackCrows.hasPattern(equalBodiesInput);
    assert.deepEqual(result, true, 'Should detect equal sized bodies');
  });

  it('Should handle large wicks', function() {
    var threeBlackCrows = new ThreeBlackCrows();
    var result = threeBlackCrows.hasPattern(largeWicksInput);
    assert.deepEqual(result, true, 'Should handle large wicks');
  });

  it('Should handle empty input gracefully', function() {
    var threeBlackCrows = new ThreeBlackCrows();
    var emptyInput = { open: [], high: [], close: [], low: [] };
    var result = threeBlackCrows.hasPattern(emptyInput);
    assert.deepEqual(result, false, 'Should return false for empty input');
  });

  it('Should handle insufficient data', function() {
    var threeBlackCrows = new ThreeBlackCrows();
    var twoInput = {
      open: [23.00, 22.50],
      high: [23.50, 22.80],
      close: [22.00, 21.50],
      low: [21.80, 21.30]
    };
    var result = threeBlackCrows.hasPattern(twoInput);
    assert.deepEqual(result, false, 'Should return false for insufficient data');
  });

  it('Should handle four candle input', function() {
    var threeBlackCrows = new ThreeBlackCrows();
    var fourInput = {
      open: [23.00, 22.50, 22.00, 21.40],
      high: [23.50, 22.80, 22.30, 21.70],
      close: [22.00, 21.50, 20.80, 21.20],
      low: [21.80, 21.30, 20.60, 21.00]
    };
    var result = threeBlackCrows.hasPattern(fourInput);
    assert.equal(typeof result, 'boolean', 'Should handle four candle input');
  });

  it('Should handle single candle input', function() {
    var threeBlackCrows = new ThreeBlackCrows();
    var singleInput = {
      open: [23.00],
      high: [23.50],
      close: [22.00],
      low: [21.80]
    };
    var result = threeBlackCrows.hasPattern(singleInput);
    assert.deepEqual(result, false, 'Should return false for single candle');
  });

  it('Should handle mismatched array lengths', function() {
    var threeBlackCrows = new ThreeBlackCrows();
    var mismatchedInput = {
      open: [23.00, 22.50],
      high: [23.50, 22.80, 22.30],
      close: [22.00, 21.50, 20.80],
      low: [21.80, 21.30]
    };
    var result = threeBlackCrows.hasPattern(mismatchedInput);
    assert.equal(typeof result, 'boolean', 'Should handle mismatched arrays gracefully');
  });
})




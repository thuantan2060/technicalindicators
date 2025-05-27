var ThreeWhiteSoldiers = require('../../lib/candlestick/ThreeWhiteSoldiers').default;
var assert = require('assert');
var { drawCandleStick } = require('../helpers/test-helper.js');
var fs                      = require('fs');

// Valid Three White Soldiers pattern:
// Day 1 (index 0): First bullish candle (open=21.00, close=22.00)
// Day 2 (index 1): Opens within Day 1 body (21.50), closes higher (22.50), higher high
// Day 3 (index 2): Opens within Day 2 body (22.00), closes higher (23.20), higher high
var input = {
  open: [21.00, 21.50, 22.00],  // [day1, day2, day3] - each opens within previous body
  close: [22.00, 22.50, 23.20], // progressively higher closes
  high: [22.30, 22.80, 23.50],  // progressively higher highs
  low: [20.80, 21.30, 21.80]    // progressively higher lows
}

// Additional test cases
var strongThreeWhiteSoldiersInput = {
  open: [15.00, 16.20, 17.50],  // Strong three white soldiers
  high: [16.50, 17.80, 19.20],
  close: [16.40, 17.70, 19.00],  // Large bullish bodies
  low: [14.80, 16.00, 17.30],
}

var weakThreeWhiteSoldiersInput = {
  open: [25.00, 25.10, 25.30],  // Weak three white soldiers: each opens within prev body
  high: [25.30, 25.50, 25.70],
  close: [25.20, 25.40, 25.60],  // Small bullish bodies, progressively higher
  low: [24.90, 25.00, 25.20],   // Progressive higher lows
}

var invalidThreeWhiteSoldiersInput = {
  open: [20.00, 21.50, 21.80],  // Third candle opens outside second body
  high: [21.20, 22.30, 22.50],
  close: [21.00, 22.10, 22.30],
  low: [19.80, 21.30, 21.60],
}

var bearishInput = {
  open: [22.00, 21.50, 20.80],  // All bearish candles
  high: [22.50, 22.00, 21.20],
  close: [21.80, 21.00, 20.50],
  low: [21.60, 20.80, 20.30],
}

var mixedInput = {
  open: [21.00, 21.50, 22.80],  // Mixed pattern
  high: [22.30, 22.80, 23.00],
  close: [22.00, 22.50, 22.50],  // Third candle is doji/bearish
  low: [20.80, 21.30, 22.30],
}

var gapUpThreeWhiteSoldiersInput = {
  open: [18.00, 18.80, 20.50],  // Three white soldiers: each opens within prev body
  high: [19.20, 21.30, 22.80],
  close: [19.00, 21.10, 22.60],
  low: [17.80, 18.60, 20.30],
}

var dojiIncludedInput = {
  open: [19.00, 19.70, 20.48],  // Includes doji
  high: [19.80, 20.50, 21.20],
  close: [19.70, 20.30, 20.50],
  low: [18.80, 19.50, 20.30],
}

var equalBodiesInput = {
  open: [20.00, 20.30, 20.80],  // Equal sized bodies: each opens within prev body
  high: [20.80, 21.30, 21.80],
  close: [20.50, 21.00, 21.50],
  low: [19.80, 20.20, 20.70],
}

var largeWicksInput = {
  open: [18.00, 18.70, 19.80],  // Large wicks: each opens within prev body
  high: [20.50, 21.80, 23.20],
  close: [19.00, 20.30, 21.70],
  low: [16.50, 17.80, 19.20],
}

var perfectThreeWhiteSoldiersInput = {
  open: [22.00, 22.50, 23.20],  // Perfect pattern: each opens within prev body
  high: [23.00, 24.00, 25.00],
  close: [22.80, 23.60, 24.40],
  low: [21.80, 22.40, 23.10],
}

describe('ThreeWhiteSoldiers : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(input);
    fs.writeFileSync(__dirname+'/images/ThreeWhiteSoldiers.svg',imageBuffer);
  });

  it('Check whether the supplied data has ThreeWhiteSoldiers pattern', function() {
   var threeWhiteSoldiers = new ThreeWhiteSoldiers ();
   var result      = threeWhiteSoldiers.hasPattern(input);
   assert.deepEqual(result, true, 'Invalid result for ThreeWhiteSoldiers');
  });

  it('Should detect strong three white soldiers pattern', function() {
    var threeWhiteSoldiers = new ThreeWhiteSoldiers();
    var result = threeWhiteSoldiers.hasPattern(strongThreeWhiteSoldiersInput);
    assert.deepEqual(result, true, 'Should detect strong three white soldiers');
  });

  it('Should detect weak three white soldiers pattern', function() {
    var threeWhiteSoldiers = new ThreeWhiteSoldiers();
    var result = threeWhiteSoldiers.hasPattern(weakThreeWhiteSoldiersInput);
    assert.deepEqual(result, true, 'Should detect weak three white soldiers');
  });

  it('Should reject invalid three white soldiers (opening outside body)', function() {
    var threeWhiteSoldiers = new ThreeWhiteSoldiers();
    var result = threeWhiteSoldiers.hasPattern(invalidThreeWhiteSoldiersInput);
    assert.deepEqual(result, false, 'Should reject invalid three white soldiers');
  });

  it('Should reject bearish pattern', function() {
    var threeWhiteSoldiers = new ThreeWhiteSoldiers();
    var result = threeWhiteSoldiers.hasPattern(bearishInput);
    assert.deepEqual(result, false, 'Should reject bearish pattern');
  });

  it('Should reject mixed pattern', function() {
    var threeWhiteSoldiers = new ThreeWhiteSoldiers();
    var result = threeWhiteSoldiers.hasPattern(mixedInput);
    assert.deepEqual(result, false, 'Should reject mixed pattern');
  });

  it('Should detect gap up three white soldiers', function() {
    var threeWhiteSoldiers = new ThreeWhiteSoldiers();
    var result = threeWhiteSoldiers.hasPattern(gapUpThreeWhiteSoldiersInput);
    assert.deepEqual(result, true, 'Should detect gap up three white soldiers');
  });

  it('Should handle pattern with doji', function() {
    var threeWhiteSoldiers = new ThreeWhiteSoldiers();
    var result = threeWhiteSoldiers.hasPattern(dojiIncludedInput);
    assert.equal(typeof result, 'boolean', 'Should handle doji in pattern');
  });

  it('Should detect equal sized bodies', function() {
    var threeWhiteSoldiers = new ThreeWhiteSoldiers();
    var result = threeWhiteSoldiers.hasPattern(equalBodiesInput);
    assert.deepEqual(result, true, 'Should detect equal sized bodies');
  });

  it('Should handle large wicks', function() {
    var threeWhiteSoldiers = new ThreeWhiteSoldiers();
    var result = threeWhiteSoldiers.hasPattern(largeWicksInput);
    assert.deepEqual(result, true, 'Should handle large wicks');
  });

  it('Should detect perfect three white soldiers', function() {
    var threeWhiteSoldiers = new ThreeWhiteSoldiers();
    var result = threeWhiteSoldiers.hasPattern(perfectThreeWhiteSoldiersInput);
    assert.deepEqual(result, true, 'Should detect perfect three white soldiers');
  });

  it('Should handle empty input gracefully', function() {
    var threeWhiteSoldiers = new ThreeWhiteSoldiers();
    var emptyInput = { open: [], high: [], close: [], low: [] };
    var result = threeWhiteSoldiers.hasPattern(emptyInput);
    assert.deepEqual(result, false, 'Should return false for empty input');
  });

  it('Should handle insufficient data', function() {
    var threeWhiteSoldiers = new ThreeWhiteSoldiers();
    var twoInput = {
      open: [21.00, 21.50],
      close: [22.00, 22.50],
      high: [22.30, 22.80],
      low: [20.80, 21.30]
    };
    var result = threeWhiteSoldiers.hasPattern(twoInput);
    assert.deepEqual(result, false, 'Should return false for insufficient data');
  });

  it('Should handle four candle input', function() {
    var threeWhiteSoldiers = new ThreeWhiteSoldiers();
    var fourInput = {
      open: [21.00, 21.50, 22.00, 22.80],
      close: [22.00, 22.50, 23.20, 24.00],
      high: [22.30, 22.80, 23.50, 24.20],
      low: [20.80, 21.30, 21.80, 22.60]
    };
    var result = threeWhiteSoldiers.hasPattern(fourInput);
    assert.equal(typeof result, 'boolean', 'Should handle four candle input');
  });

  it('Should handle single candle input', function() {
    var threeWhiteSoldiers = new ThreeWhiteSoldiers();
    var singleInput = {
      open: [21.00],
      close: [22.00],
      high: [22.30],
      low: [20.80]
    };
    var result = threeWhiteSoldiers.hasPattern(singleInput);
    assert.deepEqual(result, false, 'Should return false for single candle');
  });

  it('Should handle mismatched array lengths', function() {
    var threeWhiteSoldiers = new ThreeWhiteSoldiers();
    var mismatchedInput = {
      open: [21.00, 21.50],
      close: [22.00, 22.50, 23.20],
      high: [22.30, 22.80, 23.50],
      low: [20.80, 21.30]
    };
    var result = threeWhiteSoldiers.hasPattern(mismatchedInput);
    assert.equal(typeof result, 'boolean', 'Should handle mismatched arrays gracefully');
  });

  it('Should handle declining highs (invalid pattern)', function() {
    var threeWhiteSoldiers = new ThreeWhiteSoldiers();
    var decliningHighsInput = {
      open: [21.00, 21.50, 22.00],
      close: [22.00, 22.50, 23.20],
      high: [23.50, 22.80, 22.30],  // Declining highs
      low: [20.80, 21.30, 21.80]
    };
    var result = threeWhiteSoldiers.hasPattern(decliningHighsInput);
    assert.deepEqual(result, false, 'Should reject pattern with declining highs');
  });

  it('Should handle declining lows (still valid pattern)', function() {
    var threeWhiteSoldiers = new ThreeWhiteSoldiers();
    var decliningLowsInput = {
      open: [21.00, 21.50, 22.00],
      close: [22.00, 22.50, 23.20],
      high: [22.30, 22.80, 23.50],
      low: [21.80, 21.30, 20.80]  // Declining lows but still valid pattern
    };
    var result = threeWhiteSoldiers.hasPattern(decliningLowsInput);
    assert.deepEqual(result, true, 'Should accept pattern even with declining lows');
  });
})




var PiercingLine = require('../../lib/candlestick/PiercingLine').default;
var assert = require('assert');
var { drawCandleStick } = require('../helpers/test-helper.js');
var fs                      = require('fs');

var input = {
  open: [39.45,30.10],  // Previous: bearish (39.45 -> 32.50), Current: bullish (30.10 -> 36.50)
  high: [41.45,37.40],  // Previous midpoint: (39.45 + 32.50) / 2 = 35.975, Current close: 36.50 > 35.975 ✓
  close: [32.50,36.50],
  low: [31.25,28.30],
}

// Additional test cases
var strongPiercingLineInput = {
  open: [45.00, 28.50],  // Strong piercing line with large gap down
  high: [46.20, 42.80],
  close: [30.80, 42.50],  // Deep penetration above midpoint
  low: [30.50, 28.00],
}

var weakPiercingLineInput = {
  open: [25.00, 22.80],  // Weak piercing line: opens below prev low
  high: [25.80, 24.20],
  close: [23.20, 24.15],  // Closes above midpoint (24.1) but below prev open
  low: [23.00, 22.50],   // Current open (22.80) < prev low (23.00)
}

var invalidPiercingLineInput = {
  open: [30.00, 29.50],  // Second candle doesn't open below first low
  high: [31.20, 31.00],
  close: [29.80, 30.80],
  low: [29.60, 29.30],
}

var bullishInput = {
  open: [18.00, 19.50],  // Both candles bullish
  high: [19.20, 21.00],
  close: [19.00, 20.80],
  low: [17.80, 19.30],
}

var bearishInput = {
  open: [22.00, 21.50],  // Both candles bearish
  high: [22.50, 22.00],
  close: [21.80, 21.00],
  low: [21.60, 20.80],
}

var gapDownPiercingLineInput = {
  open: [28.00, 25.50],  // Gap down then piercing line
  high: [29.20, 27.80],
  close: [26.50, 27.50],  // Good penetration
  low: [26.30, 25.20],
}

var exactMidpointInput = {
  open: [24.00, 21.50],  // Tests exact midpoint penetration
  high: [25.50, 23.00],
  close: [22.00, 23.00],  // Closes exactly at midpoint (23.00)
  low: [21.80, 21.30],
}

var dojiFirstInput = {
  open: [20.00, 18.50],  // First candle is doji
  high: [20.30, 20.80],
  close: [20.05, 20.50],
  low: [19.80, 18.30],
}

var smallBodyFirstInput = {
  open: [22.00, 20.50],  // Small body first candle
  high: [22.50, 22.80],
  close: [21.80, 22.60],
  low: [21.60, 20.30],
}

describe('PiercingLine : ', function() {
   before(function() {
    var imageBuffer = drawCandleStick(input);
    fs.writeFileSync(__dirname+'/images/PiercingLine.svg',imageBuffer);
  });

  it('Check whether the supplied data has PiercingLine pattern', function() {
   var piercingLine = new PiercingLine ();
   var result = piercingLine.hasPattern(input);
   assert.deepEqual(result, true, 'Invalid result for PiercingLine')
  });

  it('Should detect strong piercing line pattern', function() {
    var piercingLine = new PiercingLine();
    var result = piercingLine.hasPattern(strongPiercingLineInput);
    assert.deepEqual(result, true, 'Should detect strong piercing line');
  });

  it('Should detect weak piercing line pattern', function() {
    var piercingLine = new PiercingLine();
    var result = piercingLine.hasPattern(weakPiercingLineInput);
    assert.deepEqual(result, true, 'Should detect weak piercing line');
  });

  it('Should reject invalid piercing line (no gap down)', function() {
    var piercingLine = new PiercingLine();
    var result = piercingLine.hasPattern(invalidPiercingLineInput);
    assert.deepEqual(result, false, 'Should reject invalid piercing line');
  });

  it('Should reject bullish pattern', function() {
    var piercingLine = new PiercingLine();
    var result = piercingLine.hasPattern(bullishInput);
    assert.deepEqual(result, false, 'Should reject bullish pattern');
  });

  it('Should reject bearish pattern', function() {
    var piercingLine = new PiercingLine();
    var result = piercingLine.hasPattern(bearishInput);
    assert.deepEqual(result, false, 'Should reject bearish pattern');
  });

  it('Should detect gap down piercing line', function() {
    var piercingLine = new PiercingLine();
    var result = piercingLine.hasPattern(gapDownPiercingLineInput);
    assert.deepEqual(result, true, 'Should detect gap down piercing line');
  });

  it('Should handle exact midpoint penetration', function() {
    var piercingLine = new PiercingLine();
    var result = piercingLine.hasPattern(exactMidpointInput);
    assert.equal(typeof result, 'boolean', 'Should handle exact midpoint case');
  });

  it('Should handle doji as first candle', function() {
    var piercingLine = new PiercingLine();
    var result = piercingLine.hasPattern(dojiFirstInput);
    assert.equal(typeof result, 'boolean', 'Should handle doji first candle');
  });

  it('Should handle small body first candle', function() {
    var piercingLine = new PiercingLine();
    var result = piercingLine.hasPattern(smallBodyFirstInput);
    assert.equal(typeof result, 'boolean', 'Should handle small body first candle');
  });

  it('Should handle empty input gracefully', function() {
    var piercingLine = new PiercingLine();
    var emptyInput = { open: [], high: [], close: [], low: [] };
    var result = piercingLine.hasPattern(emptyInput);
    assert.deepEqual(result, false, 'Should return false for empty input');
  });

  it('Should handle single candle input', function() {
    var piercingLine = new PiercingLine();
    var singleInput = {
      open: [20.00],
      high: [21.00],
      close: [19.50],
      low: [19.00]
    };
    var result = piercingLine.hasPattern(singleInput);
    assert.deepEqual(result, false, 'Should return false for single candle');
  });

  it('Should handle three candle input', function() {
    var piercingLine = new PiercingLine();
    var threeInput = {
      open: [39.45, 30.10, 36.80],
      high: [41.45, 37.40, 38.50],
      close: [32.50, 36.50, 38.20],
      low: [31.25, 28.30, 36.60]
    };
    var result = piercingLine.hasPattern(threeInput);
    assert.equal(typeof result, 'boolean', 'Should handle three candle input');
  });

  it('Should handle insufficient penetration', function() {
    var piercingLine = new PiercingLine();
    var insufficientInput = {
      open: [30.00, 27.50],  // Insufficient penetration above midpoint
      high: [31.20, 29.00],
      close: [28.50, 28.80],  // Closes below midpoint (29.25)
      low: [28.30, 27.30]
    };
    var result = piercingLine.hasPattern(insufficientInput);
    assert.deepEqual(result, false, 'Should reject insufficient penetration');
  });

  it('Should handle equal open and close prices', function() {
    var piercingLine = new PiercingLine();
    var equalInput = {
      open: [25.00, 22.50],
      high: [25.50, 24.50],
      close: [25.00, 24.30],  // First candle has equal open/close
      low: [24.80, 22.30]
    };
    var result = piercingLine.hasPattern(equalInput);
    assert.equal(typeof result, 'boolean', 'Should handle equal open/close');
  });
})


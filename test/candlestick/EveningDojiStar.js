var EveningDojiStar = require('../../lib/candlestick/EveningDojiStar').default;
var assert = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs = require('fs');

describe('EveningDojiStar: ', function() {
  
  // Valid EveningDojiStar pattern - ascending order: [day1, day2, day3]
  var validPattern = {
    open: [18.35, 22.20, 21.60],   // [day1, day2, day3] - chronological order
    high: [21.60, 22.40, 22.05],  // day2 gaps up from day1
    close: [21.30, 22.22, 19.45], // day1 bullish, day2 doji, day3 bearish below day1 midpoint
    low: [18.13, 21.87, 19.30]
  };

  // Invalid pattern - first day not bullish
  var invalidPattern1 = {
    open: [21.35, 22.20, 21.60],
    high: [21.60, 22.40, 22.05],
    close: [18.30, 22.22, 19.45],  // day1 bearish (close < open)
    low: [18.13, 21.87, 19.30]
  };

  // Invalid pattern - second day not a doji
  var invalidPattern2 = {
    open: [18.35, 22.20, 21.60],
    high: [21.60, 22.40, 22.05],
    close: [21.30, 24.00, 19.45],  // day2 not a doji (large difference between open/close)
    low: [18.13, 21.87, 19.30]
  };

  // Invalid pattern - third day not bearish
  var invalidPattern3 = {
    open: [18.35, 22.20, 21.60],
    high: [21.60, 22.40, 22.05],
    close: [21.30, 22.22, 23.00],  // day3 bullish (close > open)
    low: [18.13, 21.87, 19.30]
  };

  // Invalid pattern - no gap between day1 and day2
  var invalidPattern4 = {
    open: [18.35, 20.50, 21.60],   // day2 open lower than day1 high
    high: [21.60, 21.00, 22.05],
    close: [21.30, 20.52, 19.45],
    low: [18.13, 20.00, 19.30]
  };

  // Invalid pattern - third day doesn't close below first day midpoint
  var invalidPattern5 = {
    open: [18.35, 22.20, 21.60],
    high: [21.60, 22.40, 22.05],
    close: [21.30, 22.22, 20.50],  // day3 close above day1 midpoint (19.825)
    low: [18.13, 21.87, 19.30]
  };

  // Edge case - minimal doji difference
  var edgeCase1 = {
    open: [18.35, 22.200, 21.60],
    high: [21.60, 22.40, 22.05],
    close: [21.30, 22.201, 19.45],  // very small doji difference
    low: [18.13, 21.87, 19.30]
  };

  // Valid pattern with larger price movements
  var largeMovementPattern = {
    open: [50.00, 110.00, 80.00],
    high: [100.00, 115.00, 85.00],
    close: [95.00, 110.10, 65.00],  // day1 midpoint = 72.5, day3 close below it
    low: [45.00, 105.00, 60.00]
  };

  before(function() {
    var imageBuffer = drawCandleStick(validPattern);
    fs.writeFileSync(__dirname+'/images/EveningDojiStar.svg', imageBuffer);
  });

  it('should detect valid EveningDojiStar pattern', function() {
    var eveningDojiStar = new EveningDojiStar();
    var result = eveningDojiStar.hasPattern(validPattern);
    assert.strictEqual(result, true, 'Should detect valid EveningDojiStar pattern');
  });

  it('should reject pattern when first day is not bullish', function() {
    var eveningDojiStar = new EveningDojiStar();
    var result = eveningDojiStar.hasPattern(invalidPattern1);
    assert.strictEqual(result, false, 'Should reject when first day is not bullish');
  });

  it('should reject pattern when second day is not a doji', function() {
    var eveningDojiStar = new EveningDojiStar();
    var result = eveningDojiStar.hasPattern(invalidPattern2);
    assert.strictEqual(result, false, 'Should reject when second day is not a doji');
  });

  it('should reject pattern when third day is not bearish', function() {
    var eveningDojiStar = new EveningDojiStar();
    var result = eveningDojiStar.hasPattern(invalidPattern3);
    assert.strictEqual(result, false, 'Should reject when third day is not bearish');
  });

  it('should reject pattern when there is no gap', function() {
    var eveningDojiStar = new EveningDojiStar();
    var result = eveningDojiStar.hasPattern(invalidPattern4);
    assert.strictEqual(result, false, 'Should reject when there is no gap between day1 and day2');
  });

  it('should reject pattern when third day does not close below first day midpoint', function() {
    var eveningDojiStar = new EveningDojiStar();
    var result = eveningDojiStar.hasPattern(invalidPattern5);
    assert.strictEqual(result, false, 'Should reject when third day does not close below first day midpoint');
  });

  it('should detect pattern with minimal doji difference', function() {
    var eveningDojiStar = new EveningDojiStar();
    var result = eveningDojiStar.hasPattern(edgeCase1);
    assert.strictEqual(result, true, 'Should detect pattern with minimal doji difference');
  });

  it('should detect pattern with large price movements', function() {
    var eveningDojiStar = new EveningDojiStar();
    var result = eveningDojiStar.hasPattern(largeMovementPattern);
    assert.strictEqual(result, true, 'Should detect pattern with large price movements');
  });

  it('should handle insufficient data gracefully', function() {
    var eveningDojiStar = new EveningDojiStar();
    var insufficientData = {
      open: [21.60, 22.20],  // only 2 days instead of 3
      high: [22.05, 22.40],
      close: [19.45, 22.22],
      low: [19.30, 21.87]
    };
    var result = eveningDojiStar.hasPattern(insufficientData);
    assert.strictEqual(result, false, 'Should return false for insufficient data');
  });

  it('should handle invalid OHLC relationships', function() {
    var eveningDojiStar = new EveningDojiStar();
    var invalidOHLC = {
      open: [18.35, 22.20, 21.60],
      high: [21.60, 22.40, 20.00],  // day3 high < open (invalid)
      close: [21.30, 22.22, 19.45],
      low: [18.13, 21.87, 19.30]
    };
    var result = eveningDojiStar.hasPattern(invalidOHLC);
    assert.strictEqual(result, false, 'Should handle invalid OHLC relationships');
  });

  it('should work with different scale values', function() {
    var eveningDojiStar = new EveningDojiStar(2);
    var result = eveningDojiStar.hasPattern(validPattern);
    assert.strictEqual(result, true, 'Should work with different scale values');
  });
});




var DragonFlyDoji = require('../../lib/candlestick/DragonFlyDoji').default;
var assert = require('assert');
var { drawCandleStick } = require('../helpers/test-helper');
var fs = require('fs');

// Valid DragonFly Doji test cases
var validDragonFlyDoji = {
  open: [30.10],
  high: [30.13],  // High ≈ open ≈ close
  close: [30.13], // Close ≈ open ≈ high
  low: [25.06],   // Long lower shadow
};

var perfectDragonFlyDoji = {
  open: [25.00],
  high: [25.00],  // Perfect doji at top
  close: [25.00], // Perfect doji
  low: [20.00],   // Long lower shadow
};

var nearPerfectDragonFlyDoji = {
  open: [30.100],
  high: [30.102], // Very close to open/close
  close: [30.101], // Very close to open/high
  low: [25.000],   // Long lower shadow
};

var minimalDragonFlyDoji = {
  open: [30.10],
  high: [30.11],  // Minimal difference
  close: [30.10], // Close = open
  low: [28.50],   // Moderate lower shadow
};

var strongDragonFlyDoji = {
  open: [35.00],
  high: [35.05],  // Very small upper body
  close: [35.02], // Close ≈ open ≈ high
  low: [25.00],   // Very long lower shadow
};

// Invalid test cases
var notADoji = {
  open: [30.10],
  high: [32.13],  // Normal candle
  close: [31.50], // Close != open
  low: [25.06],
};

var gravestoneDoji = {
  open: [25.10],
  high: [30.13],  // Long upper shadow
  close: [25.13], // Close ≈ open ≈ low
  low: [25.06],   // Low ≈ open ≈ close
};

var regularDoji = {
  open: [27.50],
  high: [28.00],  // Upper shadow
  close: [27.52], // Close ≈ open
  low: [27.00],   // Lower shadow (not dragonfly)
};

var invalidOHLCData = {
  open: [30.10],
  high: [29.00],  // Invalid: high < open
  close: [30.13],
  low: [25.06],
};

var noLowerShadow = {
  open: [30.10],
  high: [30.13],
  close: [30.12],
  low: [30.09],   // No significant lower shadow
};

var tooMuchUpperShadow = {
  open: [30.10],
  high: [32.00],  // Too much upper shadow
  close: [30.13],
  low: [25.06],
};

var openNotEqualClose = {
  open: [30.10],
  high: [30.15],
  close: [29.50], // Close significantly different from open
  low: [25.06],
};

// Edge cases
var emptyData = {
  open: [],
  high: [],
  close: [],
  low: [],
};

var undefinedData = undefined;

var nullData = null;

var missingFields = {
  open: [30.10],
  high: [30.13],
  // close missing
  low: [25.06],
};

var stringValues = {
  open: ["30.10"],
  high: ["30.13"],
  close: ["30.13"],
  low: ["25.06"],
};

var negativeValues = {
  open: [-30.10],
  high: [-30.10],  // High should be the highest (least negative) value
  close: [-30.13], // Close ≈ open, forming small body
  low: [-35.06],   // Long lower shadow
};

var zeroValues = {
  open: [0],
  high: [0],
  close: [0],
  low: [0],
};

describe('DragonFly Doji : ', function() {
  before(function() {
    var imageBuffer1 = drawCandleStick(validDragonFlyDoji);
    fs.writeFileSync(__dirname+'/images/ValidDragonFlyDoji.svg',imageBuffer1);
    
    var imageBuffer2 = drawCandleStick(perfectDragonFlyDoji);
    fs.writeFileSync(__dirname+'/images/PerfectDragonFlyDoji.svg',imageBuffer2);
    
    var imageBuffer3 = drawCandleStick(strongDragonFlyDoji);
    fs.writeFileSync(__dirname+'/images/StrongDragonFlyDoji.svg',imageBuffer3);
    
    var imageBuffer4 = drawCandleStick(notADoji);
    fs.writeFileSync(__dirname+'/images/NotADoji.svg',imageBuffer4);
  });
  
  // Positive test cases
  it('Should identify valid dragonfly doji pattern', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var result = dragonFlyDoji.hasPattern(validDragonFlyDoji);
    assert.deepEqual(result, true, 'Should identify valid dragonfly doji pattern');
  });
  
  it('Should identify perfect dragonfly doji pattern', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var result = dragonFlyDoji.hasPattern(perfectDragonFlyDoji);
    assert.deepEqual(result, true, 'Should identify perfect dragonfly doji pattern');
  });
  
  it('Should identify near perfect dragonfly doji pattern', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var result = dragonFlyDoji.hasPattern(nearPerfectDragonFlyDoji);
    assert.deepEqual(result, true, 'Should identify near perfect dragonfly doji pattern');
  });
  
  it('Should identify minimal dragonfly doji pattern', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var result = dragonFlyDoji.hasPattern(minimalDragonFlyDoji);
    assert.deepEqual(result, true, 'Should identify minimal dragonfly doji pattern');
  });
  
  it('Should identify strong dragonfly doji pattern', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var result = dragonFlyDoji.hasPattern(strongDragonFlyDoji);
    assert.deepEqual(result, true, 'Should identify strong dragonfly doji pattern');
  });
  
  // Negative test cases
  it('Should return false for non-doji pattern', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var result = dragonFlyDoji.hasPattern(notADoji);
    assert.deepEqual(result, false, 'Should return false for non-doji pattern');
  });
  
  it('Should return false for gravestone doji pattern', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var result = dragonFlyDoji.hasPattern(gravestoneDoji);
    assert.deepEqual(result, false, 'Should return false for gravestone doji pattern');
  });
  
  it('Should return false for regular doji pattern', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var result = dragonFlyDoji.hasPattern(regularDoji);
    assert.deepEqual(result, false, 'Should return false for regular doji pattern');
  });
  
  it('Should return false with invalid OHLC data', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var result = dragonFlyDoji.hasPattern(invalidOHLCData);
    assert.deepEqual(result, false, 'Should return false with invalid OHLC data');
  });
  
  it('Should return false when no lower shadow', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var result = dragonFlyDoji.hasPattern(noLowerShadow);
    assert.deepEqual(result, false, 'Should return false when no lower shadow');
  });
  
  it('Should return false when too much upper shadow', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var result = dragonFlyDoji.hasPattern(tooMuchUpperShadow);
    assert.deepEqual(result, false, 'Should return false when too much upper shadow');
  });
  
  it('Should return false when open not equal close', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var result = dragonFlyDoji.hasPattern(openNotEqualClose);
    assert.deepEqual(result, false, 'Should return false when open not equal close');
  });
  
  // Test with custom scale
  it('Should work with custom scale parameter', function() {
    var dragonFlyDoji = new DragonFlyDoji(2);
    var result = dragonFlyDoji.hasPattern(validDragonFlyDoji);
    assert.deepEqual(result, true, 'Should work with custom scale parameter');
  });
  
  it('Should be more tolerant with higher scale', function() {
    var dragonFlyDoji = new DragonFlyDoji(3);
    var slightlyOffPattern = {
      open: [30.10],
      high: [30.20],  // Slightly higher than normal tolerance
      close: [30.15], // Slightly different from open
      low: [25.06],
    };
    var result = dragonFlyDoji.hasPattern(slightlyOffPattern);
    assert.deepEqual(result, true, 'Should be more tolerant with higher scale');
  });
  
  // Test function export
  it('Should work using function export', function() {
    var dragonflydoji = require('../../lib/candlestick/DragonFlyDoji').dragonflydoji;
    var result = dragonflydoji(validDragonFlyDoji);
    assert.deepEqual(result, true, 'Should work using function export');
  });
  
  it('Should work using function export with custom scale', function() {
    var dragonflydoji = require('../../lib/candlestick/DragonFlyDoji').dragonflydoji;
    var result = dragonflydoji(validDragonFlyDoji, 2);
    assert.deepEqual(result, true, 'Should work using function export with custom scale');
  });
  
  // Edge cases
  it('Should handle empty data gracefully', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var result = dragonFlyDoji.hasPattern(emptyData);
    assert.deepEqual(result, false, 'Should handle empty data gracefully');
  });
  
  it('Should handle undefined data gracefully', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var result = dragonFlyDoji.hasPattern(undefinedData);
    assert.deepEqual(result, false, 'Should handle undefined data gracefully');
  });
  
  it('Should handle null data gracefully', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var result = dragonFlyDoji.hasPattern(nullData);
    assert.deepEqual(result, false, 'Should handle null data gracefully');
  });
  
  it('Should handle missing fields gracefully', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var result = dragonFlyDoji.hasPattern(missingFields);
    assert.deepEqual(result, false, 'Should handle missing fields gracefully');
  });
  
  it('Should handle string values', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var result = dragonFlyDoji.hasPattern(stringValues);
    assert.deepEqual(result, true, 'Should handle string values');
  });
  
  it('Should handle negative values', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var result = dragonFlyDoji.hasPattern(negativeValues);
    assert.deepEqual(result, true, 'Should handle negative values');
  });
  
  it('Should handle zero values', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var result = dragonFlyDoji.hasPattern(zeroValues);
    assert.deepEqual(result, false, 'Should handle zero values');
  });
  
  // Test required count
  it('Should have correct required count', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    assert.deepEqual(dragonFlyDoji.requiredCount, 1, 'Should require 1 candle for dragonfly doji pattern');
  });
  
  // Test pattern name
  it('Should have correct pattern name', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    assert.deepEqual(dragonFlyDoji.name, 'DragonFlyDoji', 'Should have correct pattern name');
  });
  
  // Test tolerance boundaries
  it('Should accept values within tolerance', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var withinToleranceData = {
      open: [30.100],
      high: [30.101], // Just within tolerance
      close: [30.099], // Just within tolerance
      low: [25.000],
    };
    var result = dragonFlyDoji.hasPattern(withinToleranceData);
    assert.deepEqual(result, true, 'Should accept values within tolerance');
  });
  
  it('Should reject values outside tolerance', function() {
    var dragonFlyDoji = new DragonFlyDoji();
    var outsideToleranceData = {
      open: [30.100],
      high: [30.200], // Outside tolerance
      close: [30.100],
      low: [25.000],
    };
    var result = dragonFlyDoji.hasPattern(outsideToleranceData);
    assert.deepEqual(result, false, 'Should reject values outside tolerance');
  });
});

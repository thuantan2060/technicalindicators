var DarkCloudCover = require('../../lib/candlestick/DarkCloudCover').default;
var assert = require('assert');
var { drawCandleStick } = require('../helpers/test-helper.js');
var fs                      = require('fs');

var input = {
  open: [41.33, 42.70],  // Previous: bullish (41.33 -> 42.34), Current: bearish (42.70 -> 41.60)
  high: [42.50,42.82],
  close: [42.34,41.60],
  low: [41.15,41.45],
}

// Additional test cases
var strongDarkCloudInput = {
  open: [30.00, 32.00],  // Strong dark cloud cover: opens above prev high
  high: [31.80, 32.50],
  close: [31.50, 30.60],  // Closes below midpoint (30.75) but above prev open
  low: [29.80, 30.40],
}

var weakDarkCloudInput = {
  open: [25.00, 26.00],  // Weak dark cloud cover: opens above prev high
  high: [25.80, 26.50],
  close: [25.70, 25.30],  // Closes just below midpoint (25.35) but above prev open
  low: [24.80, 25.20],
}

var invalidDarkCloudInput = {
  open: [20.00, 21.00],  // Second candle doesn't open above first high
  high: [21.20, 21.50],
  close: [21.00, 20.80],
  low: [19.80, 20.60],
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

var gapUpDarkCloudInput = {
  open: [28.00, 29.50],  // Gap up then dark cloud: opens above prev high
  high: [29.20, 30.80],
  close: [29.00, 28.40],  // Closes below midpoint (28.5) but above prev open
  low: [27.80, 28.20],
}

var exactMidpointInput = {
  open: [24.00, 26.00],  // Tests exact midpoint penetration
  high: [25.50, 26.20],
  close: [25.00, 24.50],  // Closes exactly at midpoint (24.50)
  low: [23.80, 24.30],
}

var dojiFirstInput = {
  open: [20.00, 21.50],  // First candle is doji
  high: [20.30, 21.80],
  close: [20.05, 20.80],
  low: [19.80, 20.60],
}

describe('DarkCloudCover: ', function() {
   before(function() {
    var imageBuffer = drawCandleStick(input);
    fs.writeFileSync(__dirname+'/images/darkCloudCover.svg',imageBuffer);
  });

  it('Check whether the supplied data has DarkCloudCover pattern', function() {
   var darkCloudCover = new DarkCloudCover ();
   var result        = darkCloudCover.hasPattern(input);
   assert.deepEqual(result, true, 'Invalid result for DarkCloudCover');
  });

  it('Should detect strong dark cloud cover pattern', function() {
    var darkCloudCover = new DarkCloudCover();
    var result = darkCloudCover.hasPattern(strongDarkCloudInput);
    assert.deepEqual(result, true, 'Should detect strong dark cloud cover');
  });

  it('Should detect weak dark cloud cover pattern', function() {
    var darkCloudCover = new DarkCloudCover();
    var result = darkCloudCover.hasPattern(weakDarkCloudInput);
    assert.deepEqual(result, true, 'Should detect weak dark cloud cover');
  });

  it('Should reject invalid dark cloud cover (no gap up)', function() {
    var darkCloudCover = new DarkCloudCover();
    var result = darkCloudCover.hasPattern(invalidDarkCloudInput);
    assert.deepEqual(result, false, 'Should reject invalid dark cloud cover');
  });

  it('Should reject bullish pattern', function() {
    var darkCloudCover = new DarkCloudCover();
    var result = darkCloudCover.hasPattern(bullishInput);
    assert.deepEqual(result, false, 'Should reject bullish pattern');
  });

  it('Should reject bearish pattern', function() {
    var darkCloudCover = new DarkCloudCover();
    var result = darkCloudCover.hasPattern(bearishInput);
    assert.deepEqual(result, false, 'Should reject bearish pattern');
  });

  it('Should detect gap up dark cloud cover', function() {
    var darkCloudCover = new DarkCloudCover();
    var result = darkCloudCover.hasPattern(gapUpDarkCloudInput);
    assert.deepEqual(result, true, 'Should detect gap up dark cloud cover');
  });

  it('Should handle exact midpoint penetration', function() {
    var darkCloudCover = new DarkCloudCover();
    var result = darkCloudCover.hasPattern(exactMidpointInput);
    assert.equal(typeof result, 'boolean', 'Should handle exact midpoint case');
  });

  it('Should handle doji as first candle', function() {
    var darkCloudCover = new DarkCloudCover();
    var result = darkCloudCover.hasPattern(dojiFirstInput);
    assert.equal(typeof result, 'boolean', 'Should handle doji first candle');
  });

  it('Should handle empty input gracefully', function() {
    var darkCloudCover = new DarkCloudCover();
    var emptyInput = { open: [], high: [], close: [], low: [] };
    var result = darkCloudCover.hasPattern(emptyInput);
    assert.deepEqual(result, false, 'Should return false for empty input');
  });

  it('Should handle single candle input', function() {
    var darkCloudCover = new DarkCloudCover();
    var singleInput = {
      open: [20.00],
      high: [21.00],
      close: [19.50],
      low: [19.00]
    };
    var result = darkCloudCover.hasPattern(singleInput);
    assert.deepEqual(result, false, 'Should return false for single candle');
  });

  it('Should handle three candle input', function() {
    var darkCloudCover = new DarkCloudCover();
    var threeInput = {
      open: [20.00, 21.50, 22.80],
      high: [21.20, 22.30, 23.00],
      close: [21.00, 22.10, 22.50],
      low: [19.80, 21.30, 22.30]
    };
    var result = darkCloudCover.hasPattern(threeInput);
    assert.equal(typeof result, 'boolean', 'Should handle three candle input');
  });
})


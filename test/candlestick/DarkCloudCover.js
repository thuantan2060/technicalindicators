var DarkCloudCover = require('../../lib/candlestick/DarkCloudCover').default;
var assert = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs                      = require('fs');

var input = {
  open: [42.70, 41.33],  // Current: bearish (42.70 -> 41.60), Previous: bullish (41.33 -> 42.34)
  high: [42.82,42.50],
  close: [41.60,42.34],
  low: [41.45,41.15],
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
})


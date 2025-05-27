var PiercingLine = require('../../lib/candlestick/PiercingLine').default;
var assert = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs                      = require('fs');

var input = {
  open: [30.10,39.45],  // Current: bullish (30.10 -> 36.50), Previous: bearish (39.45 -> 32.50)
  high: [37.40,41.45],  // Previous midpoint: (39.45 + 32.50) / 2 = 35.975, Current close: 36.50 > 35.975 ✓
  close: [36.50,32.50],
  low: [28.30,31.25],
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
})


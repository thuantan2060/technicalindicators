var Bearish = require('../../lib/candlestick/Bearish.js').default;
var assert                  = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs                      = require('fs');
var twoDayBearishInput = {
  open: [30.20,15.36],  // Current: bearish (30.20 -> 14.50), Previous: bullish (15.36 -> 27.89)
  high: [30.50,30.87],
  close: [14.50,27.89],
  low: [14.00,14.93],
}

var oneDayBearishInput = {
  open: [21.44],
  high: [25.10],
  close: [23.25],
  low: [20.82],
}

describe('BearishPattern : ', function() {
  before(function() {
    var imageBuffer = drawCandleStick(twoDayBearishInput);
    fs.writeFileSync(__dirname+'/images/bearish.svg',imageBuffer);
  });
  it('Check whether the supplied data has Bearish pattern', function() {
   var bearishPattern = new Bearish ();
   var result        = bearishPattern.hasPattern(twoDayBearishInput);
   assert.deepEqual(result, true, 'Invalid result for BearishPattern');
  });
})


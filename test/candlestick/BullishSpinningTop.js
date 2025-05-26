var BullishSpinningTop = require('../../lib/candlestick/BullishSpinningTop').default;
var assert = require('assert');
var { drawCandleStick } = require('../test-helper');
var fs                      = require('fs');

var input = {
  open: [3320.145],
  high: [3345.496],
  close: [3300.17],
  low: [3279.276],
  
}

describe('BullishSpinningTop : ', function() {
   before(function() {
    var imageBuffer = drawCandleStick(input);
    fs.writeFileSync(__dirname+'/images/BullishSpinningTop.svg',imageBuffer);
  });
  it('Check whether the supplied data has BullishSpinningTop pattern', function() {
   var bullishSpinningTop = new BullishSpinningTop ();
   var result = bullishSpinningTop.hasPattern(input);
   assert.deepEqual(result, true, 'Invalid result for BullishSpinningTop')
   
  });
})


var CandlestickFinder = require('../../lib/candlestick/CandlestickFinder').default;
var assert = require('assert');


var input = {
  open: [30.10,30.18,30.15,29.15,28.35,29.19,28.83,28.13,28.17,28.35,28.34],
  high: [30.20,30.28,30.45,29.35,29.35,29.29,28.83,28.73,28.67,28.85,28.64],
  low:  [29.41,29.32,29.96,28.74,28.56,28.41,28.08,27.43,27.66,27.83,27.40],
  close:[29.87,30.24,30.10,28.90,28.92,28.48,28.56,27.56,28.47,28.28,27.49],
}

var expectResult =  [
  {
    "open": [
      30.1,
      30.18,
      30.15
    ],
    "high": [
      30.2,
      30.28,
      30.45
    ],
    "low": [
      29.41,
      29.32,
      29.96
    ],
    "close": [
      29.87,
      30.24,
      30.1
    ]
  },
  {
    "open": [
      30.18,
      30.15,
      29.15
    ],
    "high": [
      30.28,
      30.45,
      29.35
    ],
    "low": [
      29.32,
      29.96,
      28.74
    ],
    "close": [
      30.24,
      30.1,
      28.9
    ]
  },
  {
    "open": [
      30.15,
      29.15,
      28.35
    ],
    "high": [
      30.45,
      29.35,
      29.35
    ],
    "low": [
      29.96,
      28.74,
      28.56
    ],
    "close": [
      30.1,
      28.9,
      28.92
    ]
  },
  {
    "open": [
      29.15,
      28.35,
      29.19
    ],
    "high": [
      29.35,
      29.35,
      29.29
    ],
    "low": [
      28.74,
      28.56,
      28.41
    ],
    "close": [
      28.9,
      28.92,
      28.48
    ]
  },
  {
    "open": [
      28.35,
      29.19,
      28.83
    ],
    "high": [
      29.35,
      29.29,
      28.83
    ],
    "low": [
      28.56,
      28.41,
      28.08
    ],
    "close": [
      28.92,
      28.48,
      28.56
    ]
  },
  {
    "open": [
      29.19,
      28.83,
      28.13
    ],
    "high": [
      29.29,
      28.83,
      28.73
    ],
    "low": [
      28.41,
      28.08,
      27.43
    ],
    "close": [
      28.48,
      28.56,
      27.56
    ]
  },
  {
    "open": [
      28.83,
      28.13,
      28.17
    ],
    "high": [
      28.83,
      28.73,
      28.67
    ],
    "low": [
      28.08,
      27.43,
      27.66
    ],
    "close": [
      28.56,
      27.56,
      28.47
    ]
  },
  {
    "open": [
      28.13,
      28.17,
      28.35
    ],
    "high": [
      28.73,
      28.67,
      28.85
    ],
    "low": [
      27.43,
      27.66,
      27.83
    ],
    "close": [
      27.56,
      28.47,
      28.28
    ]
  },
  {
    "open": [
      28.17,
      28.35,
      28.34
    ],
    "high": [
      28.67,
      28.85,
      28.64
    ],
    "low": [
      27.66,
      27.83,
      27.4
    ],
    "close": [
      28.47,
      28.28,
      27.49
    ]
  }
]

let singleLastData = {
    "open": [
      28.17,
      28.35,
      28.34
    ],
    "high": [
      28.67,
      28.85,
      28.64
    ],
    "low": [
      27.66,
      27.83,
      27.4
    ],
    "close": [
      28.47,
      28.28,
      27.49
    ]
  }

describe('Common candlestick utilities : ', function() {
  it('Generate candlestick should generate subset of data based on supplied data', function() {
   var results = CandlestickFinder.prototype._generateDataForCandleStick.call({ requiredCount : 3 }, input);
   assert.deepEqual(results.length, input.close.length - (3 -1), 'Wrong subset length of data while generating data for candlestick');
   assert.deepEqual(results, expectResult, 'Wrong subset of data while generating data for candlestick');
  })
  
  it('Generate candlestick should generate subset of data based on supplied data', function() {
   let results = CandlestickFinder.prototype._getLastDataForCandleStick.call({ requiredCount : 3 }, input);
   assert.deepEqual(results, expectResult[expectResult.length - 1], 'Wrong Results while getting last data for candlestick');
  })
  
  it('Generate candlestick should generate subset of data based on supplied data', function() {
   let results = CandlestickFinder.prototype._getLastDataForCandleStick.call({ requiredCount : 3 }, singleLastData);
   assert.deepEqual(results, expectResult[expectResult.length - 1], 'Wrong Results while getting single last data for candlestick');
  })
  
  it('Approximate Equal return true when value is less than 0.1 percent of difference', function() {
   // Create a mock instance with scale property for testing
   var mockInstance = { scale: 1 };
   var results = CandlestickFinder.prototype.approximateEqual.call(mockInstance, 1, 1.001);
   assert.deepEqual(results, true, 'Approximate equal returns false when true');
   var results = CandlestickFinder.prototype.approximateEqual.call(mockInstance, 10, 10.01);
   assert.deepEqual(results, true, 'Approximate equal returns false when true');
   var results = CandlestickFinder.prototype.approximateEqual.call(mockInstance, 100, 100.1);
   assert.deepEqual(results, true, 'Approximate equal returns false when true');
   var results = CandlestickFinder.prototype.approximateEqual.call(mockInstance, 1000, 1001);
   assert.deepEqual(results, true, 'Approximate equal returns false when true');
   var results = CandlestickFinder.prototype.approximateEqual.call(mockInstance, 10000, 10010);
   assert.deepEqual(results, true, 'Approximate equal returns false when true');
  })
  
  // Enhanced approximateEqual tests
  it('Approximate Equal should return false when difference is too large', function() {
   var mockInstance = { scale: 1 };
   var result = CandlestickFinder.prototype.approximateEqual.call(mockInstance, 1, 1.1);
   assert.deepEqual(result, false, 'Should return false for large difference');
   
   var result2 = CandlestickFinder.prototype.approximateEqual.call(mockInstance, 100, 110);
   assert.deepEqual(result2, false, 'Should return false for large difference');
   
   var result3 = CandlestickFinder.prototype.approximateEqual.call(mockInstance, 1000, 1100);
   assert.deepEqual(result3, false, 'Should return false for large difference');
  })
  
  it('Approximate Equal should handle negative numbers', function() {
   var mockInstance = { scale: 1 };
   var result = CandlestickFinder.prototype.approximateEqual.call(mockInstance, -10, -10.01);
   assert.deepEqual(result, true, 'Should handle negative numbers correctly');
   
   var result2 = CandlestickFinder.prototype.approximateEqual.call(mockInstance, -10, -11);
   assert.deepEqual(result2, false, 'Should return false for large negative difference');
  })
  
  it('Approximate Equal should handle zero values', function() {
   var mockInstance = { scale: 1 };
   var result = CandlestickFinder.prototype.approximateEqual.call(mockInstance, 0, 0);
   assert.deepEqual(result, true, 'Should handle zero values');
   
   var result2 = CandlestickFinder.prototype.approximateEqual.call(mockInstance, 0, 0.001);
   assert.deepEqual(result2, true, 'Should handle small differences from zero');
  })
  
  it('Approximate Equal should work with different scales', function() {
   var mockInstance = { scale: 2 };
   var result = CandlestickFinder.prototype.approximateEqual.call(mockInstance, 100, 100.2);
   assert.deepEqual(result, true, 'Should work with scale 2');
   
   var mockInstance2 = { scale: 0.5 };
   var result2 = CandlestickFinder.prototype.approximateEqual.call(mockInstance2, 100, 100.05);
   assert.deepEqual(result2, true, 'Should work with scale 0.5');
  })
  
  // Test error handling
  it('Should handle empty data gracefully', function() {
   var emptyData = { open: [], high: [], close: [], low: [] };
   var results = CandlestickFinder.prototype._generateDataForCandleStick.call({ requiredCount : 3 }, emptyData);
   assert.deepEqual(results.length, 0, 'Should return empty array for empty data');
  })
  
  it('Should handle insufficient data gracefully', function() {
   var smallData = { 
     open: [10, 11], 
     high: [11, 12], 
     close: [10.5, 11.5], 
     low: [9.5, 10.5] 
   };
   var results = CandlestickFinder.prototype._generateDataForCandleStick.call({ requiredCount : 5 }, smallData);
   assert.deepEqual(results.length, 0, 'Should return empty array when not enough data');
  })
  
  it('Should handle exact required count data', function() {
   var exactData = { 
     open: [10, 11, 12], 
     high: [11, 12, 13], 
     close: [10.5, 11.5, 12.5], 
     low: [9.5, 10.5, 11.5] 
   };
   var results = CandlestickFinder.prototype._generateDataForCandleStick.call({ requiredCount : 3 }, exactData);
   assert.deepEqual(results.length, 1, 'Should return one result for exact count');
   assert.deepEqual(results[0], exactData, 'Should return the same data');
  })
  
  it('Should handle single day required count', function() {
   var singleDayData = { 
     open: [10, 11, 12], 
     high: [11, 12, 13], 
     close: [10.5, 11.5, 12.5], 
     low: [9.5, 10.5, 11.5] 
   };
   var results = CandlestickFinder.prototype._generateDataForCandleStick.call({ requiredCount : 1 }, singleDayData);
   assert.deepEqual(results.length, 3, 'Should return three results for single day requirement');
  })
  
  it('Should generate correct last data subset for single required count', function() {
   var results = CandlestickFinder.prototype._getLastDataForCandleStick.call({ requiredCount : 1 }, input);
   var expected = {
     open: [input.open[input.open.length - 1]],
     high: [input.high[input.high.length - 1]],
     low: [input.low[input.low.length - 1]],
     close: [input.close[input.close.length - 1]]
   };
   assert.deepEqual(results, expected, 'Should return correct last data for single day requirement');
  })
  
  // Test with reversed input
  it('Should handle reversed input properly in getAllPatternIndex', function() {
   // Create a mock pattern finder for testing
   var mockPattern = {
     requiredCount: 2,
     name: 'TestPattern',
     logic: function(data) {
       // Simple test logic: return true if first close > first open
       return data.close[0] > data.open[0];
     },
     getAllPatternIndex: CandlestickFinder.prototype.getAllPatternIndex,
     _generateDataForCandleStick: CandlestickFinder.prototype._generateDataForCandleStick
   };
   
   var testData = {
     open: [20, 22, 24],
     high: [21, 23, 25],
     close: [20.5, 22.5, 24.5], // All bullish
     low: [19.5, 21.5, 23.5],
     reversedInput: true
   };
   
   var results = mockPattern.getAllPatternIndex(testData);
   assert.deepEqual(Array.isArray(results), true, 'Should return an array');
   // Note: The reversed input should be reversed back to normal order
  })
})

// Additional test for logic method error
describe('CandlestickFinder abstract methods: ', function() {
  it('Should throw error when logic method is called directly', function() {
   var finder = new CandlestickFinder();
   assert.throws(() => {
     finder.logic({});
   }, /this has to be implemented/, 'Should throw error for unimplemented logic method');
  })
})

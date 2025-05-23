'use strict';

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var lib = {};

var interopRequireDefault = {exports: {}};

(function (module) {
	function _interopRequireDefault(e) {
	  return e && e.__esModule ? e : {
	    "default": e
	  };
	}
	module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports; 
} (interopRequireDefault));

var interopRequireDefaultExports = interopRequireDefault.exports;

var FixedSizeLinkedList = {};

var LinkedList = {};

var hasRequiredLinkedList;

function requireLinkedList () {
	if (hasRequiredLinkedList) return LinkedList;
	hasRequiredLinkedList = 1;

	Object.defineProperty(LinkedList, "__esModule", {
	  value: true
	});
	LinkedList.LinkedList = void 0;
	class Item {
	  next;
	  prev;
	  data;
	  constructor(data, prev, next) {
	    this.next = next;
	    if (next) next.prev = this;
	    this.prev = prev;
	    if (prev) prev.next = this;
	    this.data = data;
	  }
	}
	let LinkedList$1 = class LinkedList {
	  _head;
	  _tail;
	  _next;
	  _length = 0;
	  _current;
	  constructor() {}
	  get head() {
	    return this._head && this._head.data;
	  }
	  get tail() {
	    return this._tail && this._tail.data;
	  }
	  get current() {
	    return this._current && this._current.data;
	  }
	  get length() {
	    return this._length;
	  }
	  push(data) {
	    this._tail = new Item(data, this._tail);
	    if (this._length === 0) {
	      this._head = this._tail;
	      this._current = this._head;
	      this._next = this._head;
	    }
	    this._length++;
	  }
	  pop() {
	    var tail = this._tail;
	    if (this._length === 0) {
	      return;
	    }
	    this._length--;
	    if (this._length === 0) {
	      this._head = this._tail = this._current = this._next = undefined;
	      return tail.data;
	    }
	    this._tail = tail.prev;
	    this._tail.next = undefined;
	    if (this._current === tail) {
	      this._current = this._tail;
	      this._next = undefined;
	    }
	    return tail.data;
	  }
	  shift() {
	    var head = this._head;
	    if (this._length === 0) {
	      return;
	    }
	    this._length--;
	    if (this._length === 0) {
	      this._head = this._tail = this._current = this._next = undefined;
	      return head.data;
	    }
	    this._head = this._head.next;
	    if (this._current === head) {
	      this._current = this._head;
	      this._next = this._current.next;
	    }
	    return head.data;
	  }
	  unshift(data) {
	    this._head = new Item(data, undefined, this._head);
	    if (this._length === 0) {
	      this._tail = this._head;
	      this._next = this._head;
	    }
	    this._length++;
	  }
	  unshiftCurrent() {
	    var current = this._current;
	    if (current === this._head || this._length < 2) {
	      return current && current.data;
	    }
	    // remove
	    if (current === this._tail) {
	      this._tail = current.prev;
	      this._tail.next = undefined;
	      this._current = this._tail;
	    } else {
	      current.next.prev = current.prev;
	      current.prev.next = current.next;
	      this._current = current.prev;
	    }
	    this._next = this._current.next;
	    // unshift
	    current.next = this._head;
	    current.prev = undefined;
	    this._head.prev = current;
	    this._head = current;
	    return current.data;
	  }
	  removeCurrent() {
	    var current = this._current;
	    if (this._length === 0) {
	      return;
	    }
	    this._length--;
	    if (this._length === 0) {
	      this._head = this._tail = this._current = this._next = undefined;
	      return current.data;
	    }
	    if (current === this._tail) {
	      this._tail = current.prev;
	      this._tail.next = undefined;
	      this._current = this._tail;
	    } else if (current === this._head) {
	      this._head = current.next;
	      this._head.prev = undefined;
	      this._current = this._head;
	    } else {
	      current.next.prev = current.prev;
	      current.prev.next = current.next;
	      this._current = current.prev;
	    }
	    this._next = this._current.next;
	    return current.data;
	  }
	  resetCursor() {
	    this._current = this._next = this._head;
	    return this;
	  }
	  next() {
	    var next = this._next;
	    if (next !== undefined) {
	      this._next = next.next;
	      this._current = next;
	      return next.data;
	    }
	  }
	};
	LinkedList.LinkedList = LinkedList$1;
	
	return LinkedList;
}

var hasRequiredFixedSizeLinkedList;

function requireFixedSizeLinkedList () {
	if (hasRequiredFixedSizeLinkedList) return FixedSizeLinkedList;
	hasRequiredFixedSizeLinkedList = 1;

	Object.defineProperty(FixedSizeLinkedList, "__esModule", {
	  value: true
	});
	FixedSizeLinkedList.default = void 0;
	var _LinkedList = requireLinkedList();
	/**
	 * Created by AAravindan on 5/7/16.
	 */

	let FixedSizeLinkedList$1 = class FixedSizeLinkedList extends _LinkedList.LinkedList {
	  totalPushed = 0;
	  periodHigh = 0;
	  periodLow = Infinity;
	  periodSum = 0;
	  lastShift;
	  _push;
	  constructor(size, maintainHigh, maintainLow, maintainSum) {
	    super();
	    this.size = size;
	    this.maintainHigh = maintainHigh;
	    this.maintainLow = maintainLow;
	    this.maintainSum = maintainSum;
	    if (!size || typeof size !== 'number') {
	      throw 'Size required and should be a number.';
	    }
	    this._push = this.push;
	    this.push = function (data) {
	      this.add(data);
	      this.totalPushed++;
	    };
	  }
	  add(data) {
	    if (this.length === this.size) {
	      this.lastShift = this.shift();
	      this._push(data);
	      //TODO: FInd a better way
	      if (this.maintainHigh) if (this.lastShift == this.periodHigh) this.calculatePeriodHigh();
	      if (this.maintainLow) if (this.lastShift == this.periodLow) this.calculatePeriodLow();
	      if (this.maintainSum) {
	        this.periodSum = this.periodSum - this.lastShift;
	      }
	    } else {
	      this._push(data);
	    }
	    //TODO: FInd a better way
	    if (this.maintainHigh) if (this.periodHigh <= data) this.periodHigh = data;
	    if (this.maintainLow) if (this.periodLow >= data) this.periodLow = data;
	    if (this.maintainSum) {
	      this.periodSum = this.periodSum + data;
	    }
	  }
	  *iterator() {
	    this.resetCursor();
	    while (this.next()) {
	      yield this.current;
	    }
	  }
	  calculatePeriodHigh() {
	    this.resetCursor();
	    if (this.next()) this.periodHigh = this.current;
	    while (this.next()) {
	      if (this.periodHigh <= this.current) {
	        this.periodHigh = this.current;
	      }
	    }
	  }
	  calculatePeriodLow() {
	    this.resetCursor();
	    if (this.next()) this.periodLow = this.current;
	    while (this.next()) {
	      if (this.periodLow >= this.current) {
	        this.periodLow = this.current;
	      }
	    }
	  }
	};
	FixedSizeLinkedList.default = FixedSizeLinkedList$1;
	
	return FixedSizeLinkedList;
}

var StockData = {};

var hasRequiredStockData;

function requireStockData () {
	if (hasRequiredStockData) return StockData;
	hasRequiredStockData = 1;

	Object.defineProperty(StockData, "__esModule", {
	  value: true
	});
	StockData.default = StockData.CandleList = StockData.CandleData = void 0;
	let StockData$1 = class StockData {
	  reversedInput;
	  constructor(open, high, low, close, reversedInput) {
	    this.open = open;
	    this.high = high;
	    this.low = low;
	    this.close = close;
	    this.reversedInput = reversedInput;
	  }
	};
	StockData.default = StockData$1;
	class CandleData {
	  open;
	  high;
	  low;
	  close;
	  timestamp;
	  volume;
	}
	StockData.CandleData = CandleData;
	class CandleList {
	  open = [];
	  high = [];
	  low = [];
	  close = [];
	  volume = [];
	  timestamp = [];
	}
	StockData.CandleList = CandleList;
	
	return StockData;
}

var SMA = {};

var indicator = {};

var NumberFormatter = {};

var config = {};

var hasRequiredConfig;

function requireConfig () {
	if (hasRequiredConfig) return config;
	hasRequiredConfig = 1;

	Object.defineProperty(config, "__esModule", {
	  value: true
	});
	config.getConfig = getConfig;
	config.setConfig = setConfig;
	let config$1 = {};
	function setConfig(key, value) {
	  config$1[key] = value;
	}
	function getConfig(key) {
	  return config$1[key];
	}
	
	return config;
}

var hasRequiredNumberFormatter;

function requireNumberFormatter () {
	if (hasRequiredNumberFormatter) return NumberFormatter;
	hasRequiredNumberFormatter = 1;

	Object.defineProperty(NumberFormatter, "__esModule", {
	  value: true
	});
	NumberFormatter.format = format;
	var _config = requireConfig();
	function format(v) {
	  let precision = (0, _config.getConfig)('precision');
	  if (precision) {
	    return parseFloat(v.toPrecision(precision));
	  }
	  return v;
	}
	
	return NumberFormatter;
}

var hasRequiredIndicator;

function requireIndicator () {
	if (hasRequiredIndicator) return indicator;
	hasRequiredIndicator = 1;

	Object.defineProperty(indicator, "__esModule", {
	  value: true
	});
	indicator.IndicatorInput = indicator.Indicator = indicator.AllInputs = void 0;
	var _NumberFormatter = requireNumberFormatter();
	class IndicatorInput {
	  reversedInput;
	  format;
	}
	indicator.IndicatorInput = IndicatorInput;
	class AllInputs {
	  values;
	  open;
	  high;
	  low;
	  close;
	  volume;
	  timestamp;
	}
	indicator.AllInputs = AllInputs;
	class Indicator {
	  result;
	  format;
	  constructor(input) {
	    this.format = input.format || _NumberFormatter.format;
	  }
	  static reverseInputs(input) {
	    if (input.reversedInput) {
	      input.values ? input.values.reverse() : undefined;
	      input.open ? input.open.reverse() : undefined;
	      input.high ? input.high.reverse() : undefined;
	      input.low ? input.low.reverse() : undefined;
	      input.close ? input.close.reverse() : undefined;
	      input.volume ? input.volume.reverse() : undefined;
	      input.timestamp ? input.timestamp.reverse() : undefined;
	    }
	  }
	  getResult() {
	    return this.result;
	  }
	}
	indicator.Indicator = Indicator;
	
	return indicator;
}

var hasRequiredSMA;

function requireSMA () {
	if (hasRequiredSMA) return SMA;
	hasRequiredSMA = 1;

	Object.defineProperty(SMA, "__esModule", {
	  value: true
	});
	SMA.SMA = SMA.MAInput = void 0;
	SMA.sma = sma;
	var _indicator = requireIndicator();
	var _LinkedList = requireLinkedList();
	//STEP 1. Import Necessary indicator or rather last step

	//STEP 2. Create the input for the indicator, mandatory should be in the constructor
	class MAInput extends _indicator.IndicatorInput {
	  constructor(period, values) {
	    super();
	    this.period = period;
	    this.values = values;
	  }
	}

	//STEP3. Add class based syntax with export
	SMA.MAInput = MAInput;
	let SMA$1 = class SMA extends _indicator.Indicator {
	  period;
	  price;
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    this.period = input.period;
	    this.price = input.values;
	    var genFn = function* (period) {
	      var list = new _LinkedList.LinkedList();
	      var sum = 0;
	      var counter = 1;
	      var current = yield;
	      var result;
	      list.push(0);
	      while (true) {
	        if (counter < period) {
	          counter++;
	          list.push(current);
	          sum = sum + current;
	        } else {
	          sum = sum - list.shift() + current;
	          result = sum / period;
	          list.push(current);
	        }
	        current = yield result;
	      }
	    };
	    this.generator = genFn(this.period);
	    this.generator.next();
	    this.result = [];
	    this.price.forEach(tick => {
	      var result = this.generator.next(tick);
	      if (result.value !== undefined) {
	        this.result.push(this.format(result.value));
	      }
	    });
	  }
	  static calculate = sma;
	  nextValue(price) {
	    var result = this.generator.next(price).value;
	    if (result != undefined) return this.format(result);
	  }
	};
	SMA.SMA = SMA$1;
	function sma(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new SMA$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}

	//STEP 6. Run the tests
	
	return SMA;
}

var EMA = {};

var hasRequiredEMA;

function requireEMA () {
	if (hasRequiredEMA) return EMA;
	hasRequiredEMA = 1;

	Object.defineProperty(EMA, "__esModule", {
	  value: true
	});
	EMA.EMA = void 0;
	EMA.ema = ema;
	var _indicator = requireIndicator();
	var _SMA = requireSMA();
	let EMA$1 = class EMA extends _indicator.Indicator {
	  period;
	  price;
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    var period = input.period;
	    var priceArray = input.values;
	    var exponent = 2 / (period + 1);
	    var sma;
	    this.result = [];
	    sma = new _SMA.SMA({
	      period: period,
	      values: []
	    });
	    var genFn = function* () {
	      var tick = yield;
	      var prevEma;
	      while (true) {
	        if (prevEma !== undefined && tick !== undefined) {
	          prevEma = (tick - prevEma) * exponent + prevEma;
	          tick = yield prevEma;
	        } else {
	          tick = yield;
	          prevEma = sma.nextValue(tick);
	          if (prevEma) tick = yield prevEma;
	        }
	      }
	    };
	    this.generator = genFn();
	    this.generator.next();
	    this.generator.next();
	    priceArray.forEach(tick => {
	      var result = this.generator.next(tick);
	      if (result.value != undefined) {
	        this.result.push(this.format(result.value));
	      }
	    });
	  }
	  static calculate = ema;
	  nextValue(price) {
	    var result = this.generator.next(price).value;
	    if (result != undefined) return this.format(result);
	  }
	};
	EMA.EMA = EMA$1;
	function ema(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new EMA$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return EMA;
}

var WMA = {};

var hasRequiredWMA;

function requireWMA () {
	if (hasRequiredWMA) return WMA;
	hasRequiredWMA = 1;

	Object.defineProperty(WMA, "__esModule", {
	  value: true
	});
	WMA.WMA = void 0;
	WMA.wma = wma;
	var _indicator = requireIndicator();
	var _LinkedList = requireLinkedList();
	let WMA$1 = class WMA extends _indicator.Indicator {
	  period;
	  price;
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    var period = input.period;
	    var priceArray = input.values;
	    this.result = [];
	    this.generator = function* () {
	      let data = new _LinkedList.LinkedList();
	      let denominator = period * (period + 1) / 2;
	      while (true) {
	        if (data.length < period) {
	          data.push(yield);
	        } else {
	          data.resetCursor();
	          let result = 0;
	          for (let i = 1; i <= period; i++) {
	            result = result + data.next() * i / denominator;
	          }
	          var next = yield result;
	          data.shift();
	          data.push(next);
	        }
	      }
	    }();
	    this.generator.next();
	    priceArray.forEach((tick, index) => {
	      var result = this.generator.next(tick);
	      if (result.value != undefined) {
	        this.result.push(this.format(result.value));
	      }
	    });
	  }
	  static calculate = wma;

	  //STEP 5. REMOVE GET RESULT FUNCTION
	  nextValue(price) {
	    var result = this.generator.next(price).value;
	    if (result != undefined) return this.format(result);
	  }
	};
	WMA.WMA = WMA$1;
	function wma(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new WMA$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return WMA;
}

var WEMA = {};

var hasRequiredWEMA;

function requireWEMA () {
	if (hasRequiredWEMA) return WEMA;
	hasRequiredWEMA = 1;

	Object.defineProperty(WEMA, "__esModule", {
	  value: true
	});
	WEMA.WEMA = void 0;
	WEMA.wema = wema;
	var _indicator = requireIndicator();
	var _SMA = requireSMA();
	let WEMA$1 = class WEMA extends _indicator.Indicator {
	  period;
	  price;
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    var period = input.period;
	    var priceArray = input.values;
	    var exponent = 1 / period;
	    var sma;
	    this.result = [];
	    sma = new _SMA.SMA({
	      period: period,
	      values: []
	    });
	    var genFn = function* () {
	      var tick = yield;
	      var prevEma;
	      while (true) {
	        if (prevEma !== undefined && tick !== undefined) {
	          prevEma = (tick - prevEma) * exponent + prevEma;
	          tick = yield prevEma;
	        } else {
	          tick = yield;
	          prevEma = sma.nextValue(tick);
	          if (prevEma !== undefined) tick = yield prevEma;
	        }
	      }
	    };
	    this.generator = genFn();
	    this.generator.next();
	    this.generator.next();
	    priceArray.forEach(tick => {
	      var result = this.generator.next(tick);
	      if (result.value != undefined) {
	        this.result.push(this.format(result.value));
	      }
	    });
	  }
	  static calculate = wema;
	  nextValue(price) {
	    var result = this.generator.next(price).value;
	    if (result != undefined) return this.format(result);
	  }
	};
	WEMA.WEMA = WEMA$1;
	function wema(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new WEMA$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return WEMA;
}

var MACD = {};

var hasRequiredMACD;

function requireMACD () {
	if (hasRequiredMACD) return MACD;
	hasRequiredMACD = 1;

	Object.defineProperty(MACD, "__esModule", {
	  value: true
	});
	MACD.MACDOutput = MACD.MACDInput = MACD.MACD = void 0;
	MACD.macd = macd;
	var _indicator = requireIndicator();
	var _SMA = requireSMA();
	var _EMA = requireEMA();
	/**
	 * Created by AAravindan on 5/4/16.
	 */

	class MACDInput extends _indicator.IndicatorInput {
	  SimpleMAOscillator = true;
	  SimpleMASignal = true;
	  fastPeriod;
	  slowPeriod;
	  signalPeriod;
	  constructor(values) {
	    super();
	    this.values = values;
	  }
	}
	MACD.MACDInput = MACDInput;
	class MACDOutput {
	  MACD;
	  signal;
	  histogram;
	}
	MACD.MACDOutput = MACDOutput;
	let MACD$1 = class MACD extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    var oscillatorMAtype = input.SimpleMAOscillator ? _SMA.SMA : _EMA.EMA;
	    var signalMAtype = input.SimpleMASignal ? _SMA.SMA : _EMA.EMA;
	    var fastMAProducer = new oscillatorMAtype({
	      period: input.fastPeriod,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    var slowMAProducer = new oscillatorMAtype({
	      period: input.slowPeriod,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    var signalMAProducer = new signalMAtype({
	      period: input.signalPeriod,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    var format = this.format;
	    this.result = [];
	    this.generator = function* () {
	      var index = 0;
	      var tick;
	      var MACD, signal, histogram, fast, slow;
	      while (true) {
	        if (index < input.slowPeriod) {
	          tick = yield;
	          fast = fastMAProducer.nextValue(tick);
	          slow = slowMAProducer.nextValue(tick);
	          index++;
	          continue;
	        }
	        if (fast && slow) {
	          //Just for typescript to be happy
	          MACD = fast - slow;
	          signal = signalMAProducer.nextValue(MACD);
	        }
	        histogram = MACD - signal;
	        tick = yield {
	          //fast : fast,
	          //slow : slow,
	          MACD: format(MACD),
	          signal: signal ? format(signal) : undefined,
	          histogram: isNaN(histogram) ? undefined : format(histogram)
	        };
	        fast = fastMAProducer.nextValue(tick);
	        slow = slowMAProducer.nextValue(tick);
	      }
	    }();
	    this.generator.next();
	    input.values.forEach(tick => {
	      var result = this.generator.next(tick);
	      if (result.value != undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = macd;
	  nextValue(price) {
	    var result = this.generator.next(price).value;
	    return result;
	  }
	};
	MACD.MACD = MACD$1;
	function macd(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new MACD$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return MACD;
}

var RSI = {};

var AverageGain = {};

var hasRequiredAverageGain;

function requireAverageGain () {
	if (hasRequiredAverageGain) return AverageGain;
	hasRequiredAverageGain = 1;

	Object.defineProperty(AverageGain, "__esModule", {
	  value: true
	});
	AverageGain.AvgGainInput = AverageGain.AverageGain = void 0;
	AverageGain.averagegain = averagegain;
	var _indicator = requireIndicator();
	class AvgGainInput extends _indicator.IndicatorInput {
	  period;
	  values;
	}
	AverageGain.AvgGainInput = AvgGainInput;
	let AverageGain$1 = class AverageGain extends _indicator.Indicator {
	  generator;
	  constructor(input) {
	    super(input);
	    let values = input.values;
	    let period = input.period;
	    let format = this.format;
	    this.generator = function* (period) {
	      var currentValue = yield;
	      var counter = 1;
	      var gainSum = 0;
	      var avgGain;
	      var gain;
	      var lastValue = currentValue;
	      currentValue = yield;
	      while (true) {
	        gain = currentValue - lastValue;
	        gain = gain > 0 ? gain : 0;
	        if (gain > 0) {
	          gainSum = gainSum + gain;
	        }
	        if (counter < period) {
	          counter++;
	        } else if (avgGain === undefined) {
	          avgGain = gainSum / period;
	        } else {
	          avgGain = (avgGain * (period - 1) + gain) / period;
	        }
	        lastValue = currentValue;
	        avgGain = avgGain !== undefined ? format(avgGain) : undefined;
	        currentValue = yield avgGain;
	      }
	    }(period);
	    this.generator.next();
	    this.result = [];
	    values.forEach(tick => {
	      var result = this.generator.next(tick);
	      if (result.value !== undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = averagegain;
	  nextValue(price) {
	    return this.generator.next(price).value;
	  }
	};
	AverageGain.AverageGain = AverageGain$1;
	function averagegain(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new AverageGain$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return AverageGain;
}

var AverageLoss = {};

var hasRequiredAverageLoss;

function requireAverageLoss () {
	if (hasRequiredAverageLoss) return AverageLoss;
	hasRequiredAverageLoss = 1;

	Object.defineProperty(AverageLoss, "__esModule", {
	  value: true
	});
	AverageLoss.AvgLossInput = AverageLoss.AverageLoss = void 0;
	AverageLoss.averageloss = averageloss;
	var _indicator = requireIndicator();
	class AvgLossInput extends _indicator.IndicatorInput {
	  values;
	  period;
	}
	AverageLoss.AvgLossInput = AvgLossInput;
	let AverageLoss$1 = class AverageLoss extends _indicator.Indicator {
	  generator;
	  constructor(input) {
	    super(input);
	    let values = input.values;
	    let period = input.period;
	    let format = this.format;
	    this.generator = function* (period) {
	      var currentValue = yield;
	      var counter = 1;
	      var lossSum = 0;
	      var avgLoss;
	      var loss;
	      var lastValue = currentValue;
	      currentValue = yield;
	      while (true) {
	        loss = lastValue - currentValue;
	        loss = loss > 0 ? loss : 0;
	        if (loss > 0) {
	          lossSum = lossSum + loss;
	        }
	        if (counter < period) {
	          counter++;
	        } else if (avgLoss === undefined) {
	          avgLoss = lossSum / period;
	        } else {
	          avgLoss = (avgLoss * (period - 1) + loss) / period;
	        }
	        lastValue = currentValue;
	        avgLoss = avgLoss !== undefined ? format(avgLoss) : undefined;
	        currentValue = yield avgLoss;
	      }
	    }(period);
	    this.generator.next();
	    this.result = [];
	    values.forEach(tick => {
	      var result = this.generator.next(tick);
	      if (result.value !== undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = averageloss;
	  nextValue(price) {
	    return this.generator.next(price).value;
	  }
	};
	AverageLoss.AverageLoss = AverageLoss$1;
	function averageloss(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new AverageLoss$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return AverageLoss;
}

var hasRequiredRSI;

function requireRSI () {
	if (hasRequiredRSI) return RSI;
	hasRequiredRSI = 1;

	Object.defineProperty(RSI, "__esModule", {
	  value: true
	});
	RSI.RSIInput = RSI.RSI = void 0;
	RSI.rsi = rsi;
	var _indicator = requireIndicator();
	var _AverageGain = requireAverageGain();
	var _AverageLoss = requireAverageLoss();
	/**
	 * Created by AAravindan on 5/5/16.
	 */

	class RSIInput extends _indicator.IndicatorInput {
	  period;
	  values;
	}
	RSI.RSIInput = RSIInput;
	let RSI$1 = class RSI extends _indicator.Indicator {
	  generator;
	  constructor(input) {
	    super(input);
	    var period = input.period;
	    var values = input.values;
	    var GainProvider = new _AverageGain.AverageGain({
	      period: period,
	      values: []
	    });
	    var LossProvider = new _AverageLoss.AverageLoss({
	      period: period,
	      values: []
	    });
	    this.generator = function* (period) {
	      var current = yield;
	      var lastAvgGain, lastAvgLoss, RS, currentRSI;
	      while (true) {
	        lastAvgGain = GainProvider.nextValue(current);
	        lastAvgLoss = LossProvider.nextValue(current);
	        if (lastAvgGain !== undefined && lastAvgLoss !== undefined) {
	          if (lastAvgLoss === 0) {
	            currentRSI = 100;
	          } else if (lastAvgGain === 0) {
	            currentRSI = 0;
	          } else {
	            RS = lastAvgGain / lastAvgLoss;
	            RS = isNaN(RS) ? 0 : RS;
	            currentRSI = parseFloat((100 - 100 / (1 + RS)).toFixed(2));
	          }
	        }
	        current = yield currentRSI;
	      }
	    }();
	    this.generator.next();
	    this.result = [];
	    values.forEach(tick => {
	      var result = this.generator.next(tick);
	      if (result.value !== undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = rsi;
	  nextValue(price) {
	    return this.generator.next(price).value;
	  }
	};
	RSI.RSI = RSI$1;
	function rsi(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new RSI$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return RSI;
}

var BollingerBands = {};

var SD = {};

var hasRequiredSD;

function requireSD () {
	if (hasRequiredSD) return SD;
	hasRequiredSD = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(SD, "__esModule", {
	  value: true
	});
	SD.SDInput = SD.SD = void 0;
	SD.sd = sd;
	var _indicator = requireIndicator();
	var _SMA = requireSMA();
	var _FixedSizeLinkedList = _interopRequireDefault(requireFixedSizeLinkedList());
	class SDInput extends _indicator.IndicatorInput {
	  period;
	  values;
	}
	SD.SDInput = SDInput;
	let SD$1 = class SD extends _indicator.Indicator {
	  generator;
	  constructor(input) {
	    super(input);
	    var period = input.period;
	    var priceArray = input.values;
	    var sma = new _SMA.SMA({
	      period: period,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    this.result = [];
	    this.generator = function* () {
	      var tick;
	      var mean;
	      var currentSet = new _FixedSizeLinkedList.default(period);
	      tick = yield;
	      var sd;
	      while (true) {
	        currentSet.push(tick);
	        mean = sma.nextValue(tick);
	        if (mean) {
	          let sum = 0;
	          for (let x of currentSet.iterator()) {
	            sum = sum + Math.pow(x - mean, 2);
	          }
	          sd = Math.sqrt(sum / period);
	        }
	        tick = yield sd;
	      }
	    }();
	    this.generator.next();
	    priceArray.forEach(tick => {
	      var result = this.generator.next(tick);
	      if (result.value != undefined) {
	        this.result.push(this.format(result.value));
	      }
	    });
	  }
	  static calculate = sd;
	  nextValue(price) {
	    var nextResult = this.generator.next(price);
	    if (nextResult.value != undefined) return this.format(nextResult.value);
	  }
	};
	SD.SD = SD$1;
	function sd(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new SD$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return SD;
}

var hasRequiredBollingerBands;

function requireBollingerBands () {
	if (hasRequiredBollingerBands) return BollingerBands;
	hasRequiredBollingerBands = 1;

	Object.defineProperty(BollingerBands, "__esModule", {
	  value: true
	});
	BollingerBands.BollingerBandsOutput = BollingerBands.BollingerBandsInput = BollingerBands.BollingerBands = void 0;
	BollingerBands.bollingerbands = bollingerbands;
	var _indicator = requireIndicator();
	var _SMA = requireSMA();
	var _SD = requireSD();
	class BollingerBandsInput extends _indicator.IndicatorInput {
	  period;
	  stdDev;
	  values;
	}
	BollingerBands.BollingerBandsInput = BollingerBandsInput;
	class BollingerBandsOutput extends _indicator.IndicatorInput {
	  middle;
	  upper;
	  lower;
	  pb;
	}
	BollingerBands.BollingerBandsOutput = BollingerBandsOutput;
	let BollingerBands$1 = class BollingerBands extends _indicator.Indicator {
	  generator;
	  constructor(input) {
	    super(input);
	    var period = input.period;
	    var priceArray = input.values;
	    var stdDev = input.stdDev;
	    var format = this.format;
	    var sma, sd;
	    this.result = [];
	    sma = new _SMA.SMA({
	      period: period,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    sd = new _SD.SD({
	      period: period,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    this.generator = function* () {
	      var result;
	      var tick;
	      var calcSMA;
	      var calcsd;
	      tick = yield;
	      while (true) {
	        calcSMA = sma.nextValue(tick);
	        calcsd = sd.nextValue(tick);
	        if (calcSMA) {
	          let middle = format(calcSMA);
	          let upper = format(calcSMA + calcsd * stdDev);
	          let lower = format(calcSMA - calcsd * stdDev);
	          let pb = format((tick - lower) / (upper - lower));
	          result = {
	            middle: middle,
	            upper: upper,
	            lower: lower,
	            pb: pb
	          };
	        }
	        tick = yield result;
	      }
	    }();
	    this.generator.next();
	    priceArray.forEach(tick => {
	      var result = this.generator.next(tick);
	      if (result.value != undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = bollingerbands;
	  nextValue(price) {
	    return this.generator.next(price).value;
	  }
	};
	BollingerBands.BollingerBands = BollingerBands$1;
	function bollingerbands(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new BollingerBands$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return BollingerBands;
}

var ADX = {};

var WilderSmoothing = {};

var hasRequiredWilderSmoothing;

function requireWilderSmoothing () {
	if (hasRequiredWilderSmoothing) return WilderSmoothing;
	hasRequiredWilderSmoothing = 1;

	Object.defineProperty(WilderSmoothing, "__esModule", {
	  value: true
	});
	WilderSmoothing.WilderSmoothing = void 0;
	WilderSmoothing.wildersmoothing = wildersmoothing;
	var _indicator = requireIndicator();
	var _LinkedList = requireLinkedList();
	//STEP3. Add class based syntax with export
	let WilderSmoothing$1 = class WilderSmoothing extends _indicator.Indicator {
	  period;
	  price;
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    this.period = input.period;
	    this.price = input.values;
	    var genFn = function* (period) {
	      new _LinkedList.LinkedList();
	      var sum = 0;
	      var counter = 1;
	      var current = yield;
	      var result = 0;
	      while (true) {
	        if (counter < period) {
	          counter++;
	          sum = sum + current;
	          result = undefined;
	        } else if (counter == period) {
	          counter++;
	          sum = sum + current;
	          result = sum;
	        } else {
	          result = result - result / period + current;
	        }
	        current = yield result;
	      }
	    };
	    this.generator = genFn(this.period);
	    this.generator.next();
	    this.result = [];
	    this.price.forEach(tick => {
	      var result = this.generator.next(tick);
	      if (result.value != undefined) {
	        this.result.push(this.format(result.value));
	      }
	    });
	  }
	  static calculate = wildersmoothing;
	  nextValue(price) {
	    var result = this.generator.next(price).value;
	    if (result != undefined) return this.format(result);
	  }
	};
	WilderSmoothing.WilderSmoothing = WilderSmoothing$1;
	function wildersmoothing(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new WilderSmoothing$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}

	//STEP 6. Run the tests
	
	return WilderSmoothing;
}

var MinusDM = {};

var hasRequiredMinusDM;

function requireMinusDM () {
	if (hasRequiredMinusDM) return MinusDM;
	hasRequiredMinusDM = 1;

	Object.defineProperty(MinusDM, "__esModule", {
	  value: true
	});
	MinusDM.MDMInput = MinusDM.MDM = void 0;
	var _indicator = requireIndicator();
	class MDMInput extends _indicator.IndicatorInput {
	  low;
	  high;
	}
	MinusDM.MDMInput = MDMInput;
	class MDM extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    var lows = input.low;
	    var highs = input.high;
	    var format = this.format;
	    if (lows.length != highs.length) {
	      throw 'Inputs(low,high) not of equal size';
	    }
	    this.result = [];
	    this.generator = function* () {
	      var minusDm;
	      var current = yield;
	      var last;
	      while (true) {
	        if (last) {
	          let upMove = current.high - last.high;
	          let downMove = last.low - current.low;
	          minusDm = format(downMove > upMove && downMove > 0 ? downMove : 0);
	        }
	        last = current;
	        current = yield minusDm;
	      }
	    }();
	    this.generator.next();
	    lows.forEach((tick, index) => {
	      var result = this.generator.next({
	        high: highs[index],
	        low: lows[index]
	      });
	      if (result.value !== undefined) this.result.push(result.value);
	    });
	  }
	  static calculate(input) {
	    _indicator.Indicator.reverseInputs(input);
	    var result = new MDM(input).result;
	    if (input.reversedInput) {
	      result.reverse();
	    }
	    _indicator.Indicator.reverseInputs(input);
	    return result;
	  }
	  nextValue(price) {
	    return this.generator.next(price).value;
	  }
	}
	MinusDM.MDM = MDM;
	
	return MinusDM;
}

var PlusDM = {};

var hasRequiredPlusDM;

function requirePlusDM () {
	if (hasRequiredPlusDM) return PlusDM;
	hasRequiredPlusDM = 1;

	Object.defineProperty(PlusDM, "__esModule", {
	  value: true
	});
	PlusDM.PDMInput = PlusDM.PDM = void 0;
	var _indicator = requireIndicator();
	/**
	 * Created by AAravindan on 5/8/16.
	 */
	class PDMInput extends _indicator.IndicatorInput {
	  low;
	  high;
	}
	PlusDM.PDMInput = PDMInput;
	class PDM extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    var lows = input.low;
	    var highs = input.high;
	    var format = this.format;
	    if (lows.length != highs.length) {
	      throw 'Inputs(low,high) not of equal size';
	    }
	    this.result = [];
	    this.generator = function* () {
	      var plusDm;
	      var current = yield;
	      var last;
	      while (true) {
	        if (last) {
	          let upMove = current.high - last.high;
	          let downMove = last.low - current.low;
	          plusDm = format(upMove > downMove && upMove > 0 ? upMove : 0);
	        }
	        last = current;
	        current = yield plusDm;
	      }
	    }();
	    this.generator.next();
	    lows.forEach((tick, index) => {
	      var result = this.generator.next({
	        high: highs[index],
	        low: lows[index]
	      });
	      if (result.value !== undefined) this.result.push(result.value);
	    });
	  }
	  static calculate(input) {
	    _indicator.Indicator.reverseInputs(input);
	    var result = new PDM(input).result;
	    if (input.reversedInput) {
	      result.reverse();
	    }
	    _indicator.Indicator.reverseInputs(input);
	    return result;
	  }
	  nextValue(price) {
	    return this.generator.next(price).value;
	  }
	}
	PlusDM.PDM = PDM;
	
	return PlusDM;
}

var TrueRange = {};

var hasRequiredTrueRange;

function requireTrueRange () {
	if (hasRequiredTrueRange) return TrueRange;
	hasRequiredTrueRange = 1;

	Object.defineProperty(TrueRange, "__esModule", {
	  value: true
	});
	TrueRange.TrueRangeInput = TrueRange.TrueRange = void 0;
	TrueRange.truerange = truerange;
	var _indicator = requireIndicator();
	class TrueRangeInput extends _indicator.IndicatorInput {
	  low;
	  high;
	  close;
	}
	TrueRange.TrueRangeInput = TrueRangeInput;
	let TrueRange$1 = class TrueRange extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    var lows = input.low;
	    var highs = input.high;
	    var closes = input.close;
	    var format = this.format;
	    if (lows.length != highs.length) {
	      throw 'Inputs(low,high) not of equal size';
	    }
	    this.result = [];
	    this.generator = function* () {
	      var current = yield;
	      var previousClose, result;
	      while (true) {
	        if (previousClose === undefined) {
	          previousClose = current.close;
	          current = yield result;
	        }
	        result = Math.max(current.high - current.low, isNaN(Math.abs(current.high - previousClose)) ? 0 : Math.abs(current.high - previousClose), isNaN(Math.abs(current.low - previousClose)) ? 0 : Math.abs(current.low - previousClose));
	        previousClose = current.close;
	        if (result != undefined) {
	          result = format(result);
	        }
	        current = yield result;
	      }
	    }();
	    this.generator.next();
	    lows.forEach((tick, index) => {
	      var result = this.generator.next({
	        high: highs[index],
	        low: lows[index],
	        close: closes[index]
	      });
	      if (result.value != undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = truerange;
	  nextValue(price) {
	    return this.generator.next(price).value;
	  }
	};
	TrueRange.TrueRange = TrueRange$1;
	function truerange(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new TrueRange$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return TrueRange;
}

var hasRequiredADX;

function requireADX () {
	if (hasRequiredADX) return ADX;
	hasRequiredADX = 1;

	Object.defineProperty(ADX, "__esModule", {
	  value: true
	});
	ADX.ADXOutput = ADX.ADXInput = ADX.ADX = void 0;
	ADX.adx = adx;
	var _WilderSmoothing = requireWilderSmoothing();
	var _indicator = requireIndicator();
	var _MinusDM = requireMinusDM();
	var _PlusDM = requirePlusDM();
	var _TrueRange = requireTrueRange();
	var _WEMA = requireWEMA();
	class ADXInput extends _indicator.IndicatorInput {
	  high;
	  low;
	  close;
	  period;
	}
	ADX.ADXInput = ADXInput;
	class ADXOutput extends _indicator.IndicatorInput {
	  adx;
	  pdi;
	  mdi;
	}
	ADX.ADXOutput = ADXOutput;
	let ADX$1 = class ADX extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    var lows = input.low;
	    var highs = input.high;
	    var closes = input.close;
	    var period = input.period;
	    var format = this.format;
	    var plusDM = new _PlusDM.PDM({
	      high: [],
	      low: []
	    });
	    var minusDM = new _MinusDM.MDM({
	      high: [],
	      low: []
	    });
	    var emaPDM = new _WilderSmoothing.WilderSmoothing({
	      period: period,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    var emaMDM = new _WilderSmoothing.WilderSmoothing({
	      period: period,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    var emaTR = new _WilderSmoothing.WilderSmoothing({
	      period: period,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    var emaDX = new _WEMA.WEMA({
	      period: period,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    var tr = new _TrueRange.TrueRange({
	      low: [],
	      high: [],
	      close: []
	    });
	    if (!(lows.length === highs.length && highs.length === closes.length)) {
	      throw 'Inputs(low,high, close) not of equal size';
	    }
	    this.result = [];
	    this.generator = function* () {
	      var tick = yield;
	      var lastPDI, lastMDI, lastDX, smoothedDX;
	      while (true) {
	        let calcTr = tr.nextValue(tick);
	        let calcPDM = plusDM.nextValue(tick);
	        let calcMDM = minusDM.nextValue(tick);
	        if (calcTr === undefined) {
	          tick = yield;
	          continue;
	        }
	        let lastATR = emaTR.nextValue(calcTr);
	        let lastAPDM = emaPDM.nextValue(calcPDM);
	        let lastAMDM = emaMDM.nextValue(calcMDM);
	        if (lastATR != undefined && lastAPDM != undefined && lastAMDM != undefined) {
	          lastPDI = lastAPDM * 100 / lastATR;
	          lastMDI = lastAMDM * 100 / lastATR;
	          let diDiff = Math.abs(lastPDI - lastMDI);
	          let diSum = lastPDI + lastMDI;
	          lastDX = diDiff / diSum * 100;
	          smoothedDX = emaDX.nextValue(lastDX);
	          // console.log(tick.high.toFixed(2), tick.low.toFixed(2), tick.close.toFixed(2) , calcTr.toFixed(2), calcPDM.toFixed(2), calcMDM.toFixed(2), lastATR.toFixed(2), lastAPDM.toFixed(2), lastAMDM.toFixed(2), lastPDI.toFixed(2), lastMDI.toFixed(2), diDiff.toFixed(2), diSum.toFixed(2), lastDX.toFixed(2));
	        }
	        tick = yield {
	          adx: smoothedDX,
	          pdi: lastPDI,
	          mdi: lastMDI
	        };
	      }
	    }();
	    this.generator.next();
	    lows.forEach((tick, index) => {
	      var result = this.generator.next({
	        high: highs[index],
	        low: lows[index],
	        close: closes[index]
	      });
	      if (result.value != undefined && result.value.adx != undefined) {
	        this.result.push({
	          adx: format(result.value.adx),
	          pdi: format(result.value.pdi),
	          mdi: format(result.value.mdi)
	        });
	      }
	    });
	  }
	  static calculate = adx;
	  nextValue(price) {
	    let result = this.generator.next(price).value;
	    if (result != undefined && result.adx != undefined) {
	      return {
	        adx: this.format(result.adx),
	        pdi: this.format(result.pdi),
	        mdi: this.format(result.mdi)
	      };
	    }
	  }
	};
	ADX.ADX = ADX$1;
	function adx(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new ADX$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return ADX;
}

var ATR = {};

var hasRequiredATR;

function requireATR () {
	if (hasRequiredATR) return ATR;
	hasRequiredATR = 1;

	Object.defineProperty(ATR, "__esModule", {
	  value: true
	});
	ATR.ATRInput = ATR.ATR = void 0;
	ATR.atr = atr;
	var _indicator = requireIndicator();
	var _WEMA = requireWEMA();
	var _TrueRange = requireTrueRange();
	class ATRInput extends _indicator.IndicatorInput {
	  low;
	  high;
	  close;
	  period;
	}
	ATR.ATRInput = ATRInput;
	let ATR$1 = class ATR extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    var lows = input.low;
	    var highs = input.high;
	    var closes = input.close;
	    var period = input.period;
	    var format = this.format;
	    if (!(lows.length === highs.length && highs.length === closes.length)) {
	      throw 'Inputs(low,high, close) not of equal size';
	    }
	    var trueRange = new _TrueRange.TrueRange({
	      low: [],
	      high: [],
	      close: []
	    });
	    var wema = new _WEMA.WEMA({
	      period: period,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    this.result = [];
	    this.generator = function* () {
	      var tick = yield;
	      var avgTrueRange, trange;
	      while (true) {
	        trange = trueRange.nextValue({
	          low: tick.low,
	          high: tick.high,
	          close: tick.close
	        });
	        if (trange === undefined) {
	          avgTrueRange = undefined;
	        } else {
	          avgTrueRange = wema.nextValue(trange);
	        }
	        tick = yield avgTrueRange;
	      }
	    }();
	    this.generator.next();
	    lows.forEach((tick, index) => {
	      var result = this.generator.next({
	        high: highs[index],
	        low: lows[index],
	        close: closes[index]
	      });
	      if (result.value !== undefined) {
	        this.result.push(format(result.value));
	      }
	    });
	  }
	  static calculate = atr;
	  nextValue(price) {
	    return this.generator.next(price).value;
	  }
	};
	ATR.ATR = ATR$1;
	function atr(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new ATR$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return ATR;
}

var ROC = {};

var hasRequiredROC;

function requireROC () {
	if (hasRequiredROC) return ROC;
	hasRequiredROC = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(ROC, "__esModule", {
	  value: true
	});
	ROC.ROCInput = ROC.ROC = void 0;
	ROC.roc = roc;
	var _indicator = requireIndicator();
	var _FixedSizeLinkedList = _interopRequireDefault(requireFixedSizeLinkedList());
	class ROCInput extends _indicator.IndicatorInput {
	  period;
	  values;
	}
	ROC.ROCInput = ROCInput;
	let ROC$1 = class ROC extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    var period = input.period;
	    var priceArray = input.values;
	    this.result = [];
	    this.generator = function* () {
	      let index = 1;
	      var pastPeriods = new _FixedSizeLinkedList.default(period);
	      var tick = yield;
	      var roc;
	      while (true) {
	        pastPeriods.push(tick);
	        if (index < period) {
	          index++;
	        } else {
	          roc = (tick - pastPeriods.lastShift) / pastPeriods.lastShift * 100;
	        }
	        tick = yield roc;
	      }
	    }();
	    this.generator.next();
	    priceArray.forEach(tick => {
	      var result = this.generator.next(tick);
	      if (result.value != undefined && !isNaN(result.value)) {
	        this.result.push(this.format(result.value));
	      }
	    });
	  }
	  static calculate = roc;
	  nextValue(price) {
	    var nextResult = this.generator.next(price);
	    if (nextResult.value != undefined && !isNaN(nextResult.value)) {
	      return this.format(nextResult.value);
	    }
	  }
	};
	ROC.ROC = ROC$1;
	function roc(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new ROC$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return ROC;
}

var KST = {};

var hasRequiredKST;

function requireKST () {
	if (hasRequiredKST) return KST;
	hasRequiredKST = 1;

	Object.defineProperty(KST, "__esModule", {
	  value: true
	});
	KST.KSTOutput = KST.KSTInput = KST.KST = void 0;
	KST.kst = kst;
	var _indicator = requireIndicator();
	var _SMA = requireSMA();
	var _ROC = requireROC();
	class KSTInput extends _indicator.IndicatorInput {
	  ROCPer1;
	  ROCPer2;
	  ROCPer3;
	  ROCPer4;
	  SMAROCPer1;
	  SMAROCPer2;
	  SMAROCPer3;
	  SMAROCPer4;
	  signalPeriod;
	  values;
	}
	KST.KSTInput = KSTInput;
	class KSTOutput {
	  kst;
	  signal;
	}
	KST.KSTOutput = KSTOutput;
	let KST$1 = class KST extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    let priceArray = input.values;
	    let rocPer1 = input.ROCPer1;
	    let rocPer2 = input.ROCPer2;
	    let rocPer3 = input.ROCPer3;
	    let rocPer4 = input.ROCPer4;
	    let smaPer1 = input.SMAROCPer1;
	    let smaPer2 = input.SMAROCPer2;
	    let smaPer3 = input.SMAROCPer3;
	    let smaPer4 = input.SMAROCPer4;
	    let signalPeriod = input.signalPeriod;
	    let roc1 = new _ROC.ROC({
	      period: rocPer1,
	      values: []
	    });
	    let roc2 = new _ROC.ROC({
	      period: rocPer2,
	      values: []
	    });
	    let roc3 = new _ROC.ROC({
	      period: rocPer3,
	      values: []
	    });
	    let roc4 = new _ROC.ROC({
	      period: rocPer4,
	      values: []
	    });
	    let sma1 = new _SMA.SMA({
	      period: smaPer1,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    let sma2 = new _SMA.SMA({
	      period: smaPer2,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    let sma3 = new _SMA.SMA({
	      period: smaPer3,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    let sma4 = new _SMA.SMA({
	      period: smaPer4,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    let signalSMA = new _SMA.SMA({
	      period: signalPeriod,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    var format = this.format;
	    this.result = [];
	    let firstResult = Math.max(rocPer1 + smaPer1, rocPer2 + smaPer2, rocPer3 + smaPer3, rocPer4 + smaPer4);
	    this.generator = function* () {
	      let index = 1;
	      let tick = yield;
	      let kst;
	      let RCMA1, RCMA2, RCMA3, RCMA4, signal, result;
	      while (true) {
	        let roc1Result = roc1.nextValue(tick);
	        let roc2Result = roc2.nextValue(tick);
	        let roc3Result = roc3.nextValue(tick);
	        let roc4Result = roc4.nextValue(tick);
	        RCMA1 = roc1Result !== undefined ? sma1.nextValue(roc1Result) : undefined;
	        RCMA2 = roc2Result !== undefined ? sma2.nextValue(roc2Result) : undefined;
	        RCMA3 = roc3Result !== undefined ? sma3.nextValue(roc3Result) : undefined;
	        RCMA4 = roc4Result !== undefined ? sma4.nextValue(roc4Result) : undefined;
	        if (index < firstResult) {
	          index++;
	        } else {
	          kst = RCMA1 * 1 + RCMA2 * 2 + RCMA3 * 3 + RCMA4 * 4;
	        }
	        signal = kst !== undefined ? signalSMA.nextValue(kst) : undefined;
	        result = kst !== undefined ? {
	          kst: format(kst),
	          signal: signal ? format(signal) : undefined
	        } : undefined;
	        tick = yield result;
	      }
	    }();
	    this.generator.next();
	    priceArray.forEach(tick => {
	      let result = this.generator.next(tick);
	      if (result.value != undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = kst;
	  nextValue(price) {
	    let nextResult = this.generator.next(price);
	    if (nextResult.value != undefined) return nextResult.value;
	  }
	};
	KST.KST = KST$1;
	function kst(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new KST$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return KST;
}

var PSAR = {};

var hasRequiredPSAR;

function requirePSAR () {
	if (hasRequiredPSAR) return PSAR;
	hasRequiredPSAR = 1;

	Object.defineProperty(PSAR, "__esModule", {
	  value: true
	});
	PSAR.PSARInput = PSAR.PSAR = void 0;
	PSAR.psar = psar;
	var _indicator = requireIndicator();

	/*
	  There seems to be a few interpretations of the rules for this regarding which prices.
	  I mean the english from which periods are included. The wording does seem to
	  introduce some discrepancy so maybe that is why. I want to put the author's
	  own description here to reassess this later.
	  ----------------------------------------------------------------------------------------
	  For the first day of entry the SAR is the previous Significant Point

	  If long the SP is the lowest price reached while in the previous short trade
	  If short the SP is the highest price reached while in the previous long trade

	  If long:
	  Find the difference between the highest price made while in the trade and the SAR for today.
	  Multiple the difference by the AF and ADD the result to today's SAR to obtain the SAR for tomorrow.
	  Use 0.02 for the first AF and increase it by 0.02 on every day that a new high for the trade is made.
	  If a new high is not made continue to use the AF as last increased. Do not increase the AF above .20

	  Never move the SAR for tomorrow ABOVE the previous day's LOW or today's LOW.
	  If the SAR is calculated to be ABOVE the previous day's LOW or today's LOW then use the lower low between today and the previous day as the new SAR.
	  Make the next day's calculations based on this SAR.

	  If short:
	  Find the difference between the lowest price made while in the trade and the SAR for today.
	  Multiple the difference by the AF and SUBTRACT the result to today's SAR to obtain the SAR for tomorrow.
	  Use 0.02 for the first AF and increase it by 0.02 on every day that a new high for the trade is made.
	  If a new high is not made continue to use the AF as last increased. Do not increase the AF above .20

	  Never move the SAR for tomorrow BELOW the previous day's HIGH or today's HIGH.
	  If the SAR is calculated to be BELOW the previous day's HIGH or today's HIGH then use the higher high between today and the previous day as the new SAR. Make the next day's calculations based on this SAR.
	  ----------------------------------------------------------------------------------------
	*/
	class PSARInput extends _indicator.IndicatorInput {
	  step;
	  max;
	  high;
	  low;
	}
	PSAR.PSARInput = PSARInput;
	let PSAR$1 = class PSAR extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    let highs = input.high || [];
	    let lows = input.low || [];
	    var genFn = function* (step, max) {
	      let curr, extreme, sar, furthest;
	      let up = true;
	      let accel = step;
	      let prev = yield;
	      while (true) {
	        if (curr) {
	          sar = sar + accel * (extreme - sar);
	          if (up) {
	            sar = Math.min(sar, furthest.low, prev.low);
	            if (curr.high > extreme) {
	              extreme = curr.high;
	              accel = Math.min(accel + step, max);
	            }
	          } else {
	            sar = Math.max(sar, furthest.high, prev.high);
	            if (curr.low < extreme) {
	              extreme = curr.low;
	              accel = Math.min(accel + step, max);
	            }
	          }
	          if (up && curr.low < sar || !up && curr.high > sar) {
	            accel = step;
	            sar = extreme;
	            up = !up;
	            extreme = !up ? curr.low : curr.high;
	          }
	        } else {
	          // Randomly setup start values? What is the trend on first tick??
	          sar = prev.low;
	          extreme = prev.high;
	        }
	        furthest = prev;
	        if (curr) prev = curr;
	        curr = yield sar;
	      }
	    };
	    this.result = [];
	    this.generator = genFn(input.step, input.max);
	    this.generator.next();
	    lows.forEach((tick, index) => {
	      var result = this.generator.next({
	        high: highs[index],
	        low: lows[index]
	      });
	      if (result.value !== undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = psar;
	  nextValue(input) {
	    let nextResult = this.generator.next(input);
	    if (nextResult.value !== undefined) return nextResult.value;
	  }
	};
	PSAR.PSAR = PSAR$1;
	function psar(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new PSAR$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return PSAR;
}

var Stochastic = {};

var hasRequiredStochastic;

function requireStochastic () {
	if (hasRequiredStochastic) return Stochastic;
	hasRequiredStochastic = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(Stochastic, "__esModule", {
	  value: true
	});
	Stochastic.StochasticOutput = Stochastic.StochasticInput = Stochastic.Stochastic = void 0;
	Stochastic.stochastic = stochastic;
	var _indicator = requireIndicator();
	var _FixedSizeLinkedList = _interopRequireDefault(requireFixedSizeLinkedList());
	var _SMA = requireSMA();
	class StochasticInput extends _indicator.IndicatorInput {
	  period;
	  low;
	  high;
	  close;
	  signalPeriod;
	}
	Stochastic.StochasticInput = StochasticInput;
	class StochasticOutput {
	  k;
	  d;
	}
	Stochastic.StochasticOutput = StochasticOutput;
	let Stochastic$1 = class Stochastic extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    let lows = input.low;
	    let highs = input.high;
	    let closes = input.close;
	    let period = input.period;
	    let signalPeriod = input.signalPeriod;
	    let format = this.format;
	    if (!(lows.length === highs.length && highs.length === closes.length)) {
	      throw 'Inputs(low,high, close) not of equal size';
	    }
	    this.result = [];
	    //%K = (Current Close - Lowest Low)/(Highest High - Lowest Low) * 100
	    //%D = 3-day SMA of %K
	    //
	    //Lowest Low = lowest low for the look-back period
	    //Highest High = highest high for the look-back period
	    //%K is multiplied by 100 to move the decimal point two places
	    this.generator = function* () {
	      let index = 1;
	      let pastHighPeriods = new _FixedSizeLinkedList.default(period, true, false);
	      let pastLowPeriods = new _FixedSizeLinkedList.default(period, false, true);
	      let dSma = new _SMA.SMA({
	        period: signalPeriod,
	        values: [],
	        format: v => {
	          return v;
	        }
	      });
	      let k, d;
	      var tick = yield;
	      while (true) {
	        pastHighPeriods.push(tick.high);
	        pastLowPeriods.push(tick.low);
	        if (index < period) {
	          index++;
	          tick = yield;
	          continue;
	        }
	        let periodLow = pastLowPeriods.periodLow;
	        k = (tick.close - periodLow) / (pastHighPeriods.periodHigh - periodLow) * 100;
	        k = isNaN(k) ? 0 : k; //This happens when the close, high and low are same for the entire period; Bug fix for 
	        d = dSma.nextValue(k);
	        tick = yield {
	          k: format(k),
	          d: d !== undefined ? format(d) : undefined
	        };
	      }
	    }();
	    this.generator.next();
	    lows.forEach((tick, index) => {
	      var result = this.generator.next({
	        high: highs[index],
	        low: lows[index],
	        close: closes[index]
	      });
	      if (result.value !== undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = stochastic;
	  nextValue(input) {
	    let nextResult = this.generator.next(input);
	    if (nextResult.value !== undefined) return nextResult.value;
	  }
	};
	Stochastic.Stochastic = Stochastic$1;
	function stochastic(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new Stochastic$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return Stochastic;
}

var WilliamsR = {};

var hasRequiredWilliamsR;

function requireWilliamsR () {
	if (hasRequiredWilliamsR) return WilliamsR;
	hasRequiredWilliamsR = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(WilliamsR, "__esModule", {
	  value: true
	});
	WilliamsR.WilliamsRInput = WilliamsR.WilliamsR = void 0;
	WilliamsR.williamsr = williamsr;
	var _indicator = requireIndicator();
	var _FixedSizeLinkedList = _interopRequireDefault(requireFixedSizeLinkedList());
	class WilliamsRInput extends _indicator.IndicatorInput {
	  low;
	  high;
	  close;
	  period;
	}
	WilliamsR.WilliamsRInput = WilliamsRInput;
	let WilliamsR$1 = class WilliamsR extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    let lows = input.low;
	    let highs = input.high;
	    let closes = input.close;
	    let period = input.period;
	    let format = this.format;
	    if (!(lows.length === highs.length && highs.length === closes.length)) {
	      throw 'Inputs(low,high, close) not of equal size';
	    }
	    this.result = [];

	    //%R = (Highest High - Close)/(Highest High - Lowest Low) * -100
	    //Lowest Low = lowest low for the look-back period
	    //Highest High = highest high for the look-back period
	    //%R is multiplied by -100 correct the inversion and move the decimal.
	    this.generator = function* () {
	      let index = 1;
	      let pastHighPeriods = new _FixedSizeLinkedList.default(period, true, false);
	      let pastLowPeriods = new _FixedSizeLinkedList.default(period, false, true);
	      let periodLow;
	      let periodHigh;
	      var tick = yield;
	      let williamsR;
	      while (true) {
	        pastHighPeriods.push(tick.high);
	        pastLowPeriods.push(tick.low);
	        if (index < period) {
	          index++;
	          tick = yield;
	          continue;
	        }
	        periodLow = pastLowPeriods.periodLow;
	        periodHigh = pastHighPeriods.periodHigh;
	        williamsR = format((periodHigh - tick.close) / (periodHigh - periodLow) * -100);
	        tick = yield williamsR;
	      }
	    }();
	    this.generator.next();
	    lows.forEach((low, index) => {
	      var result = this.generator.next({
	        high: highs[index],
	        low: lows[index],
	        close: closes[index]
	      });
	      if (result.value !== undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = williamsr;
	  nextValue(price) {
	    var nextResult = this.generator.next(price);
	    if (nextResult.value != undefined) return this.format(nextResult.value);
	  }
	};
	WilliamsR.WilliamsR = WilliamsR$1;
	function williamsr(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new WilliamsR$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return WilliamsR;
}

var ADL = {};

var hasRequiredADL;

function requireADL () {
	if (hasRequiredADL) return ADL;
	hasRequiredADL = 1;

	Object.defineProperty(ADL, "__esModule", {
	  value: true
	});
	ADL.ADLInput = ADL.ADL = void 0;
	ADL.adl = adl;
	var _indicator = requireIndicator();
	/**
	 * Created by AAravindan on 5/17/16.
	 */

	class ADLInput extends _indicator.IndicatorInput {
	  high;
	  low;
	  close;
	  volume;
	}
	ADL.ADLInput = ADLInput;
	let ADL$1 = class ADL extends _indicator.Indicator {
	  generator;
	  constructor(input) {
	    super(input);
	    var highs = input.high;
	    var lows = input.low;
	    var closes = input.close;
	    var volumes = input.volume;
	    if (!(lows.length === highs.length && highs.length === closes.length && highs.length === volumes.length)) {
	      throw 'Inputs(low,high, close, volumes) not of equal size';
	    }
	    this.result = [];
	    this.generator = function* () {
	      var result = 0;
	      var tick;
	      tick = yield;
	      while (true) {
	        let moneyFlowMultiplier = (tick.close - tick.low - (tick.high - tick.close)) / (tick.high - tick.low);
	        moneyFlowMultiplier = isNaN(moneyFlowMultiplier) ? 1 : moneyFlowMultiplier;
	        let moneyFlowVolume = moneyFlowMultiplier * tick.volume;
	        result = result + moneyFlowVolume;
	        tick = yield Math.round(result);
	      }
	    }();
	    this.generator.next();
	    highs.forEach((tickHigh, index) => {
	      var tickInput = {
	        high: tickHigh,
	        low: lows[index],
	        close: closes[index],
	        volume: volumes[index]
	      };
	      var result = this.generator.next(tickInput);
	      if (result.value != undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = adl;
	  nextValue(price) {
	    return this.generator.next(price).value;
	  }
	};
	ADL.ADL = ADL$1;
	function adl(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new ADL$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return ADL;
}

var OBV = {};

var hasRequiredOBV;

function requireOBV () {
	if (hasRequiredOBV) return OBV;
	hasRequiredOBV = 1;

	Object.defineProperty(OBV, "__esModule", {
	  value: true
	});
	OBV.OBVInput = OBV.OBV = void 0;
	OBV.obv = obv;
	var _indicator = requireIndicator();
	class OBVInput extends _indicator.IndicatorInput {
	  close;
	  volume;
	}
	OBV.OBVInput = OBVInput;
	let OBV$1 = class OBV extends _indicator.Indicator {
	  generator;
	  constructor(input) {
	    super(input);
	    var closes = input.close;
	    var volumes = input.volume;
	    this.result = [];
	    this.generator = function* () {
	      var result = 0;
	      var tick;
	      var lastClose;
	      tick = yield;
	      if (tick.close && typeof tick.close === 'number') {
	        lastClose = tick.close;
	        tick = yield;
	      }
	      while (true) {
	        if (lastClose < tick.close) {
	          result = result + tick.volume;
	        } else if (tick.close < lastClose) {
	          result = result - tick.volume;
	        }
	        lastClose = tick.close;
	        tick = yield result;
	      }
	    }();
	    this.generator.next();
	    closes.forEach((close, index) => {
	      let tickInput = {
	        close: closes[index],
	        volume: volumes[index]
	      };
	      let result = this.generator.next(tickInput);
	      if (result.value != undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = obv;
	  nextValue(price) {
	    return this.generator.next(price).value;
	  }
	};
	OBV.OBV = OBV$1;
	function obv(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new OBV$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return OBV;
}

var TRIX = {};

/**
 * Created by AAravindan on 5/9/16.
 */

var hasRequiredTRIX;

function requireTRIX () {
	if (hasRequiredTRIX) return TRIX;
	hasRequiredTRIX = 1;

	Object.defineProperty(TRIX, "__esModule", {
	  value: true
	});
	TRIX.TRIXInput = TRIX.TRIX = void 0;
	TRIX.trix = trix;
	var _ROC = requireROC();
	var _EMA = requireEMA();
	var _indicator = requireIndicator();
	class TRIXInput extends _indicator.IndicatorInput {
	  values;
	  period;
	}
	TRIX.TRIXInput = TRIXInput;
	let TRIX$1 = class TRIX extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    let priceArray = input.values;
	    let period = input.period;
	    let format = this.format;
	    let ema = new _EMA.EMA({
	      period: period,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    let emaOfema = new _EMA.EMA({
	      period: period,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    let emaOfemaOfema = new _EMA.EMA({
	      period: period,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    let trixROC = new _ROC.ROC({
	      period: 1,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    this.result = [];
	    this.generator = function* () {
	      let tick = yield;
	      while (true) {
	        let initialema = ema.nextValue(tick);
	        let smoothedResult = initialema ? emaOfema.nextValue(initialema) : undefined;
	        let doubleSmoothedResult = smoothedResult ? emaOfemaOfema.nextValue(smoothedResult) : undefined;
	        let result = doubleSmoothedResult ? trixROC.nextValue(doubleSmoothedResult) : undefined;
	        tick = yield result ? format(result) : undefined;
	      }
	    }();
	    this.generator.next();
	    priceArray.forEach(tick => {
	      let result = this.generator.next(tick);
	      if (result.value !== undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = trix;
	  nextValue(price) {
	    let nextResult = this.generator.next(price);
	    if (nextResult.value !== undefined) return nextResult.value;
	  }
	};
	TRIX.TRIX = TRIX$1;
	function trix(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new TRIX$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return TRIX;
}

var ForceIndex = {};

var hasRequiredForceIndex;

function requireForceIndex () {
	if (hasRequiredForceIndex) return ForceIndex;
	hasRequiredForceIndex = 1;

	Object.defineProperty(ForceIndex, "__esModule", {
	  value: true
	});
	ForceIndex.ForceIndexInput = ForceIndex.ForceIndex = void 0;
	ForceIndex.forceindex = forceindex;
	var _EMA = requireEMA();
	var _indicator = requireIndicator();
	class ForceIndexInput extends _indicator.IndicatorInput {
	  close;
	  volume;
	  period = 1;
	}
	ForceIndex.ForceIndexInput = ForceIndexInput;
	let ForceIndex$1 = class ForceIndex extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    var closes = input.close;
	    var volumes = input.volume;
	    var period = input.period || 1;
	    if (!(volumes.length === closes.length)) {
	      throw 'Inputs(volume, close) not of equal size';
	    }
	    let emaForceIndex = new _EMA.EMA({
	      values: [],
	      period: period
	    });
	    this.result = [];
	    this.generator = function* () {
	      var previousTick = yield;
	      var tick = yield;
	      let forceIndex;
	      while (true) {
	        forceIndex = (tick.close - previousTick.close) * tick.volume;
	        previousTick = tick;
	        tick = yield emaForceIndex.nextValue(forceIndex);
	      }
	    }();
	    this.generator.next();
	    volumes.forEach((tick, index) => {
	      var result = this.generator.next({
	        close: closes[index],
	        volume: volumes[index]
	      });
	      if (result.value != undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = forceindex;
	  nextValue(price) {
	    let result = this.generator.next(price).value;
	    if (result != undefined) {
	      return result;
	    }
	  }
	};
	ForceIndex.ForceIndex = ForceIndex$1;
	function forceindex(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new ForceIndex$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return ForceIndex;
}

var CCI = {};

var hasRequiredCCI;

function requireCCI () {
	if (hasRequiredCCI) return CCI;
	hasRequiredCCI = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(CCI, "__esModule", {
	  value: true
	});
	CCI.CCIInput = CCI.CCI = void 0;
	CCI.cci = cci;
	var _indicator = requireIndicator();
	var _SMA = requireSMA();
	var _FixedSizeLinkedList = _interopRequireDefault(requireFixedSizeLinkedList());
	class CCIInput extends _indicator.IndicatorInput {
	  high;
	  low;
	  close;
	  period;
	}
	CCI.CCIInput = CCIInput;
	let CCI$1 = class CCI extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    var lows = input.low;
	    var highs = input.high;
	    var closes = input.close;
	    var period = input.period;
	    this.format;
	    let constant = .015;
	    var currentTpSet = new _FixedSizeLinkedList.default(period);
	    var tpSMACalculator = new _SMA.SMA({
	      period: period,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    if (!(lows.length === highs.length && highs.length === closes.length)) {
	      throw 'Inputs(low,high, close) not of equal size';
	    }
	    this.result = [];
	    this.generator = function* () {
	      var tick = yield;
	      while (true) {
	        let tp = (tick.high + tick.low + tick.close) / 3;
	        currentTpSet.push(tp);
	        let smaTp = tpSMACalculator.nextValue(tp);
	        let meanDeviation = null;
	        let cci;
	        let sum = 0;
	        if (smaTp != undefined) {
	          //First, subtract the most recent 20-period average of the typical price from each period's typical price. 
	          //Second, take the absolute values of these numbers.
	          //Third,sum the absolute values. 
	          for (let x of currentTpSet.iterator()) {
	            sum = sum + Math.abs(x - smaTp);
	          }
	          //Fourth, divide by the total number of periods (20). 
	          meanDeviation = sum / period;
	          cci = (tp - smaTp) / (constant * meanDeviation);
	        }
	        tick = yield cci;
	      }
	    }();
	    this.generator.next();
	    lows.forEach((tick, index) => {
	      var result = this.generator.next({
	        high: highs[index],
	        low: lows[index],
	        close: closes[index]
	      });
	      if (result.value != undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = cci;
	  nextValue(price) {
	    let result = this.generator.next(price).value;
	    if (result != undefined) {
	      return result;
	    }
	  }
	};
	CCI.CCI = CCI$1;
	function cci(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new CCI$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return CCI;
}

var AwesomeOscillator = {};

var hasRequiredAwesomeOscillator;

function requireAwesomeOscillator () {
	if (hasRequiredAwesomeOscillator) return AwesomeOscillator;
	hasRequiredAwesomeOscillator = 1;

	Object.defineProperty(AwesomeOscillator, "__esModule", {
	  value: true
	});
	AwesomeOscillator.AwesomeOscillatorInput = AwesomeOscillator.AwesomeOscillator = void 0;
	AwesomeOscillator.awesomeoscillator = awesomeoscillator;
	var _indicator = requireIndicator();
	var _SMA = requireSMA();
	class AwesomeOscillatorInput extends _indicator.IndicatorInput {
	  high;
	  low;
	  fastPeriod;
	  slowPeriod;
	}
	AwesomeOscillator.AwesomeOscillatorInput = AwesomeOscillatorInput;
	let AwesomeOscillator$1 = class AwesomeOscillator extends _indicator.Indicator {
	  generator;
	  constructor(input) {
	    super(input);
	    var highs = input.high;
	    var lows = input.low;
	    var fastPeriod = input.fastPeriod;
	    var slowPeriod = input.slowPeriod;
	    var slowSMA = new _SMA.SMA({
	      values: [],
	      period: slowPeriod
	    });
	    var fastSMA = new _SMA.SMA({
	      values: [],
	      period: fastPeriod
	    });
	    this.result = [];
	    this.generator = function* () {
	      var result;
	      var tick;
	      var medianPrice;
	      var slowSmaValue;
	      var fastSmaValue;
	      tick = yield;
	      while (true) {
	        medianPrice = (tick.high + tick.low) / 2;
	        slowSmaValue = slowSMA.nextValue(medianPrice);
	        fastSmaValue = fastSMA.nextValue(medianPrice);
	        if (slowSmaValue !== undefined && fastSmaValue !== undefined) {
	          result = fastSmaValue - slowSmaValue;
	        }
	        tick = yield result;
	      }
	    }();
	    this.generator.next();
	    highs.forEach((tickHigh, index) => {
	      var tickInput = {
	        high: tickHigh,
	        low: lows[index]
	      };
	      var result = this.generator.next(tickInput);
	      if (result.value != undefined) {
	        this.result.push(this.format(result.value));
	      }
	    });
	  }
	  static calculate = awesomeoscillator;
	  nextValue(price) {
	    var result = this.generator.next(price);
	    if (result.value != undefined) {
	      return this.format(result.value);
	    }
	  }
	};
	AwesomeOscillator.AwesomeOscillator = AwesomeOscillator$1;
	function awesomeoscillator(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new AwesomeOscillator$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return AwesomeOscillator;
}

var VWAP = {};

var hasRequiredVWAP;

function requireVWAP () {
	if (hasRequiredVWAP) return VWAP;
	hasRequiredVWAP = 1;

	Object.defineProperty(VWAP, "__esModule", {
	  value: true
	});
	VWAP.VWAPInput = VWAP.VWAP = void 0;
	VWAP.vwap = vwap;
	var _indicator = requireIndicator();
	class VWAPInput extends _indicator.IndicatorInput {
	  high;
	  low;
	  close;
	  volume;
	}
	VWAP.VWAPInput = VWAPInput;
	let VWAP$1 = class VWAP extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    var lows = input.low;
	    var highs = input.high;
	    var closes = input.close;
	    var volumes = input.volume;
	    this.format;
	    if (!(lows.length === highs.length && highs.length === closes.length)) {
	      throw 'Inputs(low,high, close) not of equal size';
	    }
	    this.result = [];
	    this.generator = function* () {
	      var tick = yield;
	      let cumulativeTotal = 0;
	      let cumulativeVolume = 0;
	      while (true) {
	        let typicalPrice = (tick.high + tick.low + tick.close) / 3;
	        let total = tick.volume * typicalPrice;
	        cumulativeTotal = cumulativeTotal + total;
	        cumulativeVolume = cumulativeVolume + tick.volume;
	        tick = yield cumulativeTotal / cumulativeVolume;
	      }
	    }();
	    this.generator.next();
	    lows.forEach((tick, index) => {
	      var result = this.generator.next({
	        high: highs[index],
	        low: lows[index],
	        close: closes[index],
	        volume: volumes[index]
	      });
	      if (result.value != undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = vwap;
	  nextValue(price) {
	    let result = this.generator.next(price).value;
	    if (result != undefined) {
	      return result;
	    }
	  }
	};
	VWAP.VWAP = VWAP$1;
	function vwap(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new VWAP$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return VWAP;
}

var VolumeProfile = {};

var hasRequiredVolumeProfile;

function requireVolumeProfile () {
	if (hasRequiredVolumeProfile) return VolumeProfile;
	hasRequiredVolumeProfile = 1;

	Object.defineProperty(VolumeProfile, "__esModule", {
	  value: true
	});
	VolumeProfile.VolumeProfileOutput = VolumeProfile.VolumeProfileInput = VolumeProfile.VolumeProfile = void 0;
	VolumeProfile.priceFallsBetweenBarRange = priceFallsBetweenBarRange;
	VolumeProfile.volumeprofile = volumeprofile;
	var _indicator = requireIndicator();
	class VolumeProfileInput extends _indicator.IndicatorInput {
	  high;
	  open;
	  low;
	  close;
	  volume;
	  noOfBars;
	}
	VolumeProfile.VolumeProfileInput = VolumeProfileInput;
	class VolumeProfileOutput {
	  rangeStart;
	  rangeEnd;
	  bullishVolume;
	  bearishVolume;
	}
	VolumeProfile.VolumeProfileOutput = VolumeProfileOutput;
	function priceFallsBetweenBarRange(low, high, low1, high1) {
	  return low <= low1 && high >= low1 || low1 <= low && high1 >= low;
	}
	let VolumeProfile$1 = class VolumeProfile extends _indicator.Indicator {
	  generator;
	  constructor(input) {
	    super(input);
	    var highs = input.high;
	    var lows = input.low;
	    var closes = input.close;
	    var opens = input.open;
	    var volumes = input.volume;
	    var bars = input.noOfBars;
	    if (!(lows.length === highs.length && highs.length === closes.length && highs.length === volumes.length)) {
	      throw 'Inputs(low,high, close, volumes) not of equal size';
	    }
	    this.result = [];
	    var max = Math.max(...highs, ...lows, ...closes, ...opens);
	    var min = Math.min(...highs, ...lows, ...closes, ...opens);
	    var barRange = (max - min) / bars;
	    var lastEnd = min;
	    for (let i = 0; i < bars; i++) {
	      let rangeStart = lastEnd;
	      let rangeEnd = rangeStart + barRange;
	      lastEnd = rangeEnd;
	      let bullishVolume = 0;
	      let bearishVolume = 0;
	      let totalVolume = 0;
	      for (let priceBar = 0; priceBar < highs.length; priceBar++) {
	        let priceBarStart = lows[priceBar];
	        let priceBarEnd = highs[priceBar];
	        let priceBarOpen = opens[priceBar];
	        let priceBarClose = closes[priceBar];
	        let priceBarVolume = volumes[priceBar];
	        if (priceFallsBetweenBarRange(rangeStart, rangeEnd, priceBarStart, priceBarEnd)) {
	          totalVolume = totalVolume + priceBarVolume;
	          if (priceBarOpen > priceBarClose) {
	            bearishVolume = bearishVolume + priceBarVolume;
	          } else {
	            bullishVolume = bullishVolume + priceBarVolume;
	          }
	        }
	      }
	      this.result.push({
	        rangeStart,
	        rangeEnd,
	        bullishVolume,
	        bearishVolume,
	        totalVolume
	      });
	    }
	  }
	  static calculate = volumeprofile;
	  nextValue(price) {
	    throw 'Next value not supported for volume profile';
	  }
	};
	VolumeProfile.VolumeProfile = VolumeProfile$1;
	function volumeprofile(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new VolumeProfile$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return VolumeProfile;
}

var MFI = {};

var TypicalPrice = {};

var hasRequiredTypicalPrice;

function requireTypicalPrice () {
	if (hasRequiredTypicalPrice) return TypicalPrice;
	hasRequiredTypicalPrice = 1;

	Object.defineProperty(TypicalPrice, "__esModule", {
	  value: true
	});
	TypicalPrice.TypicalPriceInput = TypicalPrice.TypicalPrice = void 0;
	TypicalPrice.typicalprice = typicalprice;
	var _indicator = requireIndicator();
	/**
	 * Created by AAravindan on 5/4/16.
	 */

	class TypicalPriceInput extends _indicator.IndicatorInput {
	  low;
	  high;
	  close;
	}
	TypicalPrice.TypicalPriceInput = TypicalPriceInput;
	let TypicalPrice$1 = class TypicalPrice extends _indicator.Indicator {
	  result = [];
	  generator;
	  constructor(input) {
	    super(input);
	    this.generator = function* () {
	      let priceInput = yield;
	      while (true) {
	        priceInput = yield (priceInput.high + priceInput.low + priceInput.close) / 3;
	      }
	    }();
	    this.generator.next();
	    input.low.forEach((tick, index) => {
	      var result = this.generator.next({
	        high: input.high[index],
	        low: input.low[index],
	        close: input.close[index]
	      });
	      this.result.push(result.value);
	    });
	  }
	  static calculate = typicalprice;
	  nextValue(price) {
	    var result = this.generator.next(price).value;
	    return result;
	  }
	};
	TypicalPrice.TypicalPrice = TypicalPrice$1;
	function typicalprice(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new TypicalPrice$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return TypicalPrice;
}

var hasRequiredMFI;

function requireMFI () {
	if (hasRequiredMFI) return MFI;
	hasRequiredMFI = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(MFI, "__esModule", {
	  value: true
	});
	MFI.MFIInput = MFI.MFI = void 0;
	MFI.mfi = mfi;
	var _indicator = requireIndicator();
	var _TypicalPrice = requireTypicalPrice();
	var _FixedSizeLinkedList = _interopRequireDefault(requireFixedSizeLinkedList());
	/**
	 * Created by AAravindan on 5/17/16.
	 */

	class MFIInput extends _indicator.IndicatorInput {
	  high;
	  low;
	  close;
	  volume;
	  period;
	}
	MFI.MFIInput = MFIInput;
	let MFI$1 = class MFI extends _indicator.Indicator {
	  generator;
	  constructor(input) {
	    super(input);
	    var highs = input.high;
	    var lows = input.low;
	    var closes = input.close;
	    var volumes = input.volume;
	    var period = input.period;
	    var typicalPrice = new _TypicalPrice.TypicalPrice({
	      low: [],
	      high: [],
	      close: []
	    });
	    var positiveFlow = new _FixedSizeLinkedList.default(period, false, false, true);
	    var negativeFlow = new _FixedSizeLinkedList.default(period, false, false, true);
	    if (!(lows.length === highs.length && highs.length === closes.length && highs.length === volumes.length)) {
	      throw 'Inputs(low,high, close, volumes) not of equal size';
	    }
	    this.result = [];
	    this.generator = function* () {
	      var result;
	      var tick;
	      var positiveFlowForPeriod;
	      var rawMoneyFlow = 0;
	      var moneyFlowRatio;
	      var negativeFlowForPeriod;
	      let typicalPriceValue = null;
	      let prevousTypicalPrice = null;
	      tick = yield;
	      tick.close; //Fist value 
	      tick = yield;
	      while (true) {
	        var {
	          high,
	          low,
	          close,
	          volume
	        } = tick;
	        var positionMoney = 0;
	        var negativeMoney = 0;
	        typicalPriceValue = typicalPrice.nextValue({
	          high,
	          low,
	          close
	        });
	        rawMoneyFlow = typicalPriceValue * volume;
	        if (typicalPriceValue != null && prevousTypicalPrice != null) {
	          typicalPriceValue > prevousTypicalPrice ? positionMoney = rawMoneyFlow : negativeMoney = rawMoneyFlow;
	          positiveFlow.push(positionMoney);
	          negativeFlow.push(negativeMoney);
	          positiveFlowForPeriod = positiveFlow.periodSum;
	          negativeFlowForPeriod = negativeFlow.periodSum;
	          if (positiveFlow.totalPushed >= period && positiveFlow.totalPushed >= period) {
	            moneyFlowRatio = positiveFlowForPeriod / negativeFlowForPeriod;
	            result = 100 - 100 / (1 + moneyFlowRatio);
	          }
	        }
	        prevousTypicalPrice = typicalPriceValue;
	        tick = yield result;
	      }
	    }();
	    this.generator.next();
	    highs.forEach((tickHigh, index) => {
	      var tickInput = {
	        high: tickHigh,
	        low: lows[index],
	        close: closes[index],
	        volume: volumes[index]
	      };
	      var result = this.generator.next(tickInput);
	      if (result.value != undefined) {
	        this.result.push(parseFloat(result.value.toFixed(2)));
	      }
	    });
	  }
	  static calculate = mfi;
	  nextValue(price) {
	    var result = this.generator.next(price);
	    if (result.value != undefined) {
	      return parseFloat(result.value.toFixed(2));
	    }
	  }
	};
	MFI.MFI = MFI$1;
	function mfi(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new MFI$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return MFI;
}

var StochasticRSI = {};

var hasRequiredStochasticRSI;

function requireStochasticRSI () {
	if (hasRequiredStochasticRSI) return StochasticRSI;
	hasRequiredStochasticRSI = 1;

	Object.defineProperty(StochasticRSI, "__esModule", {
	  value: true
	});
	StochasticRSI.StochasticRsiInput = StochasticRSI.StochasticRSIOutput = StochasticRSI.StochasticRSI = void 0;
	StochasticRSI.stochasticrsi = stochasticrsi;
	var _indicator = requireIndicator();
	var _SMA = requireSMA();
	var _RSI = requireRSI();
	var _Stochastic = requireStochastic();
	class StochasticRsiInput extends _indicator.IndicatorInput {
	  values;
	  rsiPeriod;
	  stochasticPeriod;
	  kPeriod;
	  dPeriod;
	}
	StochasticRSI.StochasticRsiInput = StochasticRsiInput;
	class StochasticRSIOutput {
	  stochRSI;
	  k;
	  d;
	}
	StochasticRSI.StochasticRSIOutput = StochasticRSIOutput;
	let StochasticRSI$1 = class StochasticRSI extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    let closes = input.values;
	    let rsiPeriod = input.rsiPeriod;
	    let stochasticPeriod = input.stochasticPeriod;
	    let kPeriod = input.kPeriod;
	    let dPeriod = input.dPeriod;
	    this.format;
	    this.result = [];
	    this.generator = function* () {
	      let rsi = new _RSI.RSI({
	        period: rsiPeriod,
	        values: []
	      });
	      let stochastic = new _Stochastic.Stochastic({
	        period: stochasticPeriod,
	        high: [],
	        low: [],
	        close: [],
	        signalPeriod: kPeriod
	      });
	      let dSma = new _SMA.SMA({
	        period: dPeriod,
	        values: [],
	        format: v => {
	          return v;
	        }
	      });
	      let lastRSI, stochasticRSI, d, result;
	      var tick = yield;
	      while (true) {
	        lastRSI = rsi.nextValue(tick);
	        if (lastRSI !== undefined) {
	          var stochasticInput = {
	            high: lastRSI,
	            low: lastRSI,
	            close: lastRSI
	          };
	          stochasticRSI = stochastic.nextValue(stochasticInput);
	          if (stochasticRSI !== undefined && stochasticRSI.d !== undefined) {
	            d = dSma.nextValue(stochasticRSI.d);
	            if (d !== undefined) result = {
	              stochRSI: stochasticRSI.k,
	              k: stochasticRSI.d,
	              d: d
	            };
	          }
	        }
	        tick = yield result;
	      }
	    }();
	    this.generator.next();
	    closes.forEach((tick, index) => {
	      var result = this.generator.next(tick);
	      if (result.value !== undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = stochasticrsi;
	  nextValue(input) {
	    let nextResult = this.generator.next(input);
	    if (nextResult.value !== undefined) return nextResult.value;
	  }
	};
	StochasticRSI.StochasticRSI = StochasticRSI$1;
	function stochasticrsi(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new StochasticRSI$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return StochasticRSI;
}

var Highest = {};

var hasRequiredHighest;

function requireHighest () {
	if (hasRequiredHighest) return Highest;
	hasRequiredHighest = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(Highest, "__esModule", {
	  value: true
	});
	Highest.HighestInput = Highest.Highest = void 0;
	Highest.highest = highest;
	var _indicator = requireIndicator();
	var _FixedSizeLinkedList = _interopRequireDefault(requireFixedSizeLinkedList());
	class HighestInput extends _indicator.IndicatorInput {
	  values;
	  period;
	}
	Highest.HighestInput = HighestInput;
	let Highest$1 = class Highest extends _indicator.Indicator {
	  generator;
	  constructor(input) {
	    super(input);
	    var values = input.values;
	    var period = input.period;
	    this.result = [];
	    var periodList = new _FixedSizeLinkedList.default(period, true, false, false);
	    this.generator = function* () {
	      var tick;
	      var high;
	      tick = yield;
	      while (true) {
	        periodList.push(tick);
	        if (periodList.totalPushed >= period) {
	          high = periodList.periodHigh;
	        }
	        tick = yield high;
	      }
	    }();
	    this.generator.next();
	    values.forEach((value, index) => {
	      var result = this.generator.next(value);
	      if (result.value != undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = highest;
	  nextValue(price) {
	    var result = this.generator.next(price);
	    if (result.value != undefined) {
	      return result.value;
	    }
	  }
	};
	Highest.Highest = Highest$1;
	function highest(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new Highest$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return Highest;
}

var Lowest = {};

var hasRequiredLowest;

function requireLowest () {
	if (hasRequiredLowest) return Lowest;
	hasRequiredLowest = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(Lowest, "__esModule", {
	  value: true
	});
	Lowest.LowestInput = Lowest.Lowest = void 0;
	Lowest.lowest = lowest;
	var _indicator = requireIndicator();
	var _FixedSizeLinkedList = _interopRequireDefault(requireFixedSizeLinkedList());
	class LowestInput extends _indicator.IndicatorInput {
	  values;
	  period;
	}
	Lowest.LowestInput = LowestInput;
	let Lowest$1 = class Lowest extends _indicator.Indicator {
	  generator;
	  constructor(input) {
	    super(input);
	    var values = input.values;
	    var period = input.period;
	    this.result = [];
	    var periodList = new _FixedSizeLinkedList.default(period, false, true, false);
	    this.generator = function* () {
	      var tick;
	      var high;
	      tick = yield;
	      while (true) {
	        periodList.push(tick);
	        if (periodList.totalPushed >= period) {
	          high = periodList.periodLow;
	        }
	        tick = yield high;
	      }
	    }();
	    this.generator.next();
	    values.forEach((value, index) => {
	      var result = this.generator.next(value);
	      if (result.value != undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = lowest;
	  nextValue(price) {
	    var result = this.generator.next(price);
	    if (result.value != undefined) {
	      return result.value;
	    }
	  }
	};
	Lowest.Lowest = Lowest$1;
	function lowest(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new Lowest$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return Lowest;
}

var Sum = {};

var hasRequiredSum;

function requireSum () {
	if (hasRequiredSum) return Sum;
	hasRequiredSum = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(Sum, "__esModule", {
	  value: true
	});
	Sum.SumInput = Sum.Sum = void 0;
	Sum.sum = sum;
	var _indicator = requireIndicator();
	var _FixedSizeLinkedList = _interopRequireDefault(requireFixedSizeLinkedList());
	class SumInput extends _indicator.IndicatorInput {
	  values;
	  period;
	}
	Sum.SumInput = SumInput;
	let Sum$1 = class Sum extends _indicator.Indicator {
	  generator;
	  constructor(input) {
	    super(input);
	    var values = input.values;
	    var period = input.period;
	    this.result = [];
	    var periodList = new _FixedSizeLinkedList.default(period, false, false, true);
	    this.generator = function* () {
	      var tick;
	      var high;
	      tick = yield;
	      while (true) {
	        periodList.push(tick);
	        if (periodList.totalPushed >= period) {
	          high = periodList.periodSum;
	        }
	        tick = yield high;
	      }
	    }();
	    this.generator.next();
	    values.forEach((value, index) => {
	      var result = this.generator.next(value);
	      if (result.value != undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = sum;
	  nextValue(price) {
	    var result = this.generator.next(price);
	    if (result.value != undefined) {
	      return result.value;
	    }
	  }
	};
	Sum.Sum = Sum$1;
	function sum(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new Sum$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return Sum;
}

var Renko = {};

var hasRequiredRenko;

function requireRenko () {
	if (hasRequiredRenko) return Renko;
	hasRequiredRenko = 1;

	Object.defineProperty(Renko, "__esModule", {
	  value: true
	});
	Renko.RenkoInput = void 0;
	Renko.renko = renko;
	var _StockData = requireStockData();
	var _ATR = requireATR();
	var _indicator = requireIndicator();
	/**
	 * Created by AAravindan on 5/4/16.
	 */

	class RenkoInput extends _indicator.IndicatorInput {
	  period;
	  brickSize;
	  useATR;
	  low;
	  open;
	  volume;
	  high;
	  close;
	  timestamp;
	}
	Renko.RenkoInput = RenkoInput;
	let Renko$1 = class Renko extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    this.format;
	    let useATR = input.useATR;
	    let brickSize = input.brickSize || 0;
	    if (useATR) {
	      let atrResult = (0, _ATR.atr)(Object.assign({}, input));
	      brickSize = atrResult[atrResult.length - 1];
	    }
	    this.result = new _StockData.CandleList();
	    if (brickSize === 0) {
	      console.error('Not enough data to calculate brickSize for renko when using ATR');
	      return;
	    }
	    let lastOpen = 0;
	    let lastHigh = 0;
	    let lastLow = Infinity;
	    let lastClose = 0;
	    let lastVolume = 0;
	    this.generator = function* () {
	      let candleData = yield;
	      while (true) {
	        //Calculating first bar
	        if (lastOpen === 0) {
	          lastOpen = candleData.close;
	          lastHigh = candleData.high;
	          lastLow = candleData.low;
	          lastClose = candleData.close;
	          lastVolume = candleData.volume;
	          candleData.timestamp;
	          candleData = yield;
	          continue;
	        }
	        let absoluteMovementFromClose = Math.abs(candleData.close - lastClose);
	        let absoluteMovementFromOpen = Math.abs(candleData.close - lastOpen);
	        if (absoluteMovementFromClose >= brickSize && absoluteMovementFromOpen >= brickSize) {
	          let reference = absoluteMovementFromClose > absoluteMovementFromOpen ? lastOpen : lastClose;
	          let calculated = {
	            open: reference,
	            high: lastHigh > candleData.high ? lastHigh : candleData.high,
	            low: lastLow < candleData.Low ? lastLow : candleData.low,
	            close: reference > candleData.close ? reference - brickSize : reference + brickSize,
	            volume: lastVolume + candleData.volume,
	            timestamp: candleData.timestamp
	          };
	          lastOpen = calculated.open;
	          lastHigh = calculated.close;
	          lastLow = calculated.close;
	          lastClose = calculated.close;
	          lastVolume = 0;
	          candleData = yield calculated;
	        } else {
	          lastHigh = lastHigh > candleData.high ? lastHigh : candleData.high;
	          lastLow = lastLow < candleData.Low ? lastLow : candleData.low;
	          lastVolume = lastVolume + candleData.volume;
	          candleData.timestamp;
	          candleData = yield;
	        }
	      }
	    }();
	    this.generator.next();
	    input.low.forEach((tick, index) => {
	      var result = this.generator.next({
	        open: input.open[index],
	        high: input.high[index],
	        low: input.low[index],
	        close: input.close[index],
	        volume: input.volume[index],
	        timestamp: input.timestamp[index]
	      });
	      if (result.value) {
	        this.result.open.push(result.value.open);
	        this.result.high.push(result.value.high);
	        this.result.low.push(result.value.low);
	        this.result.close.push(result.value.close);
	        this.result.volume.push(result.value.volume);
	        this.result.timestamp.push(result.value.timestamp);
	      }
	    });
	  }
	  static calculate = renko;
	  nextValue(price) {
	    console.error('Cannot calculate next value on Renko, Every value has to be recomputed for every change, use calcualte method');
	    return null;
	  }
	};
	function renko(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new Renko$1(input).result;
	  if (input.reversedInput) {
	    result.open.reverse();
	    result.high.reverse();
	    result.low.reverse();
	    result.close.reverse();
	    result.volume.reverse();
	    result.timestamp.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return Renko;
}

var HeikinAshi = {};

var hasRequiredHeikinAshi;

function requireHeikinAshi () {
	if (hasRequiredHeikinAshi) return HeikinAshi;
	hasRequiredHeikinAshi = 1;

	Object.defineProperty(HeikinAshi, "__esModule", {
	  value: true
	});
	HeikinAshi.HeikinAshiInput = HeikinAshi.HeikinAshi = void 0;
	HeikinAshi.heikinashi = heikinashi;
	var _StockData = requireStockData();
	var _indicator = requireIndicator();
	/**
	 * Created by AAravindan on 5/4/16.
	 */

	class HeikinAshiInput extends _indicator.IndicatorInput {
	  low;
	  open;
	  volume;
	  high;
	  close;
	  timestamp;
	}
	HeikinAshi.HeikinAshiInput = HeikinAshiInput;
	let HeikinAshi$1 = class HeikinAshi extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    this.format;
	    this.result = new _StockData.CandleList();
	    let lastOpen = null;
	    let lastHigh = 0;
	    let lastLow = Infinity;
	    let lastClose = 0;
	    this.generator = function* () {
	      let candleData = yield;
	      let calculated = null;
	      while (true) {
	        if (lastOpen === null) {
	          lastOpen = (candleData.close + candleData.open) / 2;
	          lastHigh = candleData.high;
	          lastLow = candleData.low;
	          lastClose = (candleData.close + candleData.open + candleData.high + candleData.low) / 4;
	          candleData.volume || 0;
	          candleData.timestamp || 0;
	          calculated = {
	            open: lastOpen,
	            high: lastHigh,
	            low: lastLow,
	            close: lastClose,
	            volume: candleData.volume || 0,
	            timestamp: candleData.timestamp || 0
	          };
	        } else {
	          let newClose = (candleData.close + candleData.open + candleData.high + candleData.low) / 4;
	          let newOpen = (lastOpen + lastClose) / 2;
	          let newHigh = Math.max(newOpen, newClose, candleData.high);
	          let newLow = Math.min(candleData.low, newOpen, newClose);
	          calculated = {
	            close: newClose,
	            open: newOpen,
	            high: newHigh,
	            low: newLow,
	            volume: candleData.volume || 0,
	            timestamp: candleData.timestamp || 0
	          };
	          lastClose = newClose;
	          lastOpen = newOpen;
	          lastHigh = newHigh;
	          lastLow = newLow;
	        }
	        candleData = yield calculated;
	      }
	    }();
	    this.generator.next();
	    input.low.forEach((tick, index) => {
	      var result = this.generator.next({
	        open: input.open[index],
	        high: input.high[index],
	        low: input.low[index],
	        close: input.close[index],
	        volume: input.volume ? input.volume[index] : input.volume,
	        timestamp: input.timestamp ? input.timestamp[index] : input.timestamp
	      });
	      if (result.value) {
	        this.result.open.push(result.value.open);
	        this.result.high.push(result.value.high);
	        this.result.low.push(result.value.low);
	        this.result.close.push(result.value.close);
	        this.result.volume.push(result.value.volume);
	        this.result.timestamp.push(result.value.timestamp);
	      }
	    });
	  }
	  static calculate = heikinashi;
	  nextValue(price) {
	    var result = this.generator.next(price).value;
	    return result;
	  }
	};
	HeikinAshi.HeikinAshi = HeikinAshi$1;
	function heikinashi(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new HeikinAshi$1(input).result;
	  if (input.reversedInput) {
	    result.open.reverse();
	    result.high.reverse();
	    result.low.reverse();
	    result.close.reverse();
	    result.volume.reverse();
	    result.timestamp.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return HeikinAshi;
}

var Bullish = {};

var MorningStar = {};

var CandlestickFinder = {};

var hasRequiredCandlestickFinder;

function requireCandlestickFinder () {
	if (hasRequiredCandlestickFinder) return CandlestickFinder;
	hasRequiredCandlestickFinder = 1;

	Object.defineProperty(CandlestickFinder, "__esModule", {
	  value: true
	});
	CandlestickFinder.default = void 0;
	let CandlestickFinder$1 = class CandlestickFinder {
	  requiredCount;
	  name;
	  scale;
	  constructor() {
	    // if (new.target === Abstract) {
	    //     throw new TypeError("Abstract class");
	    // }
	  }
	  approximateEqual(a, b) {
	    let left = parseFloat(Math.abs(a - b).toPrecision(4)) * 1;
	    let right = parseFloat((a * 0.001 * this.scale).toPrecision(4)) * 1;
	    return left <= right;
	  }
	  logic(data) {
	    throw "this has to be implemented";
	  }
	  getAllPatternIndex(data) {
	    if (data.close.length < this.requiredCount) {
	      console.warn('Data count less than data required for the strategy ', this.name);
	      return [];
	    }
	    if (data.reversedInput) {
	      data.open.reverse();
	      data.high.reverse();
	      data.low.reverse();
	      data.close.reverse();
	    }
	    let strategyFn = this.logic;
	    return this._generateDataForCandleStick(data).map((current, index) => {
	      return strategyFn.call(this, current) ? index : undefined;
	    }).filter(hasIndex => {
	      return hasIndex;
	    });
	  }
	  hasPattern(data) {
	    if (data.close.length < this.requiredCount) {
	      console.warn('Data count less than data required for the strategy ', this.name);
	      return false;
	    }
	    if (data.reversedInput) {
	      data.open.reverse();
	      data.high.reverse();
	      data.low.reverse();
	      data.close.reverse();
	    }
	    let strategyFn = this.logic;
	    return strategyFn.call(this, this._getLastDataForCandleStick(data));
	  }
	  _getLastDataForCandleStick(data) {
	    let requiredCount = this.requiredCount;
	    if (data.close.length === requiredCount) {
	      return data;
	    } else {
	      let returnVal = {
	        open: [],
	        high: [],
	        low: [],
	        close: []
	      };
	      let i = 0;
	      let index = data.close.length - requiredCount;
	      while (i < requiredCount) {
	        returnVal.open.push(data.open[index + i]);
	        returnVal.high.push(data.high[index + i]);
	        returnVal.low.push(data.low[index + i]);
	        returnVal.close.push(data.close[index + i]);
	        i++;
	      }
	      return returnVal;
	    }
	  }
	  _generateDataForCandleStick(data) {
	    let requiredCount = this.requiredCount;
	    let generatedData = data.close.map(function (currentData, index) {
	      let i = 0;
	      let returnVal = {
	        open: [],
	        high: [],
	        low: [],
	        close: []
	      };
	      while (i < requiredCount) {
	        returnVal.open.push(data.open[index + i]);
	        returnVal.high.push(data.high[index + i]);
	        returnVal.low.push(data.low[index + i]);
	        returnVal.close.push(data.close[index + i]);
	        i++;
	      }
	      return returnVal;
	    }).filter((val, index) => {
	      return index <= data.close.length - requiredCount;
	    });
	    return generatedData;
	  }
	};
	CandlestickFinder.default = CandlestickFinder$1;
	
	return CandlestickFinder;
}

var hasRequiredMorningStar;

function requireMorningStar () {
	if (hasRequiredMorningStar) return MorningStar;
	hasRequiredMorningStar = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(MorningStar, "__esModule", {
	  value: true
	});
	MorningStar.default = void 0;
	MorningStar.morningstar = morningstar;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let MorningStar$1 = class MorningStar extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'MorningStar';
	    this.requiredCount = 3;
	    this.scale = scale;
	  }
	  logic(data) {
	    let firstdaysOpen = data.open[0];
	    let firstdaysClose = data.close[0];
	    data.high[0];
	    let firstdaysLow = data.low[0];
	    data.open[1];
	    let seconddaysClose = data.close[1];
	    let seconddaysHigh = data.high[1];
	    let seconddaysLow = data.low[1];
	    let thirddaysOpen = data.open[2];
	    let thirddaysClose = data.close[2];
	    data.high[2];
	    data.low[2];
	    let firstdaysMidpoint = (firstdaysOpen + firstdaysClose) / 2;
	    let isFirstBearish = firstdaysClose < firstdaysOpen;
	    let isSmallBodyExists = firstdaysLow > seconddaysLow && firstdaysLow > seconddaysHigh;
	    let isThirdBullish = thirddaysOpen < thirddaysClose;
	    let gapExists = seconddaysHigh < firstdaysLow && seconddaysLow < firstdaysLow && thirddaysOpen > seconddaysHigh && seconddaysClose < thirddaysOpen;
	    let doesCloseAboveFirstMidpoint = thirddaysClose > firstdaysMidpoint;
	    return isFirstBearish && isSmallBodyExists && gapExists && isThirdBullish && doesCloseAboveFirstMidpoint;
	  }
	};
	MorningStar.default = MorningStar$1;
	function morningstar(data, scale = 1) {
	  return new MorningStar$1(scale).hasPattern(data);
	}
	
	return MorningStar;
}

var BullishEngulfingPattern = {};

var hasRequiredBullishEngulfingPattern;

function requireBullishEngulfingPattern () {
	if (hasRequiredBullishEngulfingPattern) return BullishEngulfingPattern;
	hasRequiredBullishEngulfingPattern = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(BullishEngulfingPattern, "__esModule", {
	  value: true
	});
	BullishEngulfingPattern.bullishengulfingpattern = bullishengulfingpattern;
	BullishEngulfingPattern.default = void 0;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let BullishEngulfingPattern$1 = class BullishEngulfingPattern extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'BullishEngulfingPattern';
	    this.requiredCount = 2;
	    this.scale = scale;
	  }
	  logic(data) {
	    let firstdaysOpen = data.open[0];
	    let firstdaysClose = data.close[0];
	    data.high[0];
	    data.low[0];
	    let seconddaysOpen = data.open[1];
	    let seconddaysClose = data.close[1];
	    data.high[1];
	    data.low[1];
	    let isBullishEngulfing = firstdaysClose < firstdaysOpen && firstdaysOpen > seconddaysOpen && firstdaysClose >= seconddaysOpen && firstdaysOpen < seconddaysClose;
	    return isBullishEngulfing;
	  }
	};
	BullishEngulfingPattern.default = BullishEngulfingPattern$1;
	function bullishengulfingpattern(data, scale = 1) {
	  return new BullishEngulfingPattern$1(scale).hasPattern(data);
	}
	
	return BullishEngulfingPattern;
}

var BullishHarami = {};

var hasRequiredBullishHarami;

function requireBullishHarami () {
	if (hasRequiredBullishHarami) return BullishHarami;
	hasRequiredBullishHarami = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(BullishHarami, "__esModule", {
	  value: true
	});
	BullishHarami.bullishharami = bullishharami;
	BullishHarami.default = void 0;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let BullishHarami$1 = class BullishHarami extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.requiredCount = 2;
	    this.name = "BullishHarami";
	    this.scale = scale;
	  }
	  logic(data) {
	    let firstdaysOpen = data.open[0];
	    let firstdaysClose = data.close[0];
	    let firstdaysHigh = data.high[0];
	    data.low[0];
	    let seconddaysOpen = data.open[1];
	    let seconddaysClose = data.close[1];
	    let seconddaysHigh = data.high[1];
	    let seconddaysLow = data.low[1];
	    let isBullishHaramiPattern = firstdaysOpen > seconddaysOpen && firstdaysClose <= seconddaysOpen && firstdaysClose < seconddaysClose && firstdaysOpen > seconddaysLow && firstdaysHigh > seconddaysHigh;
	    return isBullishHaramiPattern;
	  }
	};
	BullishHarami.default = BullishHarami$1;
	function bullishharami(data, scale = 1) {
	  return new BullishHarami$1(scale).hasPattern(data);
	}
	
	return BullishHarami;
}

var BullishHaramiCross = {};

var hasRequiredBullishHaramiCross;

function requireBullishHaramiCross () {
	if (hasRequiredBullishHaramiCross) return BullishHaramiCross;
	hasRequiredBullishHaramiCross = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(BullishHaramiCross, "__esModule", {
	  value: true
	});
	BullishHaramiCross.bullishharamicross = bullishharamicross;
	BullishHaramiCross.default = void 0;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let BullishHaramiCross$1 = class BullishHaramiCross extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.requiredCount = 2;
	    this.name = 'BullishHaramiCross';
	    this.scale = scale;
	  }
	  logic(data) {
	    let firstdaysOpen = data.open[0];
	    let firstdaysClose = data.close[0];
	    let firstdaysHigh = data.high[0];
	    data.low[0];
	    let seconddaysOpen = data.open[1];
	    let seconddaysClose = data.close[1];
	    let seconddaysHigh = data.high[1];
	    let seconddaysLow = data.low[1];
	    let isBullishHaramiCrossPattern = firstdaysOpen > seconddaysOpen && firstdaysClose <= seconddaysOpen && firstdaysClose < seconddaysClose && firstdaysOpen > seconddaysLow && firstdaysHigh > seconddaysHigh;
	    let isSecondDayDoji = this.approximateEqual(seconddaysOpen, seconddaysClose);
	    return isBullishHaramiCrossPattern && isSecondDayDoji;
	  }
	};
	BullishHaramiCross.default = BullishHaramiCross$1;
	function bullishharamicross(data, scale = 1) {
	  return new BullishHaramiCross$1(scale).hasPattern(data);
	}
	
	return BullishHaramiCross;
}

var MorningDojiStar = {};

var Doji = {};

var hasRequiredDoji;

function requireDoji () {
	if (hasRequiredDoji) return Doji;
	hasRequiredDoji = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(Doji, "__esModule", {
	  value: true
	});
	Doji.default = void 0;
	Doji.doji = doji;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let Doji$1 = class Doji extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'Doji';
	    this.requiredCount = 1;
	    this.scale = scale;
	  }
	  logic(data) {
	    let daysOpen = data.open[0];
	    let daysClose = data.close[0];
	    let daysHigh = data.high[0];
	    let daysLow = data.low[0];
	    let isOpenEqualsClose = this.approximateEqual(daysOpen, daysClose);
	    let isHighEqualsOpen = isOpenEqualsClose && this.approximateEqual(daysOpen, daysHigh);
	    let isLowEqualsClose = isOpenEqualsClose && this.approximateEqual(daysClose, daysLow);
	    return isOpenEqualsClose && isHighEqualsOpen == isLowEqualsClose;
	  }
	};
	Doji.default = Doji$1;
	function doji(data, scale = 1) {
	  return new Doji$1(scale).hasPattern(data);
	}
	
	return Doji;
}

var hasRequiredMorningDojiStar;

function requireMorningDojiStar () {
	if (hasRequiredMorningDojiStar) return MorningDojiStar;
	hasRequiredMorningDojiStar = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(MorningDojiStar, "__esModule", {
	  value: true
	});
	MorningDojiStar.default = void 0;
	MorningDojiStar.morningdojistar = morningdojistar;
	var _Doji = _interopRequireDefault(requireDoji());
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let MorningDojiStar$1 = class MorningDojiStar extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'MorningDojiStar';
	    this.requiredCount = 3;
	    this.scale = scale;
	  }
	  logic(data) {
	    let firstdaysOpen = data.open[0];
	    let firstdaysClose = data.close[0];
	    data.high[0];
	    let firstdaysLow = data.low[0];
	    let seconddaysOpen = data.open[1];
	    let seconddaysClose = data.close[1];
	    let seconddaysHigh = data.high[1];
	    let seconddaysLow = data.low[1];
	    let thirddaysOpen = data.open[2];
	    let thirddaysClose = data.close[2];
	    data.high[2];
	    data.low[2];
	    let firstdaysMidpoint = (firstdaysOpen + firstdaysClose) / 2;
	    let isFirstBearish = firstdaysClose < firstdaysOpen;
	    let dojiExists = new _Doji.default(this.scale).hasPattern({
	      "open": [seconddaysOpen],
	      "close": [seconddaysClose],
	      "high": [seconddaysHigh],
	      "low": [seconddaysLow]
	    });
	    let isThirdBullish = thirddaysOpen < thirddaysClose;
	    let gapExists = seconddaysHigh < firstdaysLow && seconddaysLow < firstdaysLow && thirddaysOpen > seconddaysHigh && seconddaysClose < thirddaysOpen;
	    let doesCloseAboveFirstMidpoint = thirddaysClose > firstdaysMidpoint;
	    return isFirstBearish && dojiExists && isThirdBullish && gapExists && doesCloseAboveFirstMidpoint;
	  }
	};
	MorningDojiStar.default = MorningDojiStar$1;
	function morningdojistar(data, scale = 1) {
	  return new MorningDojiStar$1(scale).hasPattern(data);
	}
	
	return MorningDojiStar;
}

var DownsideTasukiGap = {};

var hasRequiredDownsideTasukiGap;

function requireDownsideTasukiGap () {
	if (hasRequiredDownsideTasukiGap) return DownsideTasukiGap;
	hasRequiredDownsideTasukiGap = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(DownsideTasukiGap, "__esModule", {
	  value: true
	});
	DownsideTasukiGap.default = void 0;
	DownsideTasukiGap.downsidetasukigap = downsidetasukigap;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let DownsideTasukiGap$1 = class DownsideTasukiGap extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.requiredCount = 3;
	    this.name = 'DownsideTasukiGap';
	    this.scale = scale;
	  }
	  logic(data) {
	    let firstdaysOpen = data.open[0];
	    let firstdaysClose = data.close[0];
	    data.high[0];
	    let firstdaysLow = data.low[0];
	    let seconddaysOpen = data.open[1];
	    let seconddaysClose = data.close[1];
	    let seconddaysHigh = data.high[1];
	    data.low[1];
	    let thirddaysOpen = data.open[2];
	    let thirddaysClose = data.close[2];
	    data.high[2];
	    data.low[2];
	    let isFirstBearish = firstdaysClose < firstdaysOpen;
	    let isSecondBearish = seconddaysClose < seconddaysOpen;
	    let isThirdBullish = thirddaysClose > thirddaysOpen;
	    let isFirstGapExists = seconddaysHigh < firstdaysLow;
	    let isDownsideTasukiGap = seconddaysOpen > thirddaysOpen && seconddaysClose < thirddaysOpen && thirddaysClose > seconddaysOpen && thirddaysClose < firstdaysClose;
	    return isFirstBearish && isSecondBearish && isThirdBullish && isFirstGapExists && isDownsideTasukiGap;
	  }
	};
	DownsideTasukiGap.default = DownsideTasukiGap$1;
	function downsidetasukigap(data, scale = 1) {
	  return new DownsideTasukiGap$1(scale).hasPattern(data);
	}
	
	return DownsideTasukiGap;
}

var BullishMarubozu = {};

var hasRequiredBullishMarubozu;

function requireBullishMarubozu () {
	if (hasRequiredBullishMarubozu) return BullishMarubozu;
	hasRequiredBullishMarubozu = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(BullishMarubozu, "__esModule", {
	  value: true
	});
	BullishMarubozu.bullishmarubozu = bullishmarubozu;
	BullishMarubozu.default = void 0;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let BullishMarubozu$1 = class BullishMarubozu extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'BullishMarubozu';
	    this.requiredCount = 1;
	    this.scale = scale;
	  }
	  logic(data) {
	    let daysOpen = data.open[0];
	    let daysClose = data.close[0];
	    let daysHigh = data.high[0];
	    let daysLow = data.low[0];
	    let isBullishMarbozu = this.approximateEqual(daysClose, daysHigh) && this.approximateEqual(daysLow, daysOpen) && daysOpen < daysClose && daysOpen < daysHigh;
	    return isBullishMarbozu;
	  }
	};
	BullishMarubozu.default = BullishMarubozu$1;
	function bullishmarubozu(data, scale = 1) {
	  return new BullishMarubozu$1(scale).hasPattern(data);
	}
	
	return BullishMarubozu;
}

var PiercingLine = {};

var hasRequiredPiercingLine;

function requirePiercingLine () {
	if (hasRequiredPiercingLine) return PiercingLine;
	hasRequiredPiercingLine = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(PiercingLine, "__esModule", {
	  value: true
	});
	PiercingLine.default = void 0;
	PiercingLine.piercingline = piercingline;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let PiercingLine$1 = class PiercingLine extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.requiredCount = 2;
	    this.name = 'PiercingLine';
	    this.scale = scale;
	  }
	  logic(data) {
	    let firstdaysOpen = data.open[0];
	    let firstdaysClose = data.close[0];
	    data.high[0];
	    let firstdaysLow = data.low[0];
	    let seconddaysOpen = data.open[1];
	    let seconddaysClose = data.close[1];
	    data.high[1];
	    let seconddaysLow = data.low[1];
	    let firstdaysMidpoint = (firstdaysOpen + firstdaysClose) / 2;
	    let isDowntrend = seconddaysLow < firstdaysLow;
	    let isFirstBearish = firstdaysClose < firstdaysOpen;
	    let isSecondBullish = seconddaysClose > seconddaysOpen;
	    let isPiercingLinePattern = firstdaysLow > seconddaysOpen && seconddaysClose > firstdaysMidpoint;
	    return isDowntrend && isFirstBearish && isPiercingLinePattern && isSecondBullish;
	  }
	};
	PiercingLine.default = PiercingLine$1;
	function piercingline(data, scale = 1) {
	  return new PiercingLine$1(scale).hasPattern(data);
	}
	
	return PiercingLine;
}

var ThreeWhiteSoldiers = {};

var hasRequiredThreeWhiteSoldiers;

function requireThreeWhiteSoldiers () {
	if (hasRequiredThreeWhiteSoldiers) return ThreeWhiteSoldiers;
	hasRequiredThreeWhiteSoldiers = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(ThreeWhiteSoldiers, "__esModule", {
	  value: true
	});
	ThreeWhiteSoldiers.default = void 0;
	ThreeWhiteSoldiers.threewhitesoldiers = threewhitesoldiers;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let ThreeWhiteSoldiers$1 = class ThreeWhiteSoldiers extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'ThreeWhiteSoldiers';
	    this.requiredCount = 3;
	    this.scale = scale;
	  }
	  logic(data) {
	    let firstdaysOpen = data.open[0];
	    let firstdaysClose = data.close[0];
	    let firstdaysHigh = data.high[0];
	    data.low[0];
	    let seconddaysOpen = data.open[1];
	    let seconddaysClose = data.close[1];
	    let seconddaysHigh = data.high[1];
	    data.low[1];
	    let thirddaysOpen = data.open[2];
	    let thirddaysClose = data.close[2];
	    let thirddaysHigh = data.high[2];
	    data.low[2];
	    let isUpTrend = seconddaysHigh > firstdaysHigh && thirddaysHigh > seconddaysHigh;
	    let isAllBullish = firstdaysOpen < firstdaysClose && seconddaysOpen < seconddaysClose && thirddaysOpen < thirddaysClose;
	    let doesOpenWithinPreviousBody = firstdaysClose > seconddaysOpen && seconddaysOpen < firstdaysHigh && seconddaysHigh > thirddaysOpen && thirddaysOpen < seconddaysClose;
	    return isUpTrend && isAllBullish && doesOpenWithinPreviousBody;
	  }
	};
	ThreeWhiteSoldiers.default = ThreeWhiteSoldiers$1;
	function threewhitesoldiers(data, scale = 1) {
	  return new ThreeWhiteSoldiers$1(scale).hasPattern(data);
	}
	
	return ThreeWhiteSoldiers;
}

var BullishHammerStick = {};

var hasRequiredBullishHammerStick;

function requireBullishHammerStick () {
	if (hasRequiredBullishHammerStick) return BullishHammerStick;
	hasRequiredBullishHammerStick = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(BullishHammerStick, "__esModule", {
	  value: true
	});
	BullishHammerStick.bullishhammerstick = bullishhammerstick;
	BullishHammerStick.default = void 0;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let BullishHammerStick$1 = class BullishHammerStick extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'BullishHammerStick';
	    this.requiredCount = 1;
	    this.scale = scale;
	  }
	  logic(data) {
	    let daysOpen = data.open[0];
	    let daysClose = data.close[0];
	    let daysHigh = data.high[0];
	    let daysLow = data.low[0];
	    let isBullishHammer = daysClose > daysOpen;
	    isBullishHammer = isBullishHammer && this.approximateEqual(daysClose, daysHigh);
	    isBullishHammer = isBullishHammer && 2 * (daysClose - daysOpen) <= daysOpen - daysLow;
	    return isBullishHammer;
	  }
	};
	BullishHammerStick.default = BullishHammerStick$1;
	function bullishhammerstick(data, scale = 1) {
	  return new BullishHammerStick$1(scale).hasPattern(data);
	}
	
	return BullishHammerStick;
}

var BullishInvertedHammerStick = {};

var hasRequiredBullishInvertedHammerStick;

function requireBullishInvertedHammerStick () {
	if (hasRequiredBullishInvertedHammerStick) return BullishInvertedHammerStick;
	hasRequiredBullishInvertedHammerStick = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(BullishInvertedHammerStick, "__esModule", {
	  value: true
	});
	BullishInvertedHammerStick.bullishinvertedhammerstick = bullishinvertedhammerstick;
	BullishInvertedHammerStick.default = void 0;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let BullishInvertedHammerStick$1 = class BullishInvertedHammerStick extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'BullishInvertedHammerStick';
	    this.requiredCount = 1;
	    this.scale = scale;
	  }
	  logic(data) {
	    let daysOpen = data.open[0];
	    let daysClose = data.close[0];
	    let daysHigh = data.high[0];
	    let daysLow = data.low[0];
	    let isBullishInvertedHammer = daysClose > daysOpen;
	    isBullishInvertedHammer = isBullishInvertedHammer && this.approximateEqual(daysOpen, daysLow);
	    isBullishInvertedHammer = isBullishInvertedHammer && daysClose - daysOpen <= 2 * (daysHigh - daysClose);
	    return isBullishInvertedHammer;
	  }
	};
	BullishInvertedHammerStick.default = BullishInvertedHammerStick$1;
	function bullishinvertedhammerstick(data, scale = 1) {
	  return new BullishInvertedHammerStick$1(scale).hasPattern(data);
	}
	
	return BullishInvertedHammerStick;
}

var HammerPattern = {};

var BearishHammerStick = {};

var hasRequiredBearishHammerStick;

function requireBearishHammerStick () {
	if (hasRequiredBearishHammerStick) return BearishHammerStick;
	hasRequiredBearishHammerStick = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(BearishHammerStick, "__esModule", {
	  value: true
	});
	BearishHammerStick.bearishhammerstick = bearishhammerstick;
	BearishHammerStick.default = void 0;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let BearishHammerStick$1 = class BearishHammerStick extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'BearishHammerStick';
	    this.requiredCount = 1;
	    this.scale = scale;
	  }
	  logic(data) {
	    let daysOpen = data.open[0];
	    let daysClose = data.close[0];
	    let daysHigh = data.high[0];
	    let daysLow = data.low[0];
	    let isBearishHammer = daysOpen > daysClose;
	    isBearishHammer = isBearishHammer && this.approximateEqual(daysOpen, daysHigh);
	    isBearishHammer = isBearishHammer && daysOpen - daysClose <= 2 * (daysClose - daysLow);
	    return isBearishHammer;
	  }
	};
	BearishHammerStick.default = BearishHammerStick$1;
	function bearishhammerstick(data, scale = 1) {
	  return new BearishHammerStick$1(scale).hasPattern(data);
	}
	
	return BearishHammerStick;
}

var BearishInvertedHammerStick = {};

var hasRequiredBearishInvertedHammerStick;

function requireBearishInvertedHammerStick () {
	if (hasRequiredBearishInvertedHammerStick) return BearishInvertedHammerStick;
	hasRequiredBearishInvertedHammerStick = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(BearishInvertedHammerStick, "__esModule", {
	  value: true
	});
	BearishInvertedHammerStick.bearishinvertedhammerstick = bearishinvertedhammerstick;
	BearishInvertedHammerStick.default = void 0;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let BearishInvertedHammerStick$1 = class BearishInvertedHammerStick extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'BearishInvertedHammerStick';
	    this.requiredCount = 1;
	    this.scale = scale;
	  }
	  logic(data) {
	    let daysOpen = data.open[0];
	    let daysClose = data.close[0];
	    let daysHigh = data.high[0];
	    let daysLow = data.low[0];
	    let isBearishInvertedHammer = daysOpen > daysClose;
	    isBearishInvertedHammer = isBearishInvertedHammer && this.approximateEqual(daysClose, daysLow);
	    isBearishInvertedHammer = isBearishInvertedHammer && daysOpen - daysClose <= 2 * (daysHigh - daysOpen);
	    return isBearishInvertedHammer;
	  }
	};
	BearishInvertedHammerStick.default = BearishInvertedHammerStick$1;
	function bearishinvertedhammerstick(data, scale = 1) {
	  return new BearishInvertedHammerStick$1(scale).hasPattern(data);
	}
	
	return BearishInvertedHammerStick;
}

var hasRequiredHammerPattern;

function requireHammerPattern () {
	if (hasRequiredHammerPattern) return HammerPattern;
	hasRequiredHammerPattern = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(HammerPattern, "__esModule", {
	  value: true
	});
	HammerPattern.default = void 0;
	HammerPattern.hammerpattern = hammerpattern;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	var _AverageLoss = requireAverageLoss();
	var _AverageGain = requireAverageGain();
	var _BearishHammerStick = requireBearishHammerStick();
	var _BearishInvertedHammerStick = requireBearishInvertedHammerStick();
	var _BullishHammerStick = requireBullishHammerStick();
	var _BullishInvertedHammerStick = requireBullishInvertedHammerStick();
	let HammerPattern$1 = class HammerPattern extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'HammerPattern';
	    this.requiredCount = 5;
	    this.scale = scale;
	  }
	  logic(data) {
	    let isPattern = this.downwardTrend(data);
	    isPattern = isPattern && this.includesHammer(data);
	    isPattern = isPattern && this.hasConfirmation(data);
	    return isPattern;
	  }
	  downwardTrend(data, confirm = true) {
	    let end = confirm ? 3 : 4;
	    // Analyze trends in closing prices of the first three or four candlesticks
	    let gains = (0, _AverageGain.averagegain)({
	      values: data.close.slice(0, end),
	      period: end - 1
	    });
	    let losses = (0, _AverageLoss.averageloss)({
	      values: data.close.slice(0, end),
	      period: end - 1
	    });
	    // Downward trend, so more losses than gains
	    return losses > gains;
	  }
	  includesHammer(data, confirm = true) {
	    let start = confirm ? 3 : 4;
	    let end = confirm ? 4 : undefined;
	    let possibleHammerData = {
	      open: data.open.slice(start, end),
	      close: data.close.slice(start, end),
	      low: data.low.slice(start, end),
	      high: data.high.slice(start, end)
	    };
	    let isPattern = (0, _BearishHammerStick.bearishhammerstick)(possibleHammerData, this.scale);
	    isPattern = isPattern || (0, _BearishInvertedHammerStick.bearishinvertedhammerstick)(possibleHammerData, this.scale);
	    isPattern = isPattern || (0, _BullishHammerStick.bullishhammerstick)(possibleHammerData, this.scale);
	    isPattern = isPattern || (0, _BullishInvertedHammerStick.bullishinvertedhammerstick)(possibleHammerData, this.scale);
	    return isPattern;
	  }
	  hasConfirmation(data) {
	    let possibleHammer = {
	      open: data.open[3],
	      close: data.close[3],
	      low: data.low[3],
	      high: data.high[3]
	    };
	    let possibleConfirmation = {
	      open: data.open[4],
	      close: data.close[4],
	      low: data.low[4],
	      high: data.high[4]
	    };
	    // Confirmation candlestick is bullish
	    let isPattern = possibleConfirmation.open < possibleConfirmation.close;
	    return isPattern && possibleHammer.close < possibleConfirmation.close;
	  }
	};
	HammerPattern.default = HammerPattern$1;
	function hammerpattern(data, scale = 1) {
	  return new HammerPattern$1(scale).hasPattern(data);
	}
	
	return HammerPattern;
}

var HammerPatternUnconfirmed = {};

var hasRequiredHammerPatternUnconfirmed;

function requireHammerPatternUnconfirmed () {
	if (hasRequiredHammerPatternUnconfirmed) return HammerPatternUnconfirmed;
	hasRequiredHammerPatternUnconfirmed = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(HammerPatternUnconfirmed, "__esModule", {
	  value: true
	});
	HammerPatternUnconfirmed.default = void 0;
	HammerPatternUnconfirmed.hammerpatternunconfirmed = hammerpatternunconfirmed;
	var _HammerPattern = _interopRequireDefault(requireHammerPattern());
	let HammerPatternUnconfirmed$1 = class HammerPatternUnconfirmed extends _HammerPattern.default {
	  constructor(scale = 1) {
	    super(scale);
	    this.name = 'HammerPatternUnconfirmed';
	  }
	  logic(data) {
	    let isPattern = this.downwardTrend(data, false);
	    isPattern = isPattern && this.includesHammer(data, false);
	    return isPattern;
	  }
	};
	HammerPatternUnconfirmed.default = HammerPatternUnconfirmed$1;
	function hammerpatternunconfirmed(data, scale = 1) {
	  return new HammerPatternUnconfirmed$1(scale).hasPattern(data);
	}
	
	return HammerPatternUnconfirmed;
}

var TweezerBottom = {};

var hasRequiredTweezerBottom;

function requireTweezerBottom () {
	if (hasRequiredTweezerBottom) return TweezerBottom;
	hasRequiredTweezerBottom = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(TweezerBottom, "__esModule", {
	  value: true
	});
	TweezerBottom.default = void 0;
	TweezerBottom.tweezerbottom = tweezerbottom;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	var _AverageLoss = requireAverageLoss();
	var _AverageGain = requireAverageGain();
	let TweezerBottom$1 = class TweezerBottom extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'TweezerBottom';
	    this.requiredCount = 5;
	    this.scale = scale;
	  }
	  logic(data) {
	    return this.downwardTrend(data) && this.approximateEqual(data.low[3], data.low[4]);
	  }
	  downwardTrend(data) {
	    // Analyze trends in closing prices of the first three or four candlesticks
	    let gains = (0, _AverageGain.averagegain)({
	      values: data.close.slice(0, 3),
	      period: 2
	    });
	    let losses = (0, _AverageLoss.averageloss)({
	      values: data.close.slice(0, 3),
	      period: 2
	    });
	    // Downward trend, so more losses than gains
	    return losses > gains;
	  }
	};
	TweezerBottom.default = TweezerBottom$1;
	function tweezerbottom(data, scale = 1) {
	  return new TweezerBottom$1(scale).hasPattern(data);
	}
	
	return TweezerBottom;
}

var hasRequiredBullish;

function requireBullish () {
	if (hasRequiredBullish) return Bullish;
	hasRequiredBullish = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(Bullish, "__esModule", {
	  value: true
	});
	Bullish.bullish = bullish;
	Bullish.default = void 0;
	var _MorningStar = _interopRequireDefault(requireMorningStar());
	var _BullishEngulfingPattern = _interopRequireDefault(requireBullishEngulfingPattern());
	var _BullishHarami = _interopRequireDefault(requireBullishHarami());
	var _BullishHaramiCross = _interopRequireDefault(requireBullishHaramiCross());
	var _MorningDojiStar = _interopRequireDefault(requireMorningDojiStar());
	var _DownsideTasukiGap = _interopRequireDefault(requireDownsideTasukiGap());
	var _BullishMarubozu = _interopRequireDefault(requireBullishMarubozu());
	var _PiercingLine = _interopRequireDefault(requirePiercingLine());
	var _ThreeWhiteSoldiers = _interopRequireDefault(requireThreeWhiteSoldiers());
	var _BullishHammerStick = _interopRequireDefault(requireBullishHammerStick());
	var _BullishInvertedHammerStick = _interopRequireDefault(requireBullishInvertedHammerStick());
	var _HammerPattern = _interopRequireDefault(requireHammerPattern());
	var _HammerPatternUnconfirmed = _interopRequireDefault(requireHammerPatternUnconfirmed());
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	var _TweezerBottom = _interopRequireDefault(requireTweezerBottom());
	class BullishPatterns extends _CandlestickFinder.default {
	  bullishPatterns;
	  constructor(scale = 1) {
	    super();
	    this.name = 'Bullish Candlesticks';
	    this.scale = scale;
	    this.bullishPatterns = [new _BullishEngulfingPattern.default(scale), new _DownsideTasukiGap.default(scale), new _BullishHarami.default(scale), new _BullishHaramiCross.default(scale), new _MorningDojiStar.default(scale), new _MorningStar.default(scale), new _BullishMarubozu.default(scale), new _PiercingLine.default(scale), new _ThreeWhiteSoldiers.default(scale), new _BullishHammerStick.default(scale), new _BullishInvertedHammerStick.default(scale), new _HammerPattern.default(scale), new _HammerPatternUnconfirmed.default(scale), new _TweezerBottom.default(scale)];
	  }
	  hasPattern(data) {
	    return this.bullishPatterns.reduce(function (state, pattern) {
	      let result = pattern.hasPattern(data);
	      return state || result;
	    }, false);
	  }
	}
	Bullish.default = BullishPatterns;
	function bullish(data, scale = 1) {
	  return new BullishPatterns(scale).hasPattern(data);
	}
	
	return Bullish;
}

var Bearish = {};

var BearishEngulfingPattern = {};

var hasRequiredBearishEngulfingPattern;

function requireBearishEngulfingPattern () {
	if (hasRequiredBearishEngulfingPattern) return BearishEngulfingPattern;
	hasRequiredBearishEngulfingPattern = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(BearishEngulfingPattern, "__esModule", {
	  value: true
	});
	BearishEngulfingPattern.bearishengulfingpattern = bearishengulfingpattern;
	BearishEngulfingPattern.default = void 0;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let BearishEngulfingPattern$1 = class BearishEngulfingPattern extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'BearishEngulfingPattern';
	    this.requiredCount = 2;
	    this.scale = scale;
	  }
	  logic(data) {
	    let firstdaysOpen = data.open[0];
	    let firstdaysClose = data.close[0];
	    data.high[0];
	    data.low[0];
	    let seconddaysOpen = data.open[1];
	    let seconddaysClose = data.close[1];
	    data.high[1];
	    data.low[1];
	    let isBearishEngulfing = firstdaysClose > firstdaysOpen && firstdaysOpen < seconddaysOpen && firstdaysClose <= seconddaysOpen && firstdaysOpen > seconddaysClose;
	    return isBearishEngulfing;
	  }
	};
	BearishEngulfingPattern.default = BearishEngulfingPattern$1;
	function bearishengulfingpattern(data, scale = 1) {
	  return new BearishEngulfingPattern$1(scale).hasPattern(data);
	}
	
	return BearishEngulfingPattern;
}

var BearishHarami = {};

var hasRequiredBearishHarami;

function requireBearishHarami () {
	if (hasRequiredBearishHarami) return BearishHarami;
	hasRequiredBearishHarami = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(BearishHarami, "__esModule", {
	  value: true
	});
	BearishHarami.bearishharami = bearishharami;
	BearishHarami.default = void 0;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let BearishHarami$1 = class BearishHarami extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.requiredCount = 2;
	    this.name = 'BearishHarami';
	    this.scale = scale;
	  }
	  logic(data) {
	    let firstdaysOpen = data.open[0];
	    let firstdaysClose = data.close[0];
	    let firstdaysHigh = data.high[0];
	    data.low[0];
	    let seconddaysOpen = data.open[1];
	    let seconddaysClose = data.close[1];
	    let seconddaysHigh = data.high[1];
	    let seconddaysLow = data.low[1];
	    let isBearishHaramiPattern = firstdaysOpen < seconddaysOpen && firstdaysClose >= seconddaysOpen && firstdaysClose > seconddaysClose && firstdaysOpen < seconddaysLow && firstdaysHigh > seconddaysHigh;
	    return isBearishHaramiPattern;
	  }
	};
	BearishHarami.default = BearishHarami$1;
	function bearishharami(data, scale = 1) {
	  return new BearishHarami$1(scale).hasPattern(data);
	}
	
	return BearishHarami;
}

var BearishHaramiCross = {};

var hasRequiredBearishHaramiCross;

function requireBearishHaramiCross () {
	if (hasRequiredBearishHaramiCross) return BearishHaramiCross;
	hasRequiredBearishHaramiCross = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(BearishHaramiCross, "__esModule", {
	  value: true
	});
	BearishHaramiCross.bearishharamicross = bearishharamicross;
	BearishHaramiCross.default = void 0;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let BearishHaramiCross$1 = class BearishHaramiCross extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.requiredCount = 2;
	    this.name = 'BearishHaramiCross';
	    this.scale = scale;
	  }
	  logic(data) {
	    let firstdaysOpen = data.open[0];
	    let firstdaysClose = data.close[0];
	    let firstdaysHigh = data.high[0];
	    data.low[0];
	    let seconddaysOpen = data.open[1];
	    let seconddaysClose = data.close[1];
	    let seconddaysHigh = data.high[1];
	    let seconddaysLow = data.low[1];
	    let isBearishHaramiCrossPattern = firstdaysOpen < seconddaysOpen && firstdaysClose >= seconddaysOpen && firstdaysClose > seconddaysClose && firstdaysOpen < seconddaysLow && firstdaysHigh > seconddaysHigh;
	    let isSecondDayDoji = this.approximateEqual(seconddaysOpen, seconddaysClose);
	    return isBearishHaramiCrossPattern && isSecondDayDoji;
	  }
	};
	BearishHaramiCross.default = BearishHaramiCross$1;
	function bearishharamicross(data, scale = 1) {
	  return new BearishHaramiCross$1(scale).hasPattern(data);
	}
	
	return BearishHaramiCross;
}

var EveningDojiStar = {};

var hasRequiredEveningDojiStar;

function requireEveningDojiStar () {
	if (hasRequiredEveningDojiStar) return EveningDojiStar;
	hasRequiredEveningDojiStar = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(EveningDojiStar, "__esModule", {
	  value: true
	});
	EveningDojiStar.default = void 0;
	EveningDojiStar.eveningdojistar = eveningdojistar;
	var _Doji = _interopRequireDefault(requireDoji());
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let EveningDojiStar$1 = class EveningDojiStar extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'EveningDojiStar';
	    this.requiredCount = 3;
	    this.scale = scale;
	  }
	  logic(data) {
	    let firstdaysOpen = data.open[0];
	    let firstdaysClose = data.close[0];
	    let firstdaysHigh = data.high[0];
	    data.low[0];
	    let seconddaysOpen = data.open[1];
	    let seconddaysClose = data.close[1];
	    let seconddaysHigh = data.high[1];
	    let seconddaysLow = data.low[1];
	    let thirddaysOpen = data.open[2];
	    let thirddaysClose = data.close[2];
	    data.high[2];
	    data.low[2];
	    let firstdaysMidpoint = (firstdaysOpen + firstdaysClose) / 2;
	    let isFirstBullish = firstdaysClose > firstdaysOpen;
	    let dojiExists = new _Doji.default(this.scale).hasPattern({
	      "open": [seconddaysOpen],
	      "close": [seconddaysClose],
	      "high": [seconddaysHigh],
	      "low": [seconddaysLow]
	    });
	    let isThirdBearish = thirddaysOpen > thirddaysClose;
	    let gapExists = seconddaysHigh > firstdaysHigh && seconddaysLow > firstdaysHigh && thirddaysOpen < seconddaysLow && seconddaysClose > thirddaysOpen;
	    let doesCloseBelowFirstMidpoint = thirddaysClose < firstdaysMidpoint;
	    return isFirstBullish && dojiExists && gapExists && isThirdBearish && doesCloseBelowFirstMidpoint;
	  }
	};
	EveningDojiStar.default = EveningDojiStar$1;
	function eveningdojistar(data, scale = 1) {
	  return new EveningDojiStar$1(scale).hasPattern(data);
	}
	
	return EveningDojiStar;
}

var EveningStar = {};

var hasRequiredEveningStar;

function requireEveningStar () {
	if (hasRequiredEveningStar) return EveningStar;
	hasRequiredEveningStar = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(EveningStar, "__esModule", {
	  value: true
	});
	EveningStar.default = void 0;
	EveningStar.eveningstar = eveningstar;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let EveningStar$1 = class EveningStar extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'EveningStar';
	    this.requiredCount = 3;
	    this.scale = scale;
	  }
	  logic(data) {
	    let firstdaysOpen = data.open[0];
	    let firstdaysClose = data.close[0];
	    let firstdaysHigh = data.high[0];
	    data.low[0];
	    data.open[1];
	    let seconddaysClose = data.close[1];
	    let seconddaysHigh = data.high[1];
	    let seconddaysLow = data.low[1];
	    let thirddaysOpen = data.open[2];
	    let thirddaysClose = data.close[2];
	    data.high[2];
	    data.low[2];
	    let firstdaysMidpoint = (firstdaysOpen + firstdaysClose) / 2;
	    let isFirstBullish = firstdaysClose > firstdaysOpen;
	    let isSmallBodyExists = firstdaysHigh < seconddaysLow && firstdaysHigh < seconddaysHigh;
	    let isThirdBearish = thirddaysOpen > thirddaysClose;
	    let gapExists = seconddaysHigh > firstdaysHigh && seconddaysLow > firstdaysHigh && thirddaysOpen < seconddaysLow && seconddaysClose > thirddaysOpen;
	    let doesCloseBelowFirstMidpoint = thirddaysClose < firstdaysMidpoint;
	    return isFirstBullish && isSmallBodyExists && gapExists && isThirdBearish && doesCloseBelowFirstMidpoint;
	  }
	};
	EveningStar.default = EveningStar$1;
	function eveningstar(data, scale = 1) {
	  return new EveningStar$1(scale).hasPattern(data);
	}
	
	return EveningStar;
}

var BearishMarubozu = {};

var hasRequiredBearishMarubozu;

function requireBearishMarubozu () {
	if (hasRequiredBearishMarubozu) return BearishMarubozu;
	hasRequiredBearishMarubozu = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(BearishMarubozu, "__esModule", {
	  value: true
	});
	BearishMarubozu.bearishmarubozu = bearishmarubozu;
	BearishMarubozu.default = void 0;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let BearishMarubozu$1 = class BearishMarubozu extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'BearishMarubozu';
	    this.requiredCount = 1;
	    this.scale = scale;
	  }
	  logic(data) {
	    let daysOpen = data.open[0];
	    let daysClose = data.close[0];
	    let daysHigh = data.high[0];
	    let daysLow = data.low[0];
	    let isBearishMarbozu = this.approximateEqual(daysOpen, daysHigh) && this.approximateEqual(daysLow, daysClose) && daysOpen > daysClose && daysOpen > daysLow;
	    return isBearishMarbozu;
	  }
	};
	BearishMarubozu.default = BearishMarubozu$1;
	function bearishmarubozu(data, scale = 1) {
	  return new BearishMarubozu$1(scale).hasPattern(data);
	}
	
	return BearishMarubozu;
}

var ThreeBlackCrows = {};

var hasRequiredThreeBlackCrows;

function requireThreeBlackCrows () {
	if (hasRequiredThreeBlackCrows) return ThreeBlackCrows;
	hasRequiredThreeBlackCrows = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(ThreeBlackCrows, "__esModule", {
	  value: true
	});
	ThreeBlackCrows.default = void 0;
	ThreeBlackCrows.threeblackcrows = threeblackcrows;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let ThreeBlackCrows$1 = class ThreeBlackCrows extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'ThreeBlackCrows';
	    this.requiredCount = 3;
	    this.scale = scale;
	  }
	  logic(data) {
	    let firstdaysOpen = data.open[0];
	    let firstdaysClose = data.close[0];
	    data.high[0];
	    let firstdaysLow = data.low[0];
	    let seconddaysOpen = data.open[1];
	    let seconddaysClose = data.close[1];
	    data.high[1];
	    let seconddaysLow = data.low[1];
	    let thirddaysOpen = data.open[2];
	    let thirddaysClose = data.close[2];
	    data.high[2];
	    let thirddaysLow = data.low[2];
	    let isDownTrend = firstdaysLow > seconddaysLow && seconddaysLow > thirddaysLow;
	    let isAllBearish = firstdaysOpen > firstdaysClose && seconddaysOpen > seconddaysClose && thirddaysOpen > thirddaysClose;
	    let doesOpenWithinPreviousBody = firstdaysOpen > seconddaysOpen && seconddaysOpen > firstdaysClose && seconddaysOpen > thirddaysOpen && thirddaysOpen > seconddaysClose;
	    return isDownTrend && isAllBearish && doesOpenWithinPreviousBody;
	  }
	};
	ThreeBlackCrows.default = ThreeBlackCrows$1;
	function threeblackcrows(data, scale = 1) {
	  return new ThreeBlackCrows$1(scale).hasPattern(data);
	}
	
	return ThreeBlackCrows;
}

var HangingMan = {};

var hasRequiredHangingMan;

function requireHangingMan () {
	if (hasRequiredHangingMan) return HangingMan;
	hasRequiredHangingMan = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(HangingMan, "__esModule", {
	  value: true
	});
	HangingMan.default = void 0;
	HangingMan.hangingman = hangingman;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	var _AverageLoss = requireAverageLoss();
	var _AverageGain = requireAverageGain();
	var _BearishHammerStick = requireBearishHammerStick();
	var _BullishHammerStick = requireBullishHammerStick();
	let HangingMan$1 = class HangingMan extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'HangingMan';
	    this.requiredCount = 5;
	    this.scale = scale;
	  }
	  logic(data) {
	    let isPattern = this.upwardTrend(data);
	    isPattern = isPattern && this.includesHammer(data);
	    isPattern = isPattern && this.hasConfirmation(data);
	    return isPattern;
	  }
	  upwardTrend(data, confirm = true) {
	    let end = confirm ? 3 : 4;
	    // Analyze trends in closing prices of the first three or four candlesticks
	    let gains = (0, _AverageGain.averagegain)({
	      values: data.close.slice(0, end),
	      period: end - 1
	    });
	    let losses = (0, _AverageLoss.averageloss)({
	      values: data.close.slice(0, end),
	      period: end - 1
	    });
	    // Upward trend, so more gains than losses
	    return gains > losses;
	  }
	  includesHammer(data, confirm = true) {
	    let start = confirm ? 3 : 4;
	    let end = confirm ? 4 : undefined;
	    let possibleHammerData = {
	      open: data.open.slice(start, end),
	      close: data.close.slice(start, end),
	      low: data.low.slice(start, end),
	      high: data.high.slice(start, end)
	    };
	    let isPattern = (0, _BearishHammerStick.bearishhammerstick)(possibleHammerData, this.scale);
	    isPattern = isPattern || (0, _BullishHammerStick.bullishhammerstick)(possibleHammerData, this.scale);
	    return isPattern;
	  }
	  hasConfirmation(data) {
	    let possibleHammer = {
	      open: data.open[3],
	      close: data.close[3],
	      low: data.low[3],
	      high: data.high[3]
	    };
	    let possibleConfirmation = {
	      open: data.open[4],
	      close: data.close[4],
	      low: data.low[4],
	      high: data.high[4]
	    };
	    // Confirmation candlestick is bearish
	    let isPattern = possibleConfirmation.open > possibleConfirmation.close;
	    return isPattern && possibleHammer.close > possibleConfirmation.close;
	  }
	};
	HangingMan.default = HangingMan$1;
	function hangingman(data, scale = 1) {
	  return new HangingMan$1(scale).hasPattern(data);
	}
	
	return HangingMan;
}

var HangingManUnconfirmed = {};

var hasRequiredHangingManUnconfirmed;

function requireHangingManUnconfirmed () {
	if (hasRequiredHangingManUnconfirmed) return HangingManUnconfirmed;
	hasRequiredHangingManUnconfirmed = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(HangingManUnconfirmed, "__esModule", {
	  value: true
	});
	HangingManUnconfirmed.default = void 0;
	HangingManUnconfirmed.hangingmanunconfirmed = hangingmanunconfirmed;
	var _HangingMan = _interopRequireDefault(requireHangingMan());
	let HangingManUnconfirmed$1 = class HangingManUnconfirmed extends _HangingMan.default {
	  constructor(scale = 1) {
	    super(scale);
	    this.name = 'HangingManUnconfirmed';
	  }
	  logic(data) {
	    let isPattern = this.upwardTrend(data, false);
	    isPattern = isPattern && this.includesHammer(data, false);
	    return isPattern;
	  }
	};
	HangingManUnconfirmed.default = HangingManUnconfirmed$1;
	function hangingmanunconfirmed(data, scale = 1) {
	  return new HangingManUnconfirmed$1(scale).hasPattern(data);
	}
	
	return HangingManUnconfirmed;
}

var ShootingStar = {};

var hasRequiredShootingStar;

function requireShootingStar () {
	if (hasRequiredShootingStar) return ShootingStar;
	hasRequiredShootingStar = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(ShootingStar, "__esModule", {
	  value: true
	});
	ShootingStar.default = void 0;
	ShootingStar.shootingstar = shootingstar;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	var _AverageLoss = requireAverageLoss();
	var _AverageGain = requireAverageGain();
	var _BearishInvertedHammerStick = requireBearishInvertedHammerStick();
	var _BullishInvertedHammerStick = requireBullishInvertedHammerStick();
	let ShootingStar$1 = class ShootingStar extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'ShootingStar';
	    this.requiredCount = 5;
	    this.scale = scale;
	  }
	  logic(data) {
	    let isPattern = this.upwardTrend(data);
	    isPattern = isPattern && this.includesHammer(data);
	    isPattern = isPattern && this.hasConfirmation(data);
	    return isPattern;
	  }
	  upwardTrend(data, confirm = true) {
	    let end = confirm ? 3 : 4;
	    // Analyze trends in closing prices of the first three or four candlesticks
	    let gains = (0, _AverageGain.averagegain)({
	      values: data.close.slice(0, end),
	      period: end - 1
	    });
	    let losses = (0, _AverageLoss.averageloss)({
	      values: data.close.slice(0, end),
	      period: end - 1
	    });
	    // Upward trend, so more gains than losses
	    return gains > losses;
	  }
	  includesHammer(data, confirm = true) {
	    let start = confirm ? 3 : 4;
	    let end = confirm ? 4 : undefined;
	    let possibleHammerData = {
	      open: data.open.slice(start, end),
	      close: data.close.slice(start, end),
	      low: data.low.slice(start, end),
	      high: data.high.slice(start, end)
	    };
	    let isPattern = (0, _BearishInvertedHammerStick.bearishinvertedhammerstick)(possibleHammerData, this.scale);
	    isPattern = isPattern || (0, _BullishInvertedHammerStick.bullishinvertedhammerstick)(possibleHammerData, this.scale);
	    return isPattern;
	  }
	  hasConfirmation(data) {
	    let possibleHammer = {
	      open: data.open[3],
	      close: data.close[3],
	      low: data.low[3],
	      high: data.high[3]
	    };
	    let possibleConfirmation = {
	      open: data.open[4],
	      close: data.close[4],
	      low: data.low[4],
	      high: data.high[4]
	    };
	    // Confirmation candlestick is bearish
	    let isPattern = possibleConfirmation.open > possibleConfirmation.close;
	    return isPattern && possibleHammer.close > possibleConfirmation.close;
	  }
	};
	ShootingStar.default = ShootingStar$1;
	function shootingstar(data, scale = 1) {
	  return new ShootingStar$1(scale).hasPattern(data);
	}
	
	return ShootingStar;
}

var ShootingStarUnconfirmed = {};

var hasRequiredShootingStarUnconfirmed;

function requireShootingStarUnconfirmed () {
	if (hasRequiredShootingStarUnconfirmed) return ShootingStarUnconfirmed;
	hasRequiredShootingStarUnconfirmed = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(ShootingStarUnconfirmed, "__esModule", {
	  value: true
	});
	ShootingStarUnconfirmed.default = void 0;
	ShootingStarUnconfirmed.shootingstarunconfirmed = shootingstarunconfirmed;
	var _ShootingStar = _interopRequireDefault(requireShootingStar());
	let ShootingStarUnconfirmed$1 = class ShootingStarUnconfirmed extends _ShootingStar.default {
	  constructor(scale = 1) {
	    super(scale);
	    this.name = 'ShootingStarUnconfirmed';
	  }
	  logic(data) {
	    let isPattern = this.upwardTrend(data, false);
	    isPattern = isPattern && this.includesHammer(data, false);
	    return isPattern;
	  }
	};
	ShootingStarUnconfirmed.default = ShootingStarUnconfirmed$1;
	function shootingstarunconfirmed(data, scale = 1) {
	  return new ShootingStarUnconfirmed$1(scale).hasPattern(data);
	}
	
	return ShootingStarUnconfirmed;
}

var TweezerTop = {};

var hasRequiredTweezerTop;

function requireTweezerTop () {
	if (hasRequiredTweezerTop) return TweezerTop;
	hasRequiredTweezerTop = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(TweezerTop, "__esModule", {
	  value: true
	});
	TweezerTop.default = void 0;
	TweezerTop.tweezertop = tweezertop;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	var _AverageLoss = requireAverageLoss();
	var _AverageGain = requireAverageGain();
	let TweezerTop$1 = class TweezerTop extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'TweezerTop';
	    this.requiredCount = 5;
	    this.scale = scale;
	  }
	  logic(data) {
	    return this.upwardTrend(data) && this.approximateEqual(data.high[3], data.high[4]);
	  }
	  upwardTrend(data) {
	    // Analyze trends in closing prices of the first three or four candlesticks
	    let gains = (0, _AverageGain.averagegain)({
	      values: data.close.slice(0, 3),
	      period: 2
	    });
	    let losses = (0, _AverageLoss.averageloss)({
	      values: data.close.slice(0, 3),
	      period: 2
	    });
	    // Upward trend, so more gains than losses
	    return gains > losses;
	  }
	};
	TweezerTop.default = TweezerTop$1;
	function tweezertop(data, scale = 1) {
	  return new TweezerTop$1(scale).hasPattern(data);
	}
	
	return TweezerTop;
}

var hasRequiredBearish;

function requireBearish () {
	if (hasRequiredBearish) return Bearish;
	hasRequiredBearish = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(Bearish, "__esModule", {
	  value: true
	});
	Bearish.bearish = bearish;
	Bearish.default = void 0;
	var _BearishEngulfingPattern = _interopRequireDefault(requireBearishEngulfingPattern());
	var _BearishHarami = _interopRequireDefault(requireBearishHarami());
	var _BearishHaramiCross = _interopRequireDefault(requireBearishHaramiCross());
	var _EveningDojiStar = _interopRequireDefault(requireEveningDojiStar());
	var _EveningStar = _interopRequireDefault(requireEveningStar());
	var _BearishMarubozu = _interopRequireDefault(requireBearishMarubozu());
	var _ThreeBlackCrows = _interopRequireDefault(requireThreeBlackCrows());
	var _BearishHammerStick = _interopRequireDefault(requireBearishHammerStick());
	var _BearishInvertedHammerStick = _interopRequireDefault(requireBearishInvertedHammerStick());
	var _HangingMan = _interopRequireDefault(requireHangingMan());
	var _HangingManUnconfirmed = _interopRequireDefault(requireHangingManUnconfirmed());
	var _ShootingStar = _interopRequireDefault(requireShootingStar());
	var _ShootingStarUnconfirmed = _interopRequireDefault(requireShootingStarUnconfirmed());
	var _TweezerTop = _interopRequireDefault(requireTweezerTop());
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	class BearishPatterns extends _CandlestickFinder.default {
	  bearishPatterns;
	  constructor(scale = 1) {
	    super();
	    this.name = 'Bearish Candlesticks';
	    this.scale = scale;
	    this.bearishPatterns = [new _BearishEngulfingPattern.default(scale), new _BearishHarami.default(scale), new _BearishHaramiCross.default(scale), new _EveningDojiStar.default(scale), new _EveningStar.default(scale), new _BearishMarubozu.default(scale), new _ThreeBlackCrows.default(scale), new _BearishHammerStick.default(scale), new _BearishInvertedHammerStick.default(scale), new _HangingMan.default(scale), new _HangingManUnconfirmed.default(scale), new _ShootingStar.default(scale), new _ShootingStarUnconfirmed.default(scale), new _TweezerTop.default(scale)];
	  }
	  hasPattern(data) {
	    return this.bearishPatterns.reduce(function (state, pattern) {
	      return state || pattern.hasPattern(data);
	    }, false);
	  }
	}
	Bearish.default = BearishPatterns;
	function bearish(data, scale = 1) {
	  return new BearishPatterns(scale).hasPattern(data);
	}
	
	return Bearish;
}

var AbandonedBaby = {};

var hasRequiredAbandonedBaby;

function requireAbandonedBaby () {
	if (hasRequiredAbandonedBaby) return AbandonedBaby;
	hasRequiredAbandonedBaby = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(AbandonedBaby, "__esModule", {
	  value: true
	});
	AbandonedBaby.abandonedbaby = abandonedbaby;
	AbandonedBaby.default = void 0;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	var _Doji = _interopRequireDefault(requireDoji());
	let AbandonedBaby$1 = class AbandonedBaby extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'AbandonedBaby';
	    this.requiredCount = 3;
	    this.scale = scale;
	  }
	  logic(data) {
	    let firstdaysOpen = data.open[0];
	    let firstdaysClose = data.close[0];
	    data.high[0];
	    let firstdaysLow = data.low[0];
	    let seconddaysOpen = data.open[1];
	    let seconddaysClose = data.close[1];
	    let seconddaysHigh = data.high[1];
	    let seconddaysLow = data.low[1];
	    let thirddaysOpen = data.open[2];
	    let thirddaysClose = data.close[2];
	    let thirddaysHigh = data.high[2];
	    let thirddaysLow = data.low[2];
	    let isFirstBearish = firstdaysClose < firstdaysOpen;
	    let dojiExists = new _Doji.default().hasPattern({
	      "open": [seconddaysOpen],
	      "close": [seconddaysClose],
	      "high": [seconddaysHigh],
	      "low": [seconddaysLow]
	    });
	    let gapExists = seconddaysHigh < firstdaysLow && thirddaysLow > seconddaysHigh && thirddaysClose > thirddaysOpen;
	    let isThirdBullish = thirddaysHigh < firstdaysOpen;
	    return isFirstBearish && dojiExists && gapExists && isThirdBullish;
	  }
	};
	AbandonedBaby.default = AbandonedBaby$1;
	function abandonedbaby(data, scale = 1) {
	  return new AbandonedBaby$1(scale).hasPattern(data);
	}
	
	return AbandonedBaby;
}

var DarkCloudCover = {};

var hasRequiredDarkCloudCover;

function requireDarkCloudCover () {
	if (hasRequiredDarkCloudCover) return DarkCloudCover;
	hasRequiredDarkCloudCover = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(DarkCloudCover, "__esModule", {
	  value: true
	});
	DarkCloudCover.darkcloudcover = darkcloudcover;
	DarkCloudCover.default = void 0;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let DarkCloudCover$1 = class DarkCloudCover extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'DarkCloudCover';
	    this.requiredCount = 2;
	    this.scale = scale;
	  }
	  logic(data) {
	    let firstdaysOpen = data.open[0];
	    let firstdaysClose = data.close[0];
	    let firstdaysHigh = data.high[0];
	    data.low[0];
	    let seconddaysOpen = data.open[1];
	    let seconddaysClose = data.close[1];
	    data.high[1];
	    data.low[1];
	    let firstdayMidpoint = (firstdaysClose + firstdaysOpen) / 2;
	    let isFirstBullish = firstdaysClose > firstdaysOpen;
	    let isSecondBearish = seconddaysClose < seconddaysOpen;
	    let isDarkCloudPattern = seconddaysOpen > firstdaysHigh && seconddaysClose < firstdayMidpoint && seconddaysClose > firstdaysOpen;
	    return isFirstBullish && isSecondBearish && isDarkCloudPattern;
	  }
	};
	DarkCloudCover.default = DarkCloudCover$1;
	function darkcloudcover(data, scale = 1) {
	  return new DarkCloudCover$1(scale).hasPattern(data);
	}
	
	return DarkCloudCover;
}

var DragonFlyDoji = {};

var hasRequiredDragonFlyDoji;

function requireDragonFlyDoji () {
	if (hasRequiredDragonFlyDoji) return DragonFlyDoji;
	hasRequiredDragonFlyDoji = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(DragonFlyDoji, "__esModule", {
	  value: true
	});
	DragonFlyDoji.default = void 0;
	DragonFlyDoji.dragonflydoji = dragonflydoji;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let DragonFlyDoji$1 = class DragonFlyDoji extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.requiredCount = 1;
	    this.name = 'DragonFlyDoji';
	    this.scale = scale;
	  }
	  logic(data) {
	    let daysOpen = data.open[0];
	    let daysClose = data.close[0];
	    let daysHigh = data.high[0];
	    let daysLow = data.low[0];
	    let isOpenEqualsClose = this.approximateEqual(daysOpen, daysClose);
	    let isHighEqualsOpen = isOpenEqualsClose && this.approximateEqual(daysOpen, daysHigh);
	    let isLowEqualsClose = isOpenEqualsClose && this.approximateEqual(daysClose, daysLow);
	    return isOpenEqualsClose && isHighEqualsOpen && !isLowEqualsClose;
	  }
	};
	DragonFlyDoji.default = DragonFlyDoji$1;
	function dragonflydoji(data, scale = 1) {
	  return new DragonFlyDoji$1(scale).hasPattern(data);
	}
	
	return DragonFlyDoji;
}

var GraveStoneDoji = {};

var hasRequiredGraveStoneDoji;

function requireGraveStoneDoji () {
	if (hasRequiredGraveStoneDoji) return GraveStoneDoji;
	hasRequiredGraveStoneDoji = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(GraveStoneDoji, "__esModule", {
	  value: true
	});
	GraveStoneDoji.default = void 0;
	GraveStoneDoji.gravestonedoji = gravestonedoji;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let GraveStoneDoji$1 = class GraveStoneDoji extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.requiredCount = 1;
	    this.name = 'GraveStoneDoji';
	    this.scale = scale;
	  }
	  logic(data) {
	    let daysOpen = data.open[0];
	    let daysClose = data.close[0];
	    let daysHigh = data.high[0];
	    let daysLow = data.low[0];
	    let isOpenEqualsClose = this.approximateEqual(daysOpen, daysClose);
	    let isHighEqualsOpen = isOpenEqualsClose && this.approximateEqual(daysOpen, daysHigh);
	    let isLowEqualsClose = isOpenEqualsClose && this.approximateEqual(daysClose, daysLow);
	    return isOpenEqualsClose && isLowEqualsClose && !isHighEqualsOpen;
	  }
	};
	GraveStoneDoji.default = GraveStoneDoji$1;
	function gravestonedoji(data, scale = 1) {
	  return new GraveStoneDoji$1(scale).hasPattern(data);
	}
	
	return GraveStoneDoji;
}

var BullishSpinningTop = {};

var hasRequiredBullishSpinningTop;

function requireBullishSpinningTop () {
	if (hasRequiredBullishSpinningTop) return BullishSpinningTop;
	hasRequiredBullishSpinningTop = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(BullishSpinningTop, "__esModule", {
	  value: true
	});
	BullishSpinningTop.bullishspinningtop = bullishspinningtop;
	BullishSpinningTop.default = void 0;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let BullishSpinningTop$1 = class BullishSpinningTop extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'BullishSpinningTop';
	    this.requiredCount = 1;
	    this.scale = scale;
	  }
	  logic(data) {
	    let daysOpen = data.open[0];
	    let daysClose = data.close[0];
	    let daysHigh = data.high[0];
	    let daysLow = data.low[0];
	    let bodyLength = Math.abs(daysClose - daysOpen);
	    let upperShadowLength = Math.abs(daysHigh - daysClose);
	    let lowerShadowLength = Math.abs(daysOpen - daysLow);
	    let isBullishSpinningTop = bodyLength < upperShadowLength && bodyLength < lowerShadowLength;
	    return isBullishSpinningTop;
	  }
	};
	BullishSpinningTop.default = BullishSpinningTop$1;
	function bullishspinningtop(data, scale = 1) {
	  return new BullishSpinningTop$1(scale).hasPattern(data);
	}
	
	return BullishSpinningTop;
}

var BearishSpinningTop = {};

var hasRequiredBearishSpinningTop;

function requireBearishSpinningTop () {
	if (hasRequiredBearishSpinningTop) return BearishSpinningTop;
	hasRequiredBearishSpinningTop = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(BearishSpinningTop, "__esModule", {
	  value: true
	});
	BearishSpinningTop.bearishspinningtop = bearishspinningtop;
	BearishSpinningTop.default = void 0;
	var _CandlestickFinder = _interopRequireDefault(requireCandlestickFinder());
	let BearishSpinningTop$1 = class BearishSpinningTop extends _CandlestickFinder.default {
	  constructor(scale = 1) {
	    super();
	    this.name = 'BearishSpinningTop';
	    this.requiredCount = 1;
	    this.scale = scale;
	  }
	  logic(data) {
	    let daysOpen = data.open[0];
	    let daysClose = data.close[0];
	    let daysHigh = data.high[0];
	    let daysLow = data.low[0];
	    let bodyLength = Math.abs(daysClose - daysOpen);
	    let upperShadowLength = Math.abs(daysHigh - daysOpen);
	    let lowerShadowLength = Math.abs(daysHigh - daysLow);
	    let isBearishSpinningTop = bodyLength < upperShadowLength && bodyLength < lowerShadowLength;
	    return isBearishSpinningTop;
	  }
	};
	BearishSpinningTop.default = BearishSpinningTop$1;
	function bearishspinningtop(data, scale = 1) {
	  return new BearishSpinningTop$1(scale).hasPattern(data);
	}
	
	return BearishSpinningTop;
}

var fibonacci = {};

var hasRequiredFibonacci;

function requireFibonacci () {
	if (hasRequiredFibonacci) return fibonacci;
	hasRequiredFibonacci = 1;

	Object.defineProperty(fibonacci, "__esModule", {
	  value: true
	});
	fibonacci.fibonacciretracement = fibonacciretracement;
	/**
	 * Calcaultes the fibonacci retracements for given start and end points
	 * 
	 * If calculating for up trend start should be low and end should be high and vice versa
	 * 
	 * returns an array of retracements level containing [0 , 23.6, 38.2, 50, 61.8, 78.6, 100, 127.2, 161.8, 261.8, 423.6] 
	 * 
	 * @export
	 * @param {number} start
	 * @param {number} end
	 * @returns {number[]}
	 */
	function fibonacciretracement(start, end) {
	  let levels = [0, 23.6, 38.2, 50, 61.8, 78.6, 100, 127.2, 161.8, 261.8, 423.6];
	  let retracements;
	  if (start < end) {
	    retracements = levels.map(function (level) {
	      let calculated = end - Math.abs(start - end) * level / 100;
	      return calculated > 0 ? calculated : 0;
	    });
	  } else {
	    retracements = levels.map(function (level) {
	      let calculated = end + Math.abs(start - end) * level / 100;
	      return calculated > 0 ? calculated : 0;
	    });
	  }
	  return retracements;
	}
	
	return fibonacci;
}

var IchimokuCloud = {};

var hasRequiredIchimokuCloud;

function requireIchimokuCloud () {
	if (hasRequiredIchimokuCloud) return IchimokuCloud;
	hasRequiredIchimokuCloud = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(IchimokuCloud, "__esModule", {
	  value: true
	});
	IchimokuCloud.IchimokuCloudOutput = IchimokuCloud.IchimokuCloudInput = IchimokuCloud.IchimokuCloud = void 0;
	IchimokuCloud.ichimokucloud = ichimokucloud;
	var _indicator = requireIndicator();
	var _FixedSizeLinkedList = _interopRequireDefault(requireFixedSizeLinkedList());
	class IchimokuCloudInput extends _indicator.IndicatorInput {
	  high;
	  low;
	  conversionPeriod = 9;
	  basePeriod = 26;
	  spanPeriod = 52;
	  displacement = 26;
	}
	IchimokuCloud.IchimokuCloudInput = IchimokuCloudInput;
	class IchimokuCloudOutput {
	  conversion;
	  base;
	  spanA;
	  spanB;
	}
	IchimokuCloud.IchimokuCloudOutput = IchimokuCloudOutput;
	let IchimokuCloud$1 = class IchimokuCloud extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    this.result = [];
	    var defaults = {
	      conversionPeriod: 9,
	      basePeriod: 26,
	      spanPeriod: 52,
	      displacement: 26
	    };
	    var params = Object.assign({}, defaults, input);
	    var currentConversionData = new _FixedSizeLinkedList.default(params.conversionPeriod * 2, true, true, false);
	    var currentBaseData = new _FixedSizeLinkedList.default(params.basePeriod * 2, true, true, false);
	    var currenSpanData = new _FixedSizeLinkedList.default(params.spanPeriod * 2, true, true, false);
	    this.generator = function* () {
	      let result;
	      let tick;
	      let period = Math.max(params.conversionPeriod, params.basePeriod, params.spanPeriod, params.displacement);
	      let periodCounter = 1;
	      tick = yield;
	      while (true) {
	        // Keep a list of lows/highs for the max period
	        currentConversionData.push(tick.high);
	        currentConversionData.push(tick.low);
	        currentBaseData.push(tick.high);
	        currentBaseData.push(tick.low);
	        currenSpanData.push(tick.high);
	        currenSpanData.push(tick.low);
	        if (periodCounter < period) {
	          periodCounter++;
	        } else {
	          // Tenkan-sen (ConversionLine): (9-period high + 9-period low)/2))
	          let conversionLine = (currentConversionData.periodHigh + currentConversionData.periodLow) / 2;

	          // Kijun-sen (Base Line): (26-period high + 26-period low)/2))
	          let baseLine = (currentBaseData.periodHigh + currentBaseData.periodLow) / 2;

	          // Senkou Span A (Leading Span A): (Conversion Line + Base Line)/2))
	          let spanA = (conversionLine + baseLine) / 2;

	          // Senkou Span B (Leading Span B): (52-period high + 52-period low)/2))
	          let spanB = (currenSpanData.periodHigh + currenSpanData.periodLow) / 2;

	          // Senkou Span A / Senkou Span B offset by 26 periods
	          // if(spanCounter < params.displacement) {
	          // 	spanCounter++
	          // } else {
	          // 	spanA = spanAs.shift()
	          // 	spanB = spanBs.shift()
	          // }

	          result = {
	            conversion: conversionLine,
	            base: baseLine,
	            spanA: spanA,
	            spanB: spanB
	          };
	        }
	        tick = yield result;
	      }
	    }();
	    this.generator.next();
	    input.low.forEach((tick, index) => {
	      var result = this.generator.next({
	        high: input.high[index],
	        low: input.low[index]
	      });
	      if (result.value) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = ichimokucloud;
	  nextValue(price) {
	    return this.generator.next(price).value;
	  }
	};
	IchimokuCloud.IchimokuCloud = IchimokuCloud$1;
	function ichimokucloud(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new IchimokuCloud$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return IchimokuCloud;
}

var KeltnerChannels = {};

var hasRequiredKeltnerChannels;

function requireKeltnerChannels () {
	if (hasRequiredKeltnerChannels) return KeltnerChannels;
	hasRequiredKeltnerChannels = 1;

	Object.defineProperty(KeltnerChannels, "__esModule", {
	  value: true
	});
	KeltnerChannels.KeltnerChannelsOutput = KeltnerChannels.KeltnerChannelsInput = KeltnerChannels.KeltnerChannels = void 0;
	KeltnerChannels.keltnerchannels = keltnerchannels;
	var _indicator = requireIndicator();
	var _SMA = requireSMA();
	var _EMA = requireEMA();
	var _ATR = requireATR();
	class KeltnerChannelsInput extends _indicator.IndicatorInput {
	  maPeriod = 20;
	  atrPeriod = 10;
	  useSMA = false;
	  multiplier = 1;
	  high;
	  low;
	  close;
	}
	KeltnerChannels.KeltnerChannelsInput = KeltnerChannelsInput;
	class KeltnerChannelsOutput extends _indicator.IndicatorInput {
	  middle;
	  upper;
	  lower;
	}
	KeltnerChannels.KeltnerChannelsOutput = KeltnerChannelsOutput;
	let KeltnerChannels$1 = class KeltnerChannels extends _indicator.Indicator {
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    var maType = input.useSMA ? _SMA.SMA : _EMA.EMA;
	    var maProducer = new maType({
	      period: input.maPeriod,
	      values: [],
	      format: v => {
	        return v;
	      }
	    });
	    var atrProducer = new _ATR.ATR({
	      period: input.atrPeriod,
	      high: [],
	      low: [],
	      close: [],
	      format: v => {
	        return v;
	      }
	    });
	    var tick;
	    this.result = [];
	    this.generator = function* () {
	      var result;
	      tick = yield;
	      while (true) {
	        var {
	          close
	        } = tick;
	        var ma = maProducer.nextValue(close);
	        var atr = atrProducer.nextValue(tick);
	        if (ma != undefined && atr != undefined) {
	          result = {
	            middle: ma,
	            upper: ma + input.multiplier * atr,
	            lower: ma - input.multiplier * atr
	          };
	        }
	        tick = yield result;
	      }
	    }();
	    this.generator.next();
	    var highs = input.high;
	    highs.forEach((tickHigh, index) => {
	      var tickInput = {
	        high: tickHigh,
	        low: input.low[index],
	        close: input.close[index]
	      };
	      var result = this.generator.next(tickInput);
	      if (result.value != undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = keltnerchannels;
	  nextValue(price) {
	    var result = this.generator.next(price);
	    if (result.value != undefined) {
	      return result.value;
	    }
	  }
	};
	KeltnerChannels.KeltnerChannels = KeltnerChannels$1;
	function keltnerchannels(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new KeltnerChannels$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return KeltnerChannels;
}

var ChandelierExit = {};

var hasRequiredChandelierExit;

function requireChandelierExit () {
	if (hasRequiredChandelierExit) return ChandelierExit;
	hasRequiredChandelierExit = 1;

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(ChandelierExit, "__esModule", {
	  value: true
	});
	ChandelierExit.ChandelierExitOutput = ChandelierExit.ChandelierExitInput = ChandelierExit.ChandelierExit = void 0;
	ChandelierExit.chandelierexit = chandelierexit;
	var _indicator = requireIndicator();
	var _ATR = requireATR();
	var _FixedSizeLinkedList = _interopRequireDefault(requireFixedSizeLinkedList());
	class ChandelierExitInput extends _indicator.IndicatorInput {
	  period = 22;
	  multiplier = 3;
	  high;
	  low;
	  close;
	}
	ChandelierExit.ChandelierExitInput = ChandelierExitInput;
	class ChandelierExitOutput extends _indicator.IndicatorInput {
	  exitLong;
	  exitShort;
	}
	ChandelierExit.ChandelierExitOutput = ChandelierExitOutput;
	let ChandelierExit$1 = class ChandelierExit extends _indicator.Indicator {
	  generator;
	  constructor(input) {
	    super(input);
	    var highs = input.high;
	    var lows = input.low;
	    var closes = input.close;
	    this.result = [];
	    var atrProducer = new _ATR.ATR({
	      period: input.period,
	      high: [],
	      low: [],
	      close: [],
	      format: v => {
	        return v;
	      }
	    });
	    var dataCollector = new _FixedSizeLinkedList.default(input.period * 2, true, true, false);
	    this.generator = function* () {
	      var result;
	      var tick = yield;
	      var atr;
	      while (true) {
	        var {
	          high,
	          low
	        } = tick;
	        dataCollector.push(high);
	        dataCollector.push(low);
	        atr = atrProducer.nextValue(tick);
	        if (dataCollector.totalPushed >= 2 * input.period && atr != undefined) {
	          result = {
	            exitLong: dataCollector.periodHigh - atr * input.multiplier,
	            exitShort: dataCollector.periodLow + atr * input.multiplier
	          };
	        }
	        tick = yield result;
	      }
	    }();
	    this.generator.next();
	    highs.forEach((tickHigh, index) => {
	      var tickInput = {
	        high: tickHigh,
	        low: lows[index],
	        close: closes[index]
	      };
	      var result = this.generator.next(tickInput);
	      if (result.value != undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = chandelierexit;
	  nextValue(price) {
	    var result = this.generator.next(price);
	    if (result.value != undefined) {
	      return result.value;
	    }
	  }
	};
	ChandelierExit.ChandelierExit = ChandelierExit$1;
	function chandelierexit(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new ChandelierExit$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return ChandelierExit;
}

var CrossUp = {};

var hasRequiredCrossUp;

function requireCrossUp () {
	if (hasRequiredCrossUp) return CrossUp;
	hasRequiredCrossUp = 1;

	Object.defineProperty(CrossUp, "__esModule", {
	  value: true
	});
	CrossUp.CrossUp = CrossUp.CrossInput = void 0;
	CrossUp.crossUp = crossUp;
	var _indicator = requireIndicator();
	class CrossInput extends _indicator.IndicatorInput {
	  constructor(lineA, lineB) {
	    super();
	    this.lineA = lineA;
	    this.lineB = lineB;
	  }
	}
	CrossUp.CrossInput = CrossInput;
	let CrossUp$1 = class CrossUp extends _indicator.Indicator {
	  lineA;
	  lineB;
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    this.lineA = input.lineA;
	    this.lineB = input.lineB;
	    var currentLineA = [];
	    var currentLineB = [];
	    const genFn = function* () {
	      var current = yield;
	      var result = false;
	      while (true) {
	        currentLineA.unshift(current.valueA);
	        currentLineB.unshift(current.valueB);
	        result = current.valueA > current.valueB;
	        var pointer = 1;
	        while (result === true && currentLineA[pointer] >= currentLineB[pointer]) {
	          if (currentLineA[pointer] > currentLineB[pointer]) {
	            result = false;
	          } else if (currentLineA[pointer] < currentLineB[pointer]) {
	            result = true;
	          } else if (currentLineA[pointer] === currentLineB[pointer]) {
	            pointer += 1;
	          }
	        }
	        if (result === true) {
	          currentLineA = [current.valueA];
	          currentLineB = [current.valueB];
	        }
	        current = yield result;
	      }
	    };
	    this.generator = genFn();
	    this.generator.next();
	    this.result = [];
	    this.lineA.forEach((value, index) => {
	      var result = this.generator.next({
	        valueA: this.lineA[index],
	        valueB: this.lineB[index]
	      });
	      if (result.value !== undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = crossUp;
	  static reverseInputs(input) {
	    if (input.reversedInput) {
	      input.lineA ? input.lineA.reverse() : undefined;
	      input.lineB ? input.lineB.reverse() : undefined;
	    }
	  }
	  nextValue(valueA, valueB) {
	    return this.generator.next({
	      valueA: valueA,
	      valueB: valueB
	    }).value;
	  }
	};
	CrossUp.CrossUp = CrossUp$1;
	function crossUp(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new CrossUp$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return CrossUp;
}

var CrossDown = {};

var hasRequiredCrossDown;

function requireCrossDown () {
	if (hasRequiredCrossDown) return CrossDown;
	hasRequiredCrossDown = 1;

	Object.defineProperty(CrossDown, "__esModule", {
	  value: true
	});
	CrossDown.CrossInput = CrossDown.CrossDown = void 0;
	CrossDown.crossDown = crossDown;
	var _indicator = requireIndicator();
	class CrossInput extends _indicator.IndicatorInput {
	  constructor(lineA, lineB) {
	    super();
	    this.lineA = lineA;
	    this.lineB = lineB;
	  }
	}
	CrossDown.CrossInput = CrossInput;
	let CrossDown$1 = class CrossDown extends _indicator.Indicator {
	  lineA;
	  lineB;
	  result;
	  generator;
	  constructor(input) {
	    super(input);
	    this.lineA = input.lineA;
	    this.lineB = input.lineB;
	    var currentLineA = [];
	    var currentLineB = [];
	    const genFn = function* () {
	      var current = yield;
	      var result = false;
	      while (true) {
	        currentLineA.unshift(current.valueA);
	        currentLineB.unshift(current.valueB);
	        result = current.valueA < current.valueB;
	        var pointer = 1;
	        while (result === true && currentLineA[pointer] <= currentLineB[pointer]) {
	          if (currentLineA[pointer] < currentLineB[pointer]) {
	            result = false;
	          } else if (currentLineA[pointer] > currentLineB[pointer]) {
	            result = true;
	          } else if (currentLineA[pointer] === currentLineB[pointer]) {
	            pointer += 1;
	          }
	        }
	        if (result === true) {
	          currentLineA = [current.valueA];
	          currentLineB = [current.valueB];
	        }
	        current = yield result;
	      }
	    };
	    this.generator = genFn();
	    this.generator.next();
	    this.result = [];
	    this.lineA.forEach((value, index) => {
	      var result = this.generator.next({
	        valueA: this.lineA[index],
	        valueB: this.lineB[index]
	      });
	      if (result.value !== undefined) {
	        this.result.push(result.value);
	      }
	    });
	  }
	  static calculate = crossDown;
	  static reverseInputs(input) {
	    if (input.reversedInput) {
	      input.lineA ? input.lineA.reverse() : undefined;
	      input.lineB ? input.lineB.reverse() : undefined;
	    }
	  }
	  nextValue(valueA, valueB) {
	    return this.generator.next({
	      valueA: valueA,
	      valueB: valueB
	    }).value;
	  }
	};
	CrossDown.CrossDown = CrossDown$1;
	function crossDown(input) {
	  _indicator.Indicator.reverseInputs(input);
	  var result = new CrossDown$1(input).result;
	  if (input.reversedInput) {
	    result.reverse();
	  }
	  _indicator.Indicator.reverseInputs(input);
	  return result;
	}
	
	return CrossDown;
}

(function (exports) {

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	Object.defineProperty(exports, "ADL", {
	  enumerable: true,
	  get: function () {
	    return _ADL.ADL;
	  }
	});
	Object.defineProperty(exports, "ADX", {
	  enumerable: true,
	  get: function () {
	    return _ADX.ADX;
	  }
	});
	Object.defineProperty(exports, "ATR", {
	  enumerable: true,
	  get: function () {
	    return _ATR.ATR;
	  }
	});
	Object.defineProperty(exports, "AverageGain", {
	  enumerable: true,
	  get: function () {
	    return _AverageGain.AverageGain;
	  }
	});
	Object.defineProperty(exports, "AverageLoss", {
	  enumerable: true,
	  get: function () {
	    return _AverageLoss.AverageLoss;
	  }
	});
	Object.defineProperty(exports, "AwesomeOscillator", {
	  enumerable: true,
	  get: function () {
	    return _AwesomeOscillator.AwesomeOscillator;
	  }
	});
	Object.defineProperty(exports, "BollingerBands", {
	  enumerable: true,
	  get: function () {
	    return _BollingerBands.BollingerBands;
	  }
	});
	Object.defineProperty(exports, "CCI", {
	  enumerable: true,
	  get: function () {
	    return _CCI.CCI;
	  }
	});
	Object.defineProperty(exports, "CandleData", {
	  enumerable: true,
	  get: function () {
	    return _StockData.CandleData;
	  }
	});
	Object.defineProperty(exports, "CandleList", {
	  enumerable: true,
	  get: function () {
	    return _StockData.CandleList;
	  }
	});
	Object.defineProperty(exports, "ChandelierExit", {
	  enumerable: true,
	  get: function () {
	    return _ChandelierExit.ChandelierExit;
	  }
	});
	Object.defineProperty(exports, "ChandelierExitInput", {
	  enumerable: true,
	  get: function () {
	    return _ChandelierExit.ChandelierExitInput;
	  }
	});
	Object.defineProperty(exports, "ChandelierExitOutput", {
	  enumerable: true,
	  get: function () {
	    return _ChandelierExit.ChandelierExitOutput;
	  }
	});
	Object.defineProperty(exports, "CrossDown", {
	  enumerable: true,
	  get: function () {
	    return _CrossDown.CrossDown;
	  }
	});
	Object.defineProperty(exports, "CrossUp", {
	  enumerable: true,
	  get: function () {
	    return _CrossUp.CrossUp;
	  }
	});
	Object.defineProperty(exports, "EMA", {
	  enumerable: true,
	  get: function () {
	    return _EMA.EMA;
	  }
	});
	Object.defineProperty(exports, "FixedSizeLinkedList", {
	  enumerable: true,
	  get: function () {
	    return _FixedSizeLinkedList.default;
	  }
	});
	Object.defineProperty(exports, "ForceIndex", {
	  enumerable: true,
	  get: function () {
	    return _ForceIndex.ForceIndex;
	  }
	});
	Object.defineProperty(exports, "HeikinAshi", {
	  enumerable: true,
	  get: function () {
	    return _HeikinAshi.HeikinAshi;
	  }
	});
	Object.defineProperty(exports, "Highest", {
	  enumerable: true,
	  get: function () {
	    return _Highest.Highest;
	  }
	});
	Object.defineProperty(exports, "IchimokuCloud", {
	  enumerable: true,
	  get: function () {
	    return _IchimokuCloud.IchimokuCloud;
	  }
	});
	Object.defineProperty(exports, "KST", {
	  enumerable: true,
	  get: function () {
	    return _KST.KST;
	  }
	});
	Object.defineProperty(exports, "KeltnerChannels", {
	  enumerable: true,
	  get: function () {
	    return _KeltnerChannels.KeltnerChannels;
	  }
	});
	Object.defineProperty(exports, "KeltnerChannelsInput", {
	  enumerable: true,
	  get: function () {
	    return _KeltnerChannels.KeltnerChannelsInput;
	  }
	});
	Object.defineProperty(exports, "KeltnerChannelsOutput", {
	  enumerable: true,
	  get: function () {
	    return _KeltnerChannels.KeltnerChannelsOutput;
	  }
	});
	Object.defineProperty(exports, "Lowest", {
	  enumerable: true,
	  get: function () {
	    return _Lowest.Lowest;
	  }
	});
	Object.defineProperty(exports, "MACD", {
	  enumerable: true,
	  get: function () {
	    return _MACD.MACD;
	  }
	});
	Object.defineProperty(exports, "MFI", {
	  enumerable: true,
	  get: function () {
	    return _MFI.MFI;
	  }
	});
	Object.defineProperty(exports, "OBV", {
	  enumerable: true,
	  get: function () {
	    return _OBV.OBV;
	  }
	});
	Object.defineProperty(exports, "PSAR", {
	  enumerable: true,
	  get: function () {
	    return _PSAR.PSAR;
	  }
	});
	Object.defineProperty(exports, "ROC", {
	  enumerable: true,
	  get: function () {
	    return _ROC.ROC;
	  }
	});
	Object.defineProperty(exports, "RSI", {
	  enumerable: true,
	  get: function () {
	    return _RSI.RSI;
	  }
	});
	Object.defineProperty(exports, "SD", {
	  enumerable: true,
	  get: function () {
	    return _SD.SD;
	  }
	});
	Object.defineProperty(exports, "SMA", {
	  enumerable: true,
	  get: function () {
	    return _SMA.SMA;
	  }
	});
	Object.defineProperty(exports, "Stochastic", {
	  enumerable: true,
	  get: function () {
	    return _Stochastic.Stochastic;
	  }
	});
	Object.defineProperty(exports, "StochasticRSI", {
	  enumerable: true,
	  get: function () {
	    return _StochasticRSI.StochasticRSI;
	  }
	});
	Object.defineProperty(exports, "Sum", {
	  enumerable: true,
	  get: function () {
	    return _Sum.Sum;
	  }
	});
	Object.defineProperty(exports, "TRIX", {
	  enumerable: true,
	  get: function () {
	    return _TRIX.TRIX;
	  }
	});
	Object.defineProperty(exports, "TrueRange", {
	  enumerable: true,
	  get: function () {
	    return _TrueRange.TrueRange;
	  }
	});
	Object.defineProperty(exports, "VWAP", {
	  enumerable: true,
	  get: function () {
	    return _VWAP.VWAP;
	  }
	});
	Object.defineProperty(exports, "VolumeProfile", {
	  enumerable: true,
	  get: function () {
	    return _VolumeProfile.VolumeProfile;
	  }
	});
	Object.defineProperty(exports, "WEMA", {
	  enumerable: true,
	  get: function () {
	    return _WEMA.WEMA;
	  }
	});
	Object.defineProperty(exports, "WMA", {
	  enumerable: true,
	  get: function () {
	    return _WMA.WMA;
	  }
	});
	Object.defineProperty(exports, "WilliamsR", {
	  enumerable: true,
	  get: function () {
	    return _WilliamsR.WilliamsR;
	  }
	});
	Object.defineProperty(exports, "abandonedbaby", {
	  enumerable: true,
	  get: function () {
	    return _AbandonedBaby.abandonedbaby;
	  }
	});
	Object.defineProperty(exports, "adl", {
	  enumerable: true,
	  get: function () {
	    return _ADL.adl;
	  }
	});
	Object.defineProperty(exports, "adx", {
	  enumerable: true,
	  get: function () {
	    return _ADX.adx;
	  }
	});
	Object.defineProperty(exports, "atr", {
	  enumerable: true,
	  get: function () {
	    return _ATR.atr;
	  }
	});
	Object.defineProperty(exports, "averagegain", {
	  enumerable: true,
	  get: function () {
	    return _AverageGain.averagegain;
	  }
	});
	Object.defineProperty(exports, "averageloss", {
	  enumerable: true,
	  get: function () {
	    return _AverageLoss.averageloss;
	  }
	});
	Object.defineProperty(exports, "awesomeoscillator", {
	  enumerable: true,
	  get: function () {
	    return _AwesomeOscillator.awesomeoscillator;
	  }
	});
	Object.defineProperty(exports, "bearish", {
	  enumerable: true,
	  get: function () {
	    return _Bearish.bearish;
	  }
	});
	Object.defineProperty(exports, "bearishengulfingpattern", {
	  enumerable: true,
	  get: function () {
	    return _BearishEngulfingPattern.bearishengulfingpattern;
	  }
	});
	Object.defineProperty(exports, "bearishhammerstick", {
	  enumerable: true,
	  get: function () {
	    return _BearishHammerStick.bearishhammerstick;
	  }
	});
	Object.defineProperty(exports, "bearishharami", {
	  enumerable: true,
	  get: function () {
	    return _BearishHarami.bearishharami;
	  }
	});
	Object.defineProperty(exports, "bearishharamicross", {
	  enumerable: true,
	  get: function () {
	    return _BearishHaramiCross.bearishharamicross;
	  }
	});
	Object.defineProperty(exports, "bearishinvertedhammerstick", {
	  enumerable: true,
	  get: function () {
	    return _BearishInvertedHammerStick.bearishinvertedhammerstick;
	  }
	});
	Object.defineProperty(exports, "bearishmarubozu", {
	  enumerable: true,
	  get: function () {
	    return _BearishMarubozu.bearishmarubozu;
	  }
	});
	Object.defineProperty(exports, "bearishspinningtop", {
	  enumerable: true,
	  get: function () {
	    return _BearishSpinningTop.bearishspinningtop;
	  }
	});
	Object.defineProperty(exports, "bollingerbands", {
	  enumerable: true,
	  get: function () {
	    return _BollingerBands.bollingerbands;
	  }
	});
	Object.defineProperty(exports, "bullish", {
	  enumerable: true,
	  get: function () {
	    return _Bullish.bullish;
	  }
	});
	Object.defineProperty(exports, "bullishengulfingpattern", {
	  enumerable: true,
	  get: function () {
	    return _BullishEngulfingPattern.bullishengulfingpattern;
	  }
	});
	Object.defineProperty(exports, "bullishhammerstick", {
	  enumerable: true,
	  get: function () {
	    return _BullishHammerStick.bullishhammerstick;
	  }
	});
	Object.defineProperty(exports, "bullishharami", {
	  enumerable: true,
	  get: function () {
	    return _BullishHarami.bullishharami;
	  }
	});
	Object.defineProperty(exports, "bullishharamicross", {
	  enumerable: true,
	  get: function () {
	    return _BullishHaramiCross.bullishharamicross;
	  }
	});
	Object.defineProperty(exports, "bullishinvertedhammerstick", {
	  enumerable: true,
	  get: function () {
	    return _BullishInvertedHammerStick.bullishinvertedhammerstick;
	  }
	});
	Object.defineProperty(exports, "bullishmarubozu", {
	  enumerable: true,
	  get: function () {
	    return _BullishMarubozu.bullishmarubozu;
	  }
	});
	Object.defineProperty(exports, "bullishspinningtop", {
	  enumerable: true,
	  get: function () {
	    return _BullishSpinningTop.bullishspinningtop;
	  }
	});
	Object.defineProperty(exports, "cci", {
	  enumerable: true,
	  get: function () {
	    return _CCI.cci;
	  }
	});
	Object.defineProperty(exports, "chandelierexit", {
	  enumerable: true,
	  get: function () {
	    return _ChandelierExit.chandelierexit;
	  }
	});
	Object.defineProperty(exports, "crossDown", {
	  enumerable: true,
	  get: function () {
	    return _CrossDown.crossDown;
	  }
	});
	Object.defineProperty(exports, "crossUp", {
	  enumerable: true,
	  get: function () {
	    return _CrossUp.crossUp;
	  }
	});
	Object.defineProperty(exports, "darkcloudcover", {
	  enumerable: true,
	  get: function () {
	    return _DarkCloudCover.darkcloudcover;
	  }
	});
	Object.defineProperty(exports, "doji", {
	  enumerable: true,
	  get: function () {
	    return _Doji.doji;
	  }
	});
	Object.defineProperty(exports, "downsidetasukigap", {
	  enumerable: true,
	  get: function () {
	    return _DownsideTasukiGap.downsidetasukigap;
	  }
	});
	Object.defineProperty(exports, "dragonflydoji", {
	  enumerable: true,
	  get: function () {
	    return _DragonFlyDoji.dragonflydoji;
	  }
	});
	Object.defineProperty(exports, "ema", {
	  enumerable: true,
	  get: function () {
	    return _EMA.ema;
	  }
	});
	Object.defineProperty(exports, "eveningdojistar", {
	  enumerable: true,
	  get: function () {
	    return _EveningDojiStar.eveningdojistar;
	  }
	});
	Object.defineProperty(exports, "eveningstar", {
	  enumerable: true,
	  get: function () {
	    return _EveningStar.eveningstar;
	  }
	});
	Object.defineProperty(exports, "fibonacciretracement", {
	  enumerable: true,
	  get: function () {
	    return _fibonacci.fibonacciretracement;
	  }
	});
	Object.defineProperty(exports, "forceindex", {
	  enumerable: true,
	  get: function () {
	    return _ForceIndex.forceindex;
	  }
	});
	Object.defineProperty(exports, "getConfig", {
	  enumerable: true,
	  get: function () {
	    return _config.getConfig;
	  }
	});
	Object.defineProperty(exports, "gravestonedoji", {
	  enumerable: true,
	  get: function () {
	    return _GraveStoneDoji.gravestonedoji;
	  }
	});
	Object.defineProperty(exports, "hammerpattern", {
	  enumerable: true,
	  get: function () {
	    return _HammerPattern.hammerpattern;
	  }
	});
	Object.defineProperty(exports, "hammerpatternunconfirmed", {
	  enumerable: true,
	  get: function () {
	    return _HammerPatternUnconfirmed.hammerpatternunconfirmed;
	  }
	});
	Object.defineProperty(exports, "hangingman", {
	  enumerable: true,
	  get: function () {
	    return _HangingMan.hangingman;
	  }
	});
	Object.defineProperty(exports, "hangingmanunconfirmed", {
	  enumerable: true,
	  get: function () {
	    return _HangingManUnconfirmed.hangingmanunconfirmed;
	  }
	});
	Object.defineProperty(exports, "heikinashi", {
	  enumerable: true,
	  get: function () {
	    return _HeikinAshi.heikinashi;
	  }
	});
	Object.defineProperty(exports, "highest", {
	  enumerable: true,
	  get: function () {
	    return _Highest.highest;
	  }
	});
	Object.defineProperty(exports, "ichimokucloud", {
	  enumerable: true,
	  get: function () {
	    return _IchimokuCloud.ichimokucloud;
	  }
	});
	Object.defineProperty(exports, "keltnerchannels", {
	  enumerable: true,
	  get: function () {
	    return _KeltnerChannels.keltnerchannels;
	  }
	});
	Object.defineProperty(exports, "kst", {
	  enumerable: true,
	  get: function () {
	    return _KST.kst;
	  }
	});
	Object.defineProperty(exports, "lowest", {
	  enumerable: true,
	  get: function () {
	    return _Lowest.lowest;
	  }
	});
	Object.defineProperty(exports, "macd", {
	  enumerable: true,
	  get: function () {
	    return _MACD.macd;
	  }
	});
	Object.defineProperty(exports, "mfi", {
	  enumerable: true,
	  get: function () {
	    return _MFI.mfi;
	  }
	});
	Object.defineProperty(exports, "morningdojistar", {
	  enumerable: true,
	  get: function () {
	    return _MorningDojiStar.morningdojistar;
	  }
	});
	Object.defineProperty(exports, "morningstar", {
	  enumerable: true,
	  get: function () {
	    return _MorningStar.morningstar;
	  }
	});
	Object.defineProperty(exports, "obv", {
	  enumerable: true,
	  get: function () {
	    return _OBV.obv;
	  }
	});
	Object.defineProperty(exports, "piercingline", {
	  enumerable: true,
	  get: function () {
	    return _PiercingLine.piercingline;
	  }
	});
	Object.defineProperty(exports, "psar", {
	  enumerable: true,
	  get: function () {
	    return _PSAR.psar;
	  }
	});
	Object.defineProperty(exports, "renko", {
	  enumerable: true,
	  get: function () {
	    return _Renko.renko;
	  }
	});
	Object.defineProperty(exports, "roc", {
	  enumerable: true,
	  get: function () {
	    return _ROC.roc;
	  }
	});
	Object.defineProperty(exports, "rsi", {
	  enumerable: true,
	  get: function () {
	    return _RSI.rsi;
	  }
	});
	Object.defineProperty(exports, "sd", {
	  enumerable: true,
	  get: function () {
	    return _SD.sd;
	  }
	});
	Object.defineProperty(exports, "setConfig", {
	  enumerable: true,
	  get: function () {
	    return _config.setConfig;
	  }
	});
	Object.defineProperty(exports, "shootingstar", {
	  enumerable: true,
	  get: function () {
	    return _ShootingStar.shootingstar;
	  }
	});
	Object.defineProperty(exports, "shootingstarunconfirmed", {
	  enumerable: true,
	  get: function () {
	    return _ShootingStarUnconfirmed.shootingstarunconfirmed;
	  }
	});
	Object.defineProperty(exports, "sma", {
	  enumerable: true,
	  get: function () {
	    return _SMA.sma;
	  }
	});
	Object.defineProperty(exports, "stochastic", {
	  enumerable: true,
	  get: function () {
	    return _Stochastic.stochastic;
	  }
	});
	Object.defineProperty(exports, "stochasticrsi", {
	  enumerable: true,
	  get: function () {
	    return _StochasticRSI.stochasticrsi;
	  }
	});
	Object.defineProperty(exports, "sum", {
	  enumerable: true,
	  get: function () {
	    return _Sum.sum;
	  }
	});
	Object.defineProperty(exports, "threeblackcrows", {
	  enumerable: true,
	  get: function () {
	    return _ThreeBlackCrows.threeblackcrows;
	  }
	});
	Object.defineProperty(exports, "threewhitesoldiers", {
	  enumerable: true,
	  get: function () {
	    return _ThreeWhiteSoldiers.threewhitesoldiers;
	  }
	});
	Object.defineProperty(exports, "trix", {
	  enumerable: true,
	  get: function () {
	    return _TRIX.trix;
	  }
	});
	Object.defineProperty(exports, "truerange", {
	  enumerable: true,
	  get: function () {
	    return _TrueRange.truerange;
	  }
	});
	Object.defineProperty(exports, "tweezerbottom", {
	  enumerable: true,
	  get: function () {
	    return _TweezerBottom.tweezerbottom;
	  }
	});
	Object.defineProperty(exports, "tweezertop", {
	  enumerable: true,
	  get: function () {
	    return _TweezerTop.tweezertop;
	  }
	});
	Object.defineProperty(exports, "volumeprofile", {
	  enumerable: true,
	  get: function () {
	    return _VolumeProfile.volumeprofile;
	  }
	});
	Object.defineProperty(exports, "vwap", {
	  enumerable: true,
	  get: function () {
	    return _VWAP.vwap;
	  }
	});
	Object.defineProperty(exports, "wema", {
	  enumerable: true,
	  get: function () {
	    return _WEMA.wema;
	  }
	});
	Object.defineProperty(exports, "williamsr", {
	  enumerable: true,
	  get: function () {
	    return _WilliamsR.williamsr;
	  }
	});
	Object.defineProperty(exports, "wma", {
	  enumerable: true,
	  get: function () {
	    return _WMA.wma;
	  }
	});
	var _FixedSizeLinkedList = _interopRequireDefault(requireFixedSizeLinkedList());
	var _StockData = requireStockData();
	var _SMA = requireSMA();
	var _EMA = requireEMA();
	var _WMA = requireWMA();
	var _WEMA = requireWEMA();
	var _MACD = requireMACD();
	var _RSI = requireRSI();
	var _BollingerBands = requireBollingerBands();
	var _ADX = requireADX();
	var _ATR = requireATR();
	var _TrueRange = requireTrueRange();
	var _ROC = requireROC();
	var _KST = requireKST();
	var _PSAR = requirePSAR();
	var _Stochastic = requireStochastic();
	var _WilliamsR = requireWilliamsR();
	var _ADL = requireADL();
	var _OBV = requireOBV();
	var _TRIX = requireTRIX();
	var _ForceIndex = requireForceIndex();
	var _CCI = requireCCI();
	var _AwesomeOscillator = requireAwesomeOscillator();
	var _VWAP = requireVWAP();
	var _VolumeProfile = requireVolumeProfile();
	var _MFI = requireMFI();
	var _StochasticRSI = requireStochasticRSI();
	var _AverageGain = requireAverageGain();
	var _AverageLoss = requireAverageLoss();
	var _SD = requireSD();
	var _Highest = requireHighest();
	var _Lowest = requireLowest();
	var _Sum = requireSum();
	var _Renko = requireRenko();
	var _HeikinAshi = requireHeikinAshi();
	var _Bullish = requireBullish();
	var _Bearish = requireBearish();
	var _AbandonedBaby = requireAbandonedBaby();
	var _Doji = requireDoji();
	var _BearishEngulfingPattern = requireBearishEngulfingPattern();
	var _BullishEngulfingPattern = requireBullishEngulfingPattern();
	var _DarkCloudCover = requireDarkCloudCover();
	var _DownsideTasukiGap = requireDownsideTasukiGap();
	var _DragonFlyDoji = requireDragonFlyDoji();
	var _GraveStoneDoji = requireGraveStoneDoji();
	var _BullishHarami = requireBullishHarami();
	var _BearishHarami = requireBearishHarami();
	var _BullishHaramiCross = requireBullishHaramiCross();
	var _BearishHaramiCross = requireBearishHaramiCross();
	var _EveningDojiStar = requireEveningDojiStar();
	var _EveningStar = requireEveningStar();
	var _MorningDojiStar = requireMorningDojiStar();
	var _MorningStar = requireMorningStar();
	var _BullishMarubozu = requireBullishMarubozu();
	var _BearishMarubozu = requireBearishMarubozu();
	var _PiercingLine = requirePiercingLine();
	var _BullishSpinningTop = requireBullishSpinningTop();
	var _BearishSpinningTop = requireBearishSpinningTop();
	var _ThreeBlackCrows = requireThreeBlackCrows();
	var _ThreeWhiteSoldiers = requireThreeWhiteSoldiers();
	var _BullishHammerStick = requireBullishHammerStick();
	var _BearishHammerStick = requireBearishHammerStick();
	var _BullishInvertedHammerStick = requireBullishInvertedHammerStick();
	var _BearishInvertedHammerStick = requireBearishInvertedHammerStick();
	var _HammerPattern = requireHammerPattern();
	var _HammerPatternUnconfirmed = requireHammerPatternUnconfirmed();
	var _HangingMan = requireHangingMan();
	var _HangingManUnconfirmed = requireHangingManUnconfirmed();
	var _ShootingStar = requireShootingStar();
	var _ShootingStarUnconfirmed = requireShootingStarUnconfirmed();
	var _TweezerTop = requireTweezerTop();
	var _TweezerBottom = requireTweezerBottom();
	var _fibonacci = requireFibonacci();
	var _IchimokuCloud = requireIchimokuCloud();
	var _KeltnerChannels = requireKeltnerChannels();
	var _ChandelierExit = requireChandelierExit();
	var _CrossUp = requireCrossUp();
	var _CrossDown = requireCrossDown();
	var _config = requireConfig();
	
} (lib));

var index = /*@__PURE__*/getDefaultExportFromCjs(lib);

module.exports = index;
//# sourceMappingURL=index.js.map

[![CI/CD Pipeline](https://github.com/thuantan2060/technicalindicators/actions/workflows/ci-cd.yml/badge.svg?branch=master&event=push)](https://github.com/thuantan2060/technicalindicators/actions/workflows/ci-cd.yml)

# TechnicalIndicators

A javascript technical indicators written in typescript.


# Installation

## Node.js versions >= 16

``` bash
npm install --save @thuantan2060/technicalindicators
```

``` javascript
const SMA = require('@thuantan2060/technicalindicators').SMA;
```

## Webpack

Make sure you have the following in your config file.

``` javascript
module.exports = {
  resolve: {
    mainFields: ["module", "main"]
  }
}

```

## Browser

For browsers install using npm, 

For ES6 browsers use

``` bash
npm install --save @thuantan2060/technicalindicators
```

```html
<script src="node_modules/@thuantan2060/technicalindicators/dist/browser.es6.js"></script>
```

For ES5 support it is necessary to include the babel-polyfill and respective file browser.js otherwise you will get an error. For example see [index.html](https://github.com/thuantan2060/technicalindicators/blob/master/index.html "index.html")

``` bash
npm install --save @thuantan2060/technicalindicators
npm install --save babel-polyfill
```

``` html
<script src="node_modules/babel-polyfill/browser.js"></script>
<script src="node_modules/@thuantan2060/technicalindicators/dist/browser.js"></script>
```

# Recent Improvements (v4.0.0)

This version includes significant improvements to build quality, testing coverage, cross-platform compatibility, and **security**:

## 🔒 **Security Enhancements**
- **Resolved all npm audit vulnerabilities**: Fixed 31 security vulnerabilities (8 moderate, 20 high, 3 critical)
- **Updated vulnerable dependencies**: Replaced outdated packages with secure alternatives
- **Replaced vulnerable draw-candlestick with ApexCharts**: Eliminated d3-color ReDoS vulnerability while maintaining test functionality
- **Modern dependency versions**: Updated to latest secure versions of Babel, TypeScript, Rollup, and testing tools
- **Zero security vulnerabilities**: Clean npm audit with no remaining security issues

## 🏗️ **Enhanced Build System**
- **Fixed npm publish issues**: Resolved TypeScript declaration generation, Babel configuration, and rollup bundling problems
- **Improved dist bundle**: The `dist/index.js` file now properly includes all 122+ technical indicators (increased from 4KB to 212KB)
- **Dual API support**: Both function syntax (`sma()`) and class syntax (`SMA.calculate()`) work correctly
- **Cross-platform builds**: Added robust Node.js script for TypeScript definitions generation with Windows/Linux/macOS compatibility
- **Replaced vulnerable tools**: Switched from `dts-bundle` to secure `dts-bundle-generator`

## 🧪 **Comprehensive Testing**
- **Expanded test coverage**: Tests now cover all indicator categories with 188 test cases (up from just 2)
- **Full indicator coverage**: Includes tests for:
  - All 25+ technical indicators (RSI, MACD, SMA, EMA, Bollinger Bands, etc.)
  - 33+ candlestick patterns (Doji, Hammer, Engulfing patterns, etc.)
  - Oscillators (Stochastic, Williams %R, CCI, etc.)
  - Volume indicators (OBV, MFI, Force Index, VWAP, etc.)
  - Volatility indicators (ATR, Bollinger Bands)
  - Momentum indicators (PSAR, ROC, KST, etc.)
  - Chart types (Renko, Heikin-Ashi)
  - Utility functions (CrossUp, CrossDown, Highest, Lowest, etc.)

## 🔧 **Developer Experience**
- **Improved build scripts**: Enhanced error handling and cross-platform compatibility
- **Better validation**: Added build validation scripts to ensure package integrity
- **Enhanced exports**: Fixed `getAvailableIndicators()` function export for discovering all available indicators
- **Robust TypeScript**: Fixed compilation errors and improved type definitions
- **Secure dependencies**: All development dependencies updated to latest secure versions

## 📈 **Performance & Reliability**
- **Optimized bundling**: Improved rollup configuration for better tree-shaking and smaller bundles
- **Fixed dependencies**: Resolved circular dependency issues and cleaned up invalid references
- **Better error handling**: Enhanced build process with fallback mechanisms and informative error messages
- **Future-proof**: Updated to modern toolchain ensuring long-term security and maintenance

### Pattern detection

Pattern detection is removed from version 3.0, if you need pattern detection use v2.0

All indicators will be available in window object. So you can just use

``` javascript
sma({period : 5, values : [1,2,3,4,5,6,7,8,9], reversedInput : true});
```

or

``` javascript
SMA.calculate({period : 5, values : [1,2,3,4,5,6,7,8,9]});
```

# Playground

[Playground with code completion](http://thuantan2060.github.io/technicalindicators/ "Playground")

# Crypto Trading hub

If you like this project. You'll love my other project [crypto trading hub](https://cryptotrading-hub.com/?utm_source=github&utm_medium=readme&utm_campaign=technicalindicators "Crypto trading hub")

1. Its free
1. Realtime price charts 
1. Unified trading experience across exchanges
1. Price alerts
1. Realtime crypto screening using javascript (Find coins making high and low in realtime or anything you can write using this library and javascript in realtime)
1. Trading from charts, 
1. Modify orders and ability to trade and create studies using javascript.

![Home](/images/home.png)
![Screener](/images/screener.png)
![Trade](/images/trade.png)

# Available Indicators

1. [Accumulation Distribution Line (ADL)](https://tonicdev.com/anandaravindan/adl "ADL").
1. [Average Directional Index (ADX)](https://github.com/thuantan2060/technicalindicators/blob/master/test/directionalmovement/ADX.js "ADX").
1. [Average True Range (ATR)](https://tonicdev.com/anandaravindan/atr "ATR").
1. [Awesome Oscillator (AO)](https://github.com/thuantan2060/technicalindicators/blob/master/test/oscillators/AwesomeOscillator.js "AO").
1. [Bollinger Bands (BB)](https://tonicdev.com/anandaravindan/bb "BB").
1. [Commodity Channel Index (CCI)](https://github.com/thuantan2060/technicalindicators/blob/master/test/oscillators/CCI.js "CCI").
1. [Force Index (FI)](https://github.com/thuantan2060/technicalindicators/blob/master/test/volume/ForceIndex.js "FI").
1. [Know Sure Thing (KST)](https://tonicdev.com/anandaravindan/kst "KST").
1. [Moneyflow Index (MFI)](https://github.com/thuantan2060/technicalindicators/blob/master/test/volume/MFI.js "MFI").
1. [Moving Average Convergence Divergence (MACD)](https://tonicdev.com/anandaravindan/macd "MACD").
1. [On Balance Volume (OBV)](https://tonicdev.com/anandaravindan/obv "OBV").
1. [Parabolic Stop and Reverse (PSAR)](https://github.com/thuantan2060/technicalindicators/blob/master/test/momentum/PSAR.js "PSAR").
1. [Rate of Change (ROC)](https://tonicdev.com/anandaravindan/roc "ROC").
1. [Relative Strength Index (RSI)](https://tonicdev.com/anandaravindan/rsi "RSI").
1. [Simple Moving Average (SMA)](https://tonicdev.com/anandaravindan/sma "SMA").
1. [Stochastic Oscillator (KD)](https://tonicdev.com/anandaravindan/stochastic "KD").
1. [Stochastic RSI (StochRSI)](https://tonicdev.com/anandaravindan/stochasticrsi "StochRSI").
1. [Triple Exponentially Smoothed Average (TRIX)](https://tonicdev.com/anandaravindan/trix "TRIX").
1. [Typical Price](https://github.com/thuantan2060/technicalindicators/blob/master/test/chart_types/TypicalPrice.js "Typical Price").
1. [Volume Weighted Average Price (VWAP)](https://github.com/thuantan2060/technicalindicators/blob/master/test/volume/VWAP.js "VWAP").
1. [Volume Profile (VP)](https://github.com/thuantan2060/technicalindicators/blob/master/test/volume/VolumeProfile.js "VP").
1. [Exponential Moving Average (EMA)](https://tonicdev.com/anandaravindan/ema "EMA").
1. [Weighted Moving Average (WMA)](https://tonicdev.com/anandaravindan/wma "WMA").
1. [Wilder's Smoothing (Smoothed Moving Average, WEMA)](https://tonicdev.com/anandaravindan/wema "WEMA").
1. [WilliamsR (W%R)](https://tonicdev.com/anandaravindan/williamsr "W%R").
1. [Ichimoku Cloud](https://github.com/thuantan2060/technicalindicators/blob/master/test/ichimoku/IchimokuCloud.js "Ichimoku Cloud").

# Other Utils

1. [Average Gain](https://github.com/thuantan2060/technicalindicators/blob/master/test/Utils/AverageGain.js "")
1. [Average Loss](https://github.com/thuantan2060/technicalindicators/blob/master/test/Utils/AverageLoss.js "")
1. [Cross Up](https://github.com/thuantan2060/technicalindicators/blob/master/test/Utils/CrossUp.js "")
1. [Cross Down](https://github.com/thuantan2060/technicalindicators/blob/master/test/Utils/CrossDown.js "")
1. [Cross Over](https://github.com/thuantan2060/technicalindicators/blob/master/test/Utils/CrossOver.js "")
1. [Highest](https://github.com/thuantan2060/technicalindicators/blob/master/test/Utils/Highest.js "")
1. [Lowest](https://github.com/thuantan2060/technicalindicators/blob/master/test/Utils/Lowest.js "")
1. [Standard Deviation](https://github.com/thuantan2060/technicalindicators/blob/master/test/Utils/SD.js "")
1. [Sum](https://github.com/thuantan2060/technicalindicators/blob/master/test/Utils/Sum.js "")


# Chart Types

1. [Renko (renko)](https://github.com/thuantan2060/technicalindicators/blob/master/test/chart_types/Renko.js)
1. [Heikin-Ashi (HA)](https://github.com/thuantan2060/technicalindicators/blob/master/test/chart_types/HeikinAshi.js)


# CandleStick Pattern

## Scale Parameter Configuration

All candlestick patterns support a `scale` parameter that adjusts the sensitivity of pattern detection. The scale affects the tolerance used in the `approximateEqual` function for comparing price values.

### Understanding the Scale Parameter

The scale parameter controls how "close" two prices need to be to be considered "approximately equal". This is crucial for patterns that rely on price equality comparisons.

**💡 Key Insight**: Lower scale = more sensitive (stricter matching), Higher scale = less sensitive (looser matching)

**🎯 Perfect Reference Pattern**: The **Doji pattern** is the ideal reference for understanding scale behavior because it depends entirely on the condition `open ≈ close`. When you see a Doji detected, it means the scale parameter allowed the open and close prices to be considered "approximately equal".

### How approximateEqual Works

```javascript
function approximateEqual(a, b) {
    let difference = parseFloat(Math.abs(a - b).toPrecision(4));
    return difference <= this.scale;
}
```

**Examples with different scales:**
```javascript
// With scale = 0.1 (default)
approximateEqual(100.00, 100.05) // → 0.05 ≤ 0.1 → TRUE
approximateEqual(100.00, 100.15) // → 0.15 ≤ 0.1 → FALSE

// With scale = 1.0 (daily candles)
approximateEqual(100.00, 100.50) // → 0.5 ≤ 1.0 → TRUE
approximateEqual(100.00, 101.50) // → 1.5 ≤ 1.0 → FALSE
```

### Default Scale (scale = 0.1)
The patterns are designed to work optimally with **5-15 minute candles**. The default scale of `0.1` provides balanced sensitivity for most intraday trading scenarios.

**Important**: The tolerance automatically scales with price levels, so you don't need to adjust scale based on instrument price (EURUSD vs BTCUSD vs XAUUSD vs stocks).

### Timeframe-Based Scale Recommendations

The scale should be adjusted based on **timeframe and volatility**, not price level:

**For Lower Timeframes (Higher Volatility):**
- **1-minute candles**: Use `scale = 0.01-0.05` (very sensitive)
- **5-minute candles**: Use `scale = 0.05-0.1` (sensitive)  
- **15-minute candles**: Use `scale = 0.1-0.3` (moderate)
- **1-hour candles**: Use `scale = 0.3-0.7` (balanced)

**For Higher Timeframes (Lower Volatility):**
- **4-hour candles**: Use `scale = 0.5-1.0` (relaxed)
- **Daily candles**: Use `scale = 1.0` (traditional default)
- **Weekly candles**: Use `scale = 1.5-2.0` (very relaxed)
- **Monthly candles**: Use `scale = 2.0-3.0` (extremely relaxed)

**Reasoning**: Lower timeframe candles have smaller price oscillations and require more sensitive pattern detection (lower scale). Higher timeframe candles have larger price movements and need less sensitive detection (higher scale).

### Practical Examples

#### Example 1: Doji Pattern Detection
```javascript
const { doji } = require('@thuantan2060/technicalindicators');

// Test data: open and close are very close (0.01 difference)
const testData = {
  open: [100.00],
  high: [100.20], 
  close: [100.01],  // Very small body
  low: [99.80]
};

// Different scale sensitivities
console.log(doji(testData, { scale: 0.005 })); // false - too sensitive
console.log(doji(testData, { scale: 0.01 }));  // true  - just right
console.log(doji(testData, { scale: 0.1 }));   // true  - also works
console.log(doji(testData, { scale: 1.0 }));   // true  - very tolerant
```

#### Example 2: Bullish Marubozu Pattern
```javascript
const { bullishmarubozu } = require('@thuantan2060/technicalindicators');

// Test data: small shadows that may or may not be acceptable
const testData = {
  open: [99.90],   // 0.1 difference from low
  high: [100.20],
  close: [100.10], // 0.1 difference from high  
  low: [99.80]
};

// Scale determines if small shadows are acceptable
console.log(bullishmarubozu(testData, { scale: 0.05 })); // false - shadows too big
console.log(bullishmarubozu(testData, { scale: 0.1 }));  // true  - shadows acceptable
console.log(bullishmarubozu(testData, { scale: 0.5 }));  // true  - very tolerant
```

#### Example 3: Multi-Timeframe Strategy
```javascript
const { Doji } = require('@thuantan2060/technicalindicators');

// Same price data, different timeframes require different scales
const priceData = {
  open: [100.00],
  high: [100.15], 
  close: [100.05],  // 0.05 difference
  low: [99.85]
};

// 1-minute chart (high sensitivity needed)
const doji1m = new Doji({ scale: 0.03 });
console.log(doji1m.hasPattern(priceData)); // false - too strict

// 15-minute chart (moderate sensitivity)
const doji15m = new Doji({ scale: 0.1 });
console.log(doji15m.hasPattern(priceData)); // true - balanced

// Daily chart (low sensitivity)
const dojiDaily = new Doji({ scale: 1.0 });
console.log(dojiDaily.hasPattern(priceData)); // true - very tolerant
```

### Scale vs Pattern Complexity

Different patterns use the `approximateEqual` function in different ways:

1. **Simple Equality Patterns** (Doji, Marubozu):
   - Directly compare two prices (open ≈ close, close ≈ high, etc.)
   - Scale has immediate, predictable impact

2. **Complex Multi-Condition Patterns** (Hammer, Engulfing, Stars):
   - Use multiple `approximateEqual` calls
   - Scale affects multiple conditions simultaneously
   - May have additional threshold parameters beyond scale

3. **Trend-Dependent Patterns** (Hanging Man, Shooting Star):
   - Combine price equality with trend analysis
   - Scale affects pattern recognition, not trend detection

## Advanced Threshold Configuration

**NEW**: For advanced users who need fine-grained control over pattern detection sensitivity, the library now supports both comprehensive and pattern-specific configurable thresholds.

### Pattern-Specific Threshold Interfaces (Recommended)

Each candlestick pattern now supports its own specific threshold interface that includes only the relevant parameters for that pattern. This approach provides better type safety, memory efficiency, and developer experience.

#### Available Pattern-Specific Interfaces

```typescript
// Doji patterns (Doji, DragonFly Doji, GraveStone Doji)
interface IDojiThresholds {
    bodyTolerancePercent: number;        // Default: 0.015 (1.5%)
    bodyToleranceMinimum: number;        // Default: 0.00015
    minBodyComparisonPercent: number;    // Default: 0.0001 (0.01%)
    minimumThreshold: number;            // Default: 0.0001
    absoluteMinimum: number;             // Default: 0.0001
}

// Hammer patterns (Hammer, Inverted Hammer, Bullish/Bearish Hammer)
interface IHammerThresholds {
    // Includes: IShadowThresholds + IBodyThresholds + IGeneralThresholds
    shadowSizeThresholdPercent: number;  // Default: 0.001 (0.1%)
    minShadowSizePercent: number;        // Default: 0.001 (0.1%)
    minAbsoluteShadow: number;           // Default: 0.0003
    bodyTolerancePercent: number;        // Default: 0.015 (1.5%)
    // ... and more
}

// Engulfing patterns (Bullish/Bearish Engulfing)
interface IEngulfingThresholds {
    bodyTolerancePercent: number;        // Default: 0.015 (1.5%)
    bodyToleranceMinimum: number;        // Default: 0.00015
    minBodyComparisonPercent: number;    // Default: 0.0001 (0.01%)
    minimumThreshold: number;            // Default: 0.0001
    absoluteMinimum: number;             // Default: 0.0001
}

// And many more pattern-specific interfaces...
```

#### Using Pattern-Specific Thresholds

```javascript
const { Doji } = require('@thuantan2060/technicalindicators');

// Create a Doji pattern with only relevant thresholds
const customDojiThresholds = {
    bodyTolerancePercent: 0.01,      // Tighter body tolerance (1% instead of 1.5%)
    minimumThreshold: 0.00005        // More sensitive minimum threshold
};

const sensitiveDojiPattern = new Doji(0.001, customDojiThresholds);

// Test with data
const result = sensitiveDojiPattern.hasPattern({
    open: [100.50],
    high: [100.75],
    close: [100.52],  // Very small body
    low: [100.25]
});

// Update thresholds after creation using pattern-specific methods
const dojiPattern = new Doji();
dojiPattern.setDojiThresholds({
    bodyTolerancePercent: 0.005  // Even tighter tolerance
});

// Get current pattern-specific thresholds
const currentThresholds = dojiPattern.getDojiThresholds();
console.log(currentThresholds.bodyTolerancePercent); // 0.005
```

### Legacy Comprehensive ThresholdConfig (Backward Compatible)

The original comprehensive interface is still supported for backward compatibility:

```typescript
interface ThresholdConfig {
    minimumThreshold: number;                    // Default: 0.0001
    shadowSizeThresholdPercent: number;          // Default: 0.001 (0.1% of range)
    movementThreshold: number;                   // Default: 0.001
    absoluteMinimum: number;                     // Default: 0.0001
    bodyTolerancePercent: number;                // Default: 0.015 (1.5%)
    bodyToleranceMinimum: number;                // Default: 0.00015
    minBodyComparisonPercent: number;            // Default: 0.0001 (0.01% of range)
    minShadowSizePercent: number;                // Default: 0.001 (0.1% of range)
    minAbsoluteShadow: number;                   // Default: 0.0003
    minAbsoluteUpperShadow: number;              // Default: 0.0004
    minMovementConfirmationPercent: number;      // Default: 0.01 (1%)
    minMovementConfirmationMinimum: number;      // Default: 0.0001
}
```

### Migration Guide

**Benefits of Pattern-Specific Thresholds:**
- **Memory Efficiency**: Only store thresholds relevant to each pattern
- **Type Safety**: TypeScript prevents setting irrelevant thresholds
- **Better Developer Experience**: Clear which thresholds apply to each pattern
- **Easier Maintenance**: Focused configuration per pattern type

**Migration Examples:**

```javascript
// Before (comprehensive config with many unused properties)
const doji = new Doji(0.001, {
    minimumThreshold: 0.00005,
    shadowSizeThresholdPercent: 0.0005,  // Not used by Doji
    movementThreshold: 0.001,            // Not used by Doji
    bodyTolerancePercent: 0.01,
    // ... 8 more properties that Doji doesn't use
});

// After (pattern-specific config with only relevant properties)
const doji = new Doji(0.001, {
    minimumThreshold: 0.00005,
    bodyTolerancePercent: 0.01           // Only relevant properties
});
```

### Pattern-Specific Threshold Categories

1. **Body-focused patterns** (Doji, Engulfing, Marubozu, Star, Harami, Three patterns, Piercing, Tweezer, Abandoned Baby):
   - Use `IBodyThresholds` + `IGeneralThresholds`
   - Configure body size tolerances and comparison thresholds

2. **Shadow-focused patterns** (Hammer, Spinning Top):
   - Use `IShadowThresholds` + `IBodyThresholds` + `IGeneralThresholds`
   - Configure shadow size thresholds and body relationships

3. **Movement-confirmation patterns** (Hanging Man, Shooting Star):
   - Use `IShadowThresholds` + `IMovementThresholds` + `IGeneralThresholds`
   - Configure shadow analysis and movement confirmation requirements

### Threshold Configuration Benefits

- **Market-Specific Tuning**: Adjust sensitivity for different markets (crypto vs forex vs stocks)
- **Volatility Adaptation**: Fine-tune detection for high/low volatility periods
- **Strategy Optimization**: Customize thresholds based on backtesting results
- **Precision Control**: Replace one-size-fits-all approach with targeted configuration
- **Memory Efficiency**: Only configure relevant parameters for each pattern

**Note**: Both the legacy comprehensive ThresholdConfig and new pattern-specific interfaces are fully supported. The scale parameter continues to work alongside both threshold systems for complete backward compatibility.

## Available Patterns

1. [Abandoned Baby](https://runkit.com/anandaravindan/abandoned-baby).
1. [Bearish Engulfing Pattern](https://runkit.com/aarthiaradhana/bearishengulfingpattern).
1. [Bullish Engulfiing Pattern](https://runkit.com/aarthiaradhana/bullishengulfingpattern).
1. [Dark Cloud Cover](https://runkit.com/aarthiaradhana/darkcloudcover).
1. [Downside Tasuki Gap](https://runkit.com/aarthiaradhana/downsidetasukigap).
1. [Doji](https://runkit.com/aarthiaradhana/doji).
1. [DragonFly Doji](https://runkit.com/aarthiaradhana/dragonflydoji).
1. [GraveStone Doji](https://runkit.com/aarthiaradhana/gravestonedoji).
1. [BullishHarami](https://runkit.com/aarthiaradhana/bullishharami).
1. [Bearish Harami Cross](https://runkit.com/aarthiaradhana/bearishharamicross).
1. [Bullish Harami Cross](https://runkit.com/aarthiaradhana/bullishharamicross).
1. [Bullish Marubozu](https://runkit.com/aarthiaradhana/bullishmarubozu).
1. [Bearish Marubozu](https://runkit.com/aarthiaradhana/bearishmarubozu).
1. [Evening Doji Star](https://runkit.com/aarthiaradhana/eveningdojistar).
1. [Evening Star](https://runkit.com/aarthiaradhana/eveningstar).
1. [Bearish Harami](https://runkit.com/aarthiaradhana/bearishharami).
1. [Piercing Line](https://runkit.com/aarthiaradhana/piercingline).
1. [Bullish Spinning Top](https://runkit.com/aarthiaradhana/bullishspinningtop).
1. [Bearish Spinning Top](https://runkit.com/aarthiaradhana/bearishspinningtop).
1. [Morning Doji Star](https://runkit.com/aarthiaradhana/morningdojistar).
1. [Morning Star](https://runkit.com/aarthiaradhana/morningstar).
1. [Three Black Crows](https://runkit.com/aarthiaradhana/threeblackcrows).
1. [Three White Soldiers](https://runkit.com/aarthiaradhana/threewhitesoldiers).
1. [Bullish Hammer](https://runkit.com/nerdacus/technicalindicator-bullishhammer).
1. [Bearish Hammer](https://runkit.com/nerdacus/technicalindicator-bearishhammer).
1. [Bullish Inverted Hammer](https://runkit.com/nerdacus/technicalindicator-bullishinvertedhammer).
1. [Bearish Inverted Hammer](https://runkit.com/nerdacus/technicalindicator-bearishinvertedhammer).
1. [Hammer Pattern](https://runkit.com/nerdacus/technicalindicator-hammerpattern).
1. [Hammer Pattern (Unconfirmed)](https://runkit.com/nerdacus/technicalindicator-hammerpatternunconfirmed).
1. [Hanging Man](https://runkit.com/nerdacus/technicalindicator-hangingman).
1. [Hanging Man (Unconfirmed)](https://runkit.com/nerdacus/technicalindicator-hangingmanunconfirmed).
1. [Shooting Star](https://runkit.com/nerdacus/technicalindicator-shootingstar).
1. [Shooting Star (Unconfirmed)](https://runkit.com/nerdacus/technicalindicator-shootingstarunconfirmed).
1. [Tweezer Top](https://runkit.com/nerdacus/technicalindicator-tweezertop).
1. [Tweezer Bottom](https://runkit.com/nerdacus/technicalindicator-tweezerbottom).

or

Search for all bullish or bearish using


``` javascript
var twoDayBullishInput = {
  open: [23.25,15.36],
  high: [25.10,30.87],
  close: [21.44,27.89],
  low: [20.82,14.93],
}

var bullish = require('@thuantan2060/technicalindicators').bullish;

bullish(twoDayBullishInput) //true
```


# API

There are three ways you can use to get the indicator results.

## calculate

Every indicator has a static method `calculate` which can be used to calculate the indicator without creating an object.

``` javascript
const sma = require('@thuantan2060/technicalindicators').sma;
var prices = [1,2,3,4,5,6,7,8,9,10,12,13,15];
var period = 10;
sma({period : period, values : prices})
```

or

``` javascript
const SMA = require('@thuantan2060/technicalindicators').SMA;
var prices = [1,2,3,4,5,6,7,8,9,10,12,13,15];
var period = 10;
SMA.calculate({period : period, values : prices})
```

## nextValue

`nextValue` method is used to get the next indicator value.

``` javascript
var sma = new SMA({period : period, values : []});
var results = [];
prices.forEach(price => {
  var result = sma.nextValue(price);
  if(result)
    results.push(result)
});
```

## getResult

This a merge of calculate and nextValue. The usual use case would be

1. Initialize indicator with available price value

1. Get results for initialized values

1. Use nextValue to get next indicator values for further tick.

    ``` javascript
    var sma = new SMA({period : period, values : prices});
    sma.getResult(); // [5.5, 6.6, 7.7, 8.9]
    sma.nextValue(16); // 10.1
    ```

    Note: Calling nextValue will not update getResult() value.

## getAvailableIndicators

Discover all available indicators programmatically:

``` javascript
const { getAvailableIndicators } = require('@thuantan2060/technicalindicators');
const indicators = getAvailableIndicators();

// Returns an object with all available indicators:
// {
//   functions: ['sma', 'ema', 'rsi', 'macd', ...],  // 122+ function exports
//   classes: ['SMA', 'EMA', 'RSI', 'MACD', ...]     // 122+ class exports
// }

console.log(`Available indicators: ${indicators.functions.length}`);
// Available indicators: 122

// Use any indicator dynamically
const indicatorName = 'sma';
const sma = require('@thuantan2060/technicalindicators')[indicatorName];
sma({period: 5, values: [1,2,3,4,5,6,7,8,9]});
```

### Precision

This uses regular javascript numbers, so there can be rounding errors which are negligible for a technical indicators, you can set precision by using the below config. By default there is no precision set.

  ``` javascript
  const technicalIndicators = require('@thuantan2060/technicalindicators');
  technicalIndicators.setConfig('precision', 10);
  ```

# Testing

This library includes comprehensive test coverage with 188 test cases covering all technical indicators and patterns:

## Running Tests

``` bash
# Run all tests (188 test cases)
npm test

# Run tests with coverage report
npm run cover

# Run tests in watch mode for development
npm run test:watch
```

## Test Coverage

The test suite covers:
- **Technical Indicators**: SMA, EMA, RSI, MACD, Bollinger Bands, ATR, ADX, and 15+ more
- **Candlestick Patterns**: All 33+ patterns including Doji, Hammer, Engulfing, Stars, etc.
- **Oscillators**: Stochastic, Williams %R, CCI, Awesome Oscillator, etc.
- **Volume Indicators**: OBV, MFI, Force Index, VWAP, Volume Profile, etc.
- **Volatility Indicators**: ATR, Bollinger Bands
- **Momentum Indicators**: PSAR, ROC, KST, TRIX, etc.
- **Chart Types**: Renko, Heikin-Ashi
- **Utility Functions**: CrossUp, CrossDown, Highest, Lowest, Standard Deviation, etc.

## Validation

``` bash
# Validate build artifacts and package integrity
npm run validate

# Run linting
npm run lint
```


# Contribute

Create issues about anything you want to report, change of API's, or request for adding new indicators. You can also create pull request with new indicators.

## Setup

``` bash
git clone git@github.com:thuantan2060/technicalindicators.git  # or use your fork
cd technicalindicators
npm run start
```

## Building and Validation

``` bash
# Build all artifacts (lib, dist, declarations)
npm run build

# Individual build steps
npm run build:babel    # Build ES modules to lib/
npm run build:rollup   # Build UMD bundle to dist/
npm run generateDts    # Generate TypeScript declarations

# Validate package integrity
npm run validate

# Clean build artifacts
npm run clean
```

The build process creates:
- `lib/`: ES modules for modern bundlers (20KB)
- `dist/`: UMD bundle for browsers and older environments (212KB)
- `declarations/`: TypeScript definition files (4.8KB)

## Running tests and getting coverage

``` bash
npm test
npm run cover
```

## Adding new indicators

1. Add tests for the indicator and make them pass.  
   (It would be better if a sample of the stockcharts excel is used for the test case.)
1. Add the indicator to the `index.js` and `src/index.ts`
1. Run build scripts: `npm run build-lib && npm run generateDts && npm run start`
1. Add it to `README.md`, with the link to the runkit url containing the sample.
1. Add indicator it to keywords in `package.json` and `bower.json`
1. Send a Pull Request.


## Verify Documentation

``` bash
node testdocs.js
open "http://localhost:5444/testdocs.html"
```
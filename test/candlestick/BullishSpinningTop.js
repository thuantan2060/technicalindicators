var BullishSpinningTop =
    require("../../lib/candlestick/BullishSpinningTop").default;
var assert = require("assert");
var { drawCandleStick } = require("../helpers/test-helper");
var fs = require("fs");
const { scales } = require("chart.js");

// Valid BullishSpinningTop - Original test case
var validBullishSpinningTop = {
    open: [3300.17], // Bullish: 3300.17 -> 3320.145
    high: [3345.496], // Upper shadow: 3345.496 - 3320.145 = 25.351
    close: [3320.145], // Body: 3320.145 - 3300.17 = 19.975
    low: [3279.276], // Lower shadow: 3300.17 - 3279.276 = 20.894
};

// Valid BullishSpinningTop - Another valid case with longer shadows
var validBullishSpinningTop2 = {
    open: [15.3],
    high: [16.5], // Upper shadow: 1.20
    close: [15.8], // Body: 0.50
    low: [14.6], // Lower shadow: 0.70
};

// Invalid - Bearish candle (close < open)
var bearishCandle = {
    open: [20.62],
    high: [20.75],
    close: [20.5], // close < open = bearish
    low: [20.34],
};

// Invalid - Body too large compared to shadows
var largeBodaySmallShadows = {
    open: [20.2],
    high: [20.85], // Upper shadow: 0.05
    close: [20.8], // Body: 0.60
    low: [20.15], // Lower shadow: 0.05
};

// Invalid - Upper shadow too small
var smallUpperShadow = {
    open: [20.4],
    high: [20.65], // Upper shadow: 0.05
    close: [20.6], // Body: 0.20
    low: [20.1], // Lower shadow: 0.30
};

// Invalid - Lower shadow too small
var smallLowerShadow = {
    open: [20.4],
    high: [20.9], // Upper shadow: 0.30
    close: [20.6], // Body: 0.20
    low: [20.35], // Lower shadow: 0.05
};

// Edge case - Doji-like (very small body)
var dojiLikeBullish = {
    open: [20.6],
    high: [20.85], // Upper shadow: 0.24
    close: [20.61], // Body: 0.01 (very small)
    low: [20.35], // Lower shadow: 0.25
};

// Valid - Larger price range
var largePriceRange = {
    open: [99.8],
    high: [102.0], // Upper shadow: 1.50
    close: [100.5], // Body: 0.70
    low: [98.5], // Lower shadow: 1.30
};

// Invalid - High less than open/close (invalid OHLC)
var invalidOHLC = {
    open: [20.6],
    high: [20.5], // Invalid: high < open
    close: [20.7],
    low: [20.4],
};

describe("BullishSpinningTop : ", function () {
    before(function () {
        var imageBuffer = drawCandleStick(validBullishSpinningTop);
        fs.writeFileSync(
            __dirname + "/images/BullishSpinningTop.svg",
            imageBuffer
        );

        var imageBuffer2 = drawCandleStick(validBullishSpinningTop2);
        fs.writeFileSync(
            __dirname + "/images/BullishSpinningTop2.svg",
            imageBuffer2
        );

        var imageBufferLarge = drawCandleStick(largePriceRange);
        fs.writeFileSync(
            __dirname + "/images/BullishSpinningTopLarge.svg",
            imageBufferLarge
        );
    });

    // Positive test cases
    it("Check whether the supplied data has BullishSpinningTop pattern", function () {
        var bullishSpinningTop = new BullishSpinningTop({ maxBodyLength: 20 });
        var result = bullishSpinningTop.hasPattern(validBullishSpinningTop);
        assert.deepEqual(result, true, "Invalid result for BullishSpinningTop");
    });

    it("Should identify valid BullishSpinningTop with longer shadows", function () {
        var bullishSpinningTop = new BullishSpinningTop();
        var result = bullishSpinningTop.hasPattern(validBullishSpinningTop2);
        assert.deepEqual(
            result,
            true,
            "Should identify valid BullishSpinningTop with longer shadows"
        );
    });

    it("Should identify valid BullishSpinningTop with larger price range", function () {
        var bullishSpinningTop = new BullishSpinningTop();
        var result = bullishSpinningTop.hasPattern(largePriceRange);
        assert.deepEqual(
            result,
            true,
            "Should identify valid BullishSpinningTop with larger price range"
        );
    });

    it("Should identify doji-like bullish pattern as spinning top", function () {
        var bullishSpinningTop = new BullishSpinningTop();
        var result = bullishSpinningTop.hasPattern(dojiLikeBullish);
        assert.deepEqual(
            result,
            true,
            "Should identify doji-like bullish pattern as spinning top"
        );
    });

    // Negative test cases
    it("Should return false for bearish candle", function () {
        var bullishSpinningTop = new BullishSpinningTop();
        var result = bullishSpinningTop.hasPattern(bearishCandle);
        assert.deepEqual(
            result,
            false,
            "Should return false for bearish candle (close < open)"
        );
    });

    it("Should return false when body is too large compared to shadows", function () {
        var bullishSpinningTop = new BullishSpinningTop();
        var result = bullishSpinningTop.hasPattern(largeBodaySmallShadows);
        assert.deepEqual(
            result,
            false,
            "Should return false when body is larger than shadows"
        );
    });

    it("Should return false when upper shadow is too small", function () {
        var bullishSpinningTop = new BullishSpinningTop();
        var result = bullishSpinningTop.hasPattern(smallUpperShadow);
        assert.deepEqual(
            result,
            false,
            "Should return false when upper shadow is smaller than body"
        );
    });

    it("Should return false when lower shadow is too small", function () {
        var bullishSpinningTop = new BullishSpinningTop();
        var result = bullishSpinningTop.hasPattern(smallLowerShadow);
        assert.deepEqual(
            result,
            false,
            "Should return false when lower shadow is smaller than body"
        );
    });

    it("Should return false for invalid OHLC data", function () {
        var bullishSpinningTop = new BullishSpinningTop();
        var result = bullishSpinningTop.hasPattern(invalidOHLC);
        assert.deepEqual(
            result,
            false,
            "Should return false for invalid OHLC data"
        );
    });

    // Test with scale parameter
    it("Should work with custom scale parameter", function () {
        var bullishSpinningTop = new BullishSpinningTop({ maxBodyLength: 20 });
        var result = bullishSpinningTop.hasPattern(validBullishSpinningTop);
        assert.deepEqual(
            result,
            true,
            "Should work with custom scale parameter"
        );
    });

    // Test function export
    it("Should work using function export", function () {
        var bullishspinningtop =
            require("../../lib/candlestick/BullishSpinningTop").bullishspinningtop;
        var result = bullishspinningtop(validBullishSpinningTop, {
            maxBodyLength: 20,
        });
        assert.deepEqual(result, true, "Should work using function export");
    });

    // Test insufficient data
    it("Should return false for insufficient data", function () {
        var bullishSpinningTop = new BullishSpinningTop();
        var emptyData = { open: [], high: [], close: [], low: [] };
        var result = bullishSpinningTop.hasPattern(emptyData);
        assert.deepEqual(result, false, "Should return false for empty data");
    });
});

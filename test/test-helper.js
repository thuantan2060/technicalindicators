// Test helper to handle optional dependencies gracefully
let drawCandleStick;

try {
  drawCandleStick = require('draw-candlestick');
} catch (error) {
  console.warn('draw-candlestick is not available. Image generation will be skipped.');
  // Mock function that returns empty buffer
  drawCandleStick = () => Buffer.alloc(0);
}

module.exports = {
  drawCandleStick
}; 
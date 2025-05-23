"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfig = getConfig;
exports.setConfig = setConfig;
let config = {};
function setConfig(key, value) {
  config[key] = value;
}
function getConfig(key) {
  return config[key];
}
//# sourceMappingURL=config.js.map
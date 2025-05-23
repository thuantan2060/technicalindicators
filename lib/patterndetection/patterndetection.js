"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PatternDetectorOutput = exports.PatternDetectorInput = exports.PatternDetector = exports.AvailablePatterns = void 0;
exports.hasDoubleBottom = hasDoubleBottom;
exports.hasDoubleTop = hasDoubleTop;
exports.hasHeadAndShoulder = hasHeadAndShoulder;
exports.hasInverseHeadAndShoulder = hasInverseHeadAndShoulder;
exports.isTrendingDown = isTrendingDown;
exports.isTrendingUp = isTrendingUp;
exports.predictPattern = predictPattern;
var _indicator = require("../indicator/indicator");
// import * as tf from '@tensorflow/tfjs';

var isNodeEnvironment = false;
var model;
var oneHotMap = ['IHS', 'TU', 'DB', 'HS', 'TD', 'DT'];
var tf;
try {
  isNodeEnvironment = Object.prototype.toString.call(global.process) === '[object process]';
} catch (e) {}
class PatternDetectorInput extends _indicator.IndicatorInput {
  constructor(values) {
    super();
    this.values = values;
  }
}
exports.PatternDetectorInput = PatternDetectorInput;
let AvailablePatterns = exports.AvailablePatterns = /*#__PURE__*/function (AvailablePatterns) {
  AvailablePatterns[AvailablePatterns["IHS"] = 0] = "IHS";
  AvailablePatterns[AvailablePatterns["TU"] = 1] = "TU";
  AvailablePatterns[AvailablePatterns["DB"] = 2] = "DB";
  AvailablePatterns[AvailablePatterns["HS"] = 3] = "HS";
  AvailablePatterns[AvailablePatterns["TD"] = 4] = "TD";
  AvailablePatterns[AvailablePatterns["DT"] = 5] = "DT";
  return AvailablePatterns;
}({});
function interpolateArray(data, fitCount) {
  var linearInterpolate = function (before, after, atPoint) {
    return before + (after - before) * atPoint;
  };
  var newData = new Array();
  var springFactor = new Number((data.length - 1) / (fitCount - 1));
  newData[0] = data[0]; // for new allocation
  for (var i = 1; i < fitCount - 1; i++) {
    var tmp = i * springFactor;
    var before = new Number(Math.floor(tmp)).toFixed();
    var after = new Number(Math.ceil(tmp)).toFixed();
    var atPoint = tmp - before;
    newData[i] = linearInterpolate(data[before], data[after], atPoint);
  }
  newData[fitCount - 1] = data[data.length - 1]; // for new allocation
  return newData;
}
;
function l2Normalize(arr) {
  var sum = arr.reduce((cum, value) => {
    return cum + value * value;
  }, 0);
  var norm = Math.sqrt(sum);
  return arr.map(v => v / norm);
}
class PatternDetectorOutput {
  patternId;
  pattern;
  probability;
}
exports.PatternDetectorOutput = PatternDetectorOutput;
var modelLoaded = false;
var laodingModel = false;
var loadingPromise;
async function loadModel() {
  if (modelLoaded) return Promise.resolve(true);
  if (laodingModel) return loadingPromise;
  laodingModel = true;
  loadingPromise = new Promise(async function (resolve, reject) {
    if (isNodeEnvironment) {
      tf = require('@tensorflow/tfjs');
      console.log('Nodejs Environment detected ');
      var tfnode = require('@tensorflow/tfjs-node');
      var modelPath = require('path').resolve(__dirname, '../tf_model/model.json');
      model = await tf.loadModel(tfnode.io.fileSystem(modelPath));
    } else {
      if (typeof window.tf == "undefined") {
        modelLoaded = false;
        laodingModel = false;
        console.log('Tensorflow js not imported, pattern detection may not work');
        resolve();
        return;
      }
      tf = window.tf;
      console.log('Browser Environment detected ', tf);
      console.log('Loading model ....');
      model = await tf.loadModel('/tf_model/model.json');
      modelLoaded = true;
      laodingModel = false;
      setTimeout(resolve, 1000);
      console.log('Loaded model');
      return;
    }
    modelLoaded = true;
    laodingModel = false;
    resolve();
    return;
  });
  await loadingPromise;
  return;
}
loadModel();
async function predictPattern(input) {
  await loadModel();
  if (input.values.length < 300) {
    console.warn('Pattern detector requires atleast 300 data points for a reliable prediction, received just ', input.values.length);
  }
  _indicator.Indicator.reverseInputs(input);
  var values = input.values;
  var output = await model.predict(tf.tensor2d([l2Normalize(interpolateArray(values, 400))]));
  var index = tf.argMax(output, 1).get(0);
  _indicator.Indicator.reverseInputs(input);
  return {
    patternId: index,
    pattern: oneHotMap[index],
    probability: output.get(0, 4) * 100
  };
}
async function hasDoubleBottom(input) {
  var result = await predictPattern(input);
  return result.patternId === AvailablePatterns.DB;
}
async function hasDoubleTop(input) {
  var result = await predictPattern(input);
  return result.patternId === AvailablePatterns.DT;
}
async function hasHeadAndShoulder(input) {
  var result = await predictPattern(input);
  return result.patternId === AvailablePatterns.HS;
}
async function hasInverseHeadAndShoulder(input) {
  var result = await predictPattern(input);
  return result.patternId === AvailablePatterns.IHS;
}
async function isTrendingUp(input) {
  var result = await predictPattern(input);
  return result.patternId === AvailablePatterns.TU;
}
async function isTrendingDown(input) {
  var result = await predictPattern(input);
  return result.patternId === AvailablePatterns.TD;
}
class PatternDetector extends _indicator.Indicator {
  static predictPattern = predictPattern;
  static hasDoubleBottom = hasDoubleBottom;
  static hasDoubleTop = hasDoubleTop;
  static hasHeadAndShoulder = hasHeadAndShoulder;
  static hasInverseHeadAndShoulder = hasInverseHeadAndShoulder;
  static isTrendingUp = isTrendingUp;
  static isTrendingDown = isTrendingDown;
}
exports.PatternDetector = PatternDetector;
//# sourceMappingURL=patterndetection.js.map
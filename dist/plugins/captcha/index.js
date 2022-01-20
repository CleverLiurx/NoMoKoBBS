"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _svgCaptcha = require("svg-captcha");

var _svgCaptcha2 = _interopRequireDefault(_svgCaptcha);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const codeConfig = {
  size: 5,
  ignoreChars: "0oO1ilI",
  noise: 2,
  height: 44
};

const creatCaptcha = () => {
  const captcha = _svgCaptcha2.default.create(codeConfig);
  const code = captcha.text.toLowerCase();
  const svg = captcha.data;
  return { code, svg };
};

exports.default = creatCaptcha;
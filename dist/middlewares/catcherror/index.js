"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// 全局异常处理
const catchError = () => {
  return (() => {
    var _ref = _asyncToGenerator(function* (ctx, next) {
      try {
        yield next();
      } catch (err) {
        ctx.body = {
          errno: "2001",
          errmsg: err.toString()
        };
        return false;
      }
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();
};

exports.default = catchError;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const schema = new _mongoose2.default.Schema({
  // 用户id
  userId: String,
  // 请求方法
  method: String,
  // api接口
  url: String,
  // ip地址
  ip: String,
  // 客户端
  userAgent: String,
  // 请求时间
  oDate: String,
  // 处理用时
  consuming: String,
  // 请求数据
  content: String,
  // 状态
  status: String
});

const Model = _mongoose2.default.model("logs", schema);

const save = (() => {
  var _ref = _asyncToGenerator(function* (data) {
    return yield new Model(data).save();
  });

  return function save(_x) {
    return _ref.apply(this, arguments);
  };
})();

exports.default = save;
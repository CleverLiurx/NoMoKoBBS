"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _db = require("../../db");

var _session = require("../../config/session");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const isVoid = value => value === null || value === undefined || value === "";

const utils = {
  // 6-18位数字字母特殊字符
  checkPass: pass => /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{6,18}$/.test(pass),
  parseSess: (() => {
    var _ref = _asyncToGenerator(function* (ctx) {
      const sessionId = ctx.cookies.get(_session.sessionKey) || "no_session_id";
      const info = yield _db.redis.hgetall(sessionId);
      return _extends({ sessionId }, info);
    });

    return function parseSess(_x) {
      return _ref.apply(this, arguments);
    };
  })(),
  cleanObject: object => {
    const obj = _extends({}, object);
    for (let key in obj) {
      if (isVoid(obj[key])) {
        delete bj[key];
      }
    }
    return obj;
  }
};

exports.default = utils;
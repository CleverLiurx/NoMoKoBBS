"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sessionTime = exports.sessionKey = exports.sessionSigned = exports.sessionConfig = undefined;

var _db = require("../db");

const sessionKey = "nomokobbs:sess";
const sessionSigned = ["some secret hurr"];
const sessionTime = 1000 * 60 * 60 * 24 * 3; // 3 days
const sessionConfig = {
  key: sessionKey,
  maxAge: sessionTime,
  store: _db.store // session存储在redis中
};

exports.sessionConfig = sessionConfig;
exports.sessionSigned = sessionSigned;
exports.sessionKey = sessionKey;
exports.sessionTime = sessionTime;
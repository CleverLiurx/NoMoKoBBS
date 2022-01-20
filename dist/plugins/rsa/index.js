"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkTicket = exports.getLoginPack = undefined;

/**
 * 重放请求校验
 */
let _newTicket = (() => {
  var _ref = _asyncToGenerator(function* (phone, ticket) {
    const key = (0, _db.loginTicketKey)(phone);
    const flag = yield _db.redis.get(key);
    if (!flag || flag !== ticket) {
      _db.redis.set(key, ticket); // 未重复，存入redis
      _db.redis.expire(key, ticketTime);
      return true;
    } else {
      return false;
    }
  });

  return function _newTicket(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

// 公钥加密: 服务端用不到 加密在客户端进行


var _nodeRsa = require("node-rsa");

var _nodeRsa2 = _interopRequireDefault(_nodeRsa);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _md = require("md5");

var _md2 = _interopRequireDefault(_md);

var _db = require("../../db");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ticketTime = 7000; // ticket有效期

const publicKey = _fs2.default.readFileSync(_path2.default.resolve(__dirname, "./key/rsa_public_key.txt"));
const privateKey = _fs2.default.readFileSync(_path2.default.resolve(__dirname, "./key/rsa_private_key.txt"));

/**
 * 生成ticket
 * 格式：时间戳.随机字符串.md5校验位
 */
function _createTicket() {
  const t = (+new Date()).toString();
  const r = Math.random().toString(36).substr(2);
  const m = (0, _md2.default)((0, _md2.default)(t) + r);
  return `${t}.${r}.${m}`;
}

/**
 * 验证ticket
 *  a.格式是否正确
 *  b.md5校验位是否正确
 *  c.时间戳是否超时
 */
function _testTicket(ticket) {
  const data = ticket.split(".");
  // 非法的ticket
  if (data.length !== 3) {
    return false;
  }
  const m = (0, _md2.default)((0, _md2.default)(data[0]) + data[1]);
  if (m !== data[2]) {
    return false;
  }

  // ticket超时
  const time = +new Date() - data[0];
  if (time < 0 || time > ticketTime) {
    return false;
  }

  return true;
}function _encrypt(data, k) {
  const nodersa = new _nodeRsa2.default(k);
  const encrypted = nodersa.encrypt(data, "base64");
  return encrypted;
}

// 私钥解密
function _decrypt(data) {
  const nodersa = new _nodeRsa2.default(privateKey);
  const decrypted = nodersa.decrypt(data, "utf8");
  return decrypted;
}

const getLoginPack = () => ({
  ticket: _createTicket(),
  publicKey
});

const checkTicket = (() => {
  var _ref2 = _asyncToGenerator(function* (body) {
    let result;
    const { phone, password, ticket } = JSON.parse(_decrypt(body));
    const t1 = _testTicket(ticket);
    const t2 = yield _newTicket(phone, ticket);

    if (t1 && t2) {
      result = { phone, password };
    } else {
      result = {};
    }

    return result;
  });

  return function checkTicket(_x3) {
    return _ref2.apply(this, arguments);
  };
})();

exports.getLoginPack = getLoginPack;
exports.checkTicket = checkTicket;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = undefined;

var _ioredis = require("ioredis");

var _ioredis2 = _interopRequireDefault(_ioredis);

var _redis = require("../../config/redis");

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const redis = new _ioredis2.default(_redis2.default);

redis.on("connect", () => console.log("redis connected successful"));

// store用于koa-session的存储
const store = {
  get(key, maxAge, { rolling }) {
    return _asyncToGenerator(function* () {
      // console.log('get', key, maxAge, rolling)
      let res = yield redis.hgetall(key).then(function (r) {
        return r;
      }).catch(function (e) {
        return { error: e };
      });
      return res;
    })();
  },
  set(key, sess, maxAge, { rolling, changed }) {
    return _asyncToGenerator(function* () {
      // console.log('set', key, sess, maxAge, rolling, changed)
      if (changed) {
        let seconds = Math.floor(maxAge / 1000); // koa-session默认时间单位时ms->s
        redis.hmset(key, sess);
        redis.expire(key, seconds);
      }
    })();
  },
  destroy(key) {
    return _asyncToGenerator(function* () {
      // console.log('destory', key)
      yield redis.del(key);
    })();
  }
};

exports.store = store;
exports.default = redis;
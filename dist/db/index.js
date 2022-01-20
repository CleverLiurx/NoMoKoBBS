"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginTicketKey = exports.loginTimeKey = exports.smsCodeKey = exports.imgCodeKey = exports.redis = exports.store = exports.mongoClient = undefined;

var _mongo = require("./mongo");

var _mongo2 = _interopRequireDefault(_mongo);

var _redis = require("./redis");

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// redis的统一key生成器
const imgCodeKey = phone => `img_code_${phone}`; // 图片验证码存储的key
const smsCodeKey = phone => `sms_code_${phone}`; // 短信验证码存储的key
const loginTimeKey = userId => `login_${userId}`; // 用户登录时间存储的key
const loginTicketKey = phone => `ticket_${phone}`; // 防登录接口重写存储的key

exports.mongoClient = _mongo2.default;
exports.store = _redis.store;
exports.redis = _redis2.default;
exports.imgCodeKey = imgCodeKey;
exports.smsCodeKey = smsCodeKey;
exports.loginTimeKey = loginTimeKey;
exports.loginTicketKey = loginTicketKey;
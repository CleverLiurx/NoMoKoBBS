"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require("koa-router");

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _plugins = require("../../../plugins");

var _db = require("../../../db");

var _controllers = require("../../../controllers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const router = (0, _koaRouter2.default)();

// !!!此路由为不进行权限验证的api: 获取图片验证码 发送短信验证码 注册 登录

/**
 * 获取图片验证码
 */
router.get("/captcha", (() => {
  var _ref = _asyncToGenerator(function* (ctx) {
    const { phone } = ctx.query;
    const { code, svg } = (0, _plugins.creatCaptcha)(); // 生成验证码
    const key = (0, _db.imgCodeKey)(phone);
    _db.redis.set(key, code); // 存储图片验证码
    _db.redis.expire(key, 60 * 5); // 有效期5分钟
    ctx.body = svg;
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})());

/**
 * 发送短信
 */
router.post("/sms", (() => {
  var _ref2 = _asyncToGenerator(function* (ctx) {
    let result;
    const { phone } = ctx.request.body;

    if (!/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(phone)) {
      ctx.body = (0, _plugins.err)("请输入合法的手机号");
      return;
    }
    // 获取短信验证码
    const smsKey = (0, _db.smsCodeKey)(phone);
    const smsCode = yield _db.redis.get(smsKey);

    // smsCode存在即说明120s内发送过
    if (smsCode) {
      result = (0, _plugins.err)("请勿频繁发送");
    } else {
      const random6num = Math.random().toString().slice(-5);
      yield (0, _plugins.sendSms)(phone, random6num); // 发送短信
      _db.redis.set(smsKey, random6num); // 存储短信验证码：防止频繁调用或用户验证
      _db.redis.expire(smsKey, 60 * 2); // 有效期120s
      result = (0, _plugins.res)();
    }

    ctx.body = result;
  });

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
})());

/**
 * 注册
 */
router.post("/register", _controllers.user.register);

/**
 * 获取rsa包
 */
router.get("/loginPack", _controllers.user.pack);

/**
 * 登录
 */
router.post("/login", _controllers.user.login);

exports.default = router;
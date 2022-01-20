"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _baseController = require("../base-controller");

var _baseController2 = _interopRequireDefault(_baseController);

var _models = require("../../models");

var _db = require("../../db");

var _session = require("../../config/session");

var _plugins = require("../../plugins");

var _md = require("md5");

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const cleanUser = (data, config) => {
  const user = _extends({}, data.toJSON(), config);
  delete user.password;
  delete user.salt;
  delete user.__v;
  return user;
};

class Controller extends _baseController2.default {
  constructor() {
    var _this;

    _this = super(_models.User);

    this.pack = ctx => ctx.body = (0, _plugins.res)((0, _plugins.getLoginPack)());

    this.register = (() => {
      var _ref = _asyncToGenerator(function* (ctx) {
        let result;
        const { phone, code, password } = ctx.request.body;

        if (!_plugins.utils.checkPass(password)) {
          ctx.body = (0, _plugins.err)("请输入符合要求的密码");
          return;
        }

        // 获取redis中的验证码
        const key = (0, _db.smsCodeKey)(phone);
        const smsCode = yield _db.redis.get(key);

        if (smsCode == code) {
          _db.redis.del(key); // 删除验证码120s限制
          const salt = Math.random().toString(36).slice(-8); // 生成8位密码盐值
          const hash = (0, _md2.default)("liurx" + password + salt); // 生成数据库密码密文
          const { _id } = yield new _models.Record({}).save();
          const newUser = yield new _this._model(_extends({}, ctx.request.body, {
            password: hash,
            salt,
            record: _id.toString()
          })).save(); // 保存
          const timeKey = (0, _db.loginTimeKey)(newUser._id.toString());
          // redis中存储登录时间
          const time = +new Date();
          _db.redis.set(timeKey, time);

          ctx.session.userId = newUser._id.toString();
          ctx.session.loginTime = time;

          result = (0, _plugins.res)(cleanUser(newUser));
        } else {
          result = (0, _plugins.err)("验证码错误");
        }

        ctx.body = result;
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })();

    this.login = (() => {
      var _ref2 = _asyncToGenerator(function* (ctx) {
        // rsa解析
        const { phone, password } = yield (0, _plugins.checkTicket)(ctx.request.body.text);
        // 模拟
        // const { phone, password } = ctx.request.body

        if (!phone) {
          ctx.body = (0, _plugins.err)("非法登录");
          return;
        }

        // 查询用户
        let user = yield _this._model.findOne({ phone });
        if (!user) {
          ctx.body = (0, _plugins.err)("用户不存在");
          return;
        }

        const userId = user._id.toString();

        // 验证密码
        let login = false;
        const hash = (0, _md2.default)("liurx" + password + user.salt);
        if (hash === user.password) {
          login = true;
        }

        let result;
        if (login) {
          const key = (0, _db.loginTimeKey)(userId);
          // 判断是否存在登录
          const loginTime = yield _db.redis.get(key);
          if (loginTime) {
            result = (0, _plugins.res)(cleanUser(user, { tip: "该账号在已其他设备登录" }));
          } else {
            result = (0, _plugins.res)(cleanUser(user));
          }

          // redis中存储登录时间
          const time = +new Date();
          _db.redis.set(key, time);

          ctx.session.userId = userId;
          ctx.session.loginTime = time;
        } else {
          result = (0, _plugins.err)("密码错误");
        }

        ctx.body = result;
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })();

    this.logout = (() => {
      var _ref3 = _asyncToGenerator(function* (ctx) {
        // 清除redis
        const { userId, sessionId } = yield _plugins.utils.parseSess(ctx);
        const key = (0, _db.loginTimeKey)(userId);
        _db.redis.del(key); // 清除登录标记
        _db.redis.del(sessionId); // 清除session

        // 清除cookies
        let cookieOption = {
          maxAge: -1,
          httpOnly: false
        };
        ctx.cookies.set(_session.sessionKey, "", cookieOption);
        ctx.cookies.set(`${_session.sessionKey}.sig`, "", cookieOption);

        ctx.body = (0, _plugins.res)();
      });

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    })();

    this.getUserInfo = (() => {
      var _ref4 = _asyncToGenerator(function* (ctx) {
        let { _id } = ctx.query;
        if (!_id) {
          const { userId } = yield _plugins.utils.parseSess(ctx);
          _id = userId;
        }
        const user = yield _this._model.findById(_id).populate("record").select("-password -salt");
        ctx.body = (0, _plugins.res)(user);
      });

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    })();

    this.update = (() => {
      var _ref5 = _asyncToGenerator(function* (ctx) {
        const { userId } = yield _plugins.utils.parseSess(ctx);
        const { username, sex, birthday, email, avator } = ctx.request.body;
        yield _this._model.findOneAndUpdate({ _id: userId }, { username, sex, birthday, email, avator });
        ctx.body = (0, _plugins.res)();
      });

      return function (_x5) {
        return _ref5.apply(this, arguments);
      };
    })();
  }

}

exports.default = new Controller();
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _db = require("../../db");

var _session = require("../../config/session");

var _plugins = require("../../plugins");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// 路由为/api/v1/un_auth的接口
const isUnAuth = ctx => {
  return ctx.request.url.indexOf("/api/v1/un_auth") > -1 || ctx.request.method == "GET" && ctx.request.url !== "/api/v1/user";
};

// 接口请求(/api/v1, 非静态资源)
const isApi = ctx => {
  return ctx.request.url.indexOf("/api/v1/") > -1;
};

exports.default = () => {
  return (() => {
    var _ref = _asyncToGenerator(function* (ctx, next) {
      if (isUnAuth(ctx) || !isApi(ctx)) {
        // 放行不用验证的路由和静态资源
        yield next();
      } else {
        // 获取session中的userId和loginTime
        const { userId, loginTime, sessionId } = yield _plugins.utils.parseSess(ctx);

        if (!userId || !loginTime) {
          const res = {
            errno: "1006",
            errmsg: "未登录"
          };
          ctx.status = 401;
          ctx.body = JSON.stringify(res);
          return false;
        }

        // session与redis中用户的loginTime对比，不一致则发生了多用户登录
        // TODO: 以后改为登录时消息推送，不在接口中拦截，提升效率
        const key = (0, _db.loginTimeKey)(userId);
        const time = yield _db.redis.get(key);
        if (time != loginTime) {
          const res = {
            errno: "1007",
            errmsg: "该账号已在另一客户端登录",
            data: {
              loginTime
            }
          };
          ctx.body = JSON.stringify(res);
          return false;
        }

        // 刷新session时间
        _db.redis.expire(sessionId, _session.sessionTime);

        yield next();
      }
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();
};
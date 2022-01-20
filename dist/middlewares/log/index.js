"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _plugins = require("../../plugins");

var _log = require("../../models/log");

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// 判断是否走api接口, 并且非GET请求
const isNotGetApi = ctx => {
  return ctx.request.url.indexOf("/api/v1/") > -1 && ctx.request.method != "GET";
};

exports.default = () => {
  return (() => {
    var _ref = _asyncToGenerator(function* (ctx, next) {
      let method, url, userAgent, ip, oDate, content, consuming, status;

      // 请求处理前
      if (isNotGetApi(ctx)) {
        ip = ctx.request.ip.match(/(\d+.?)+/g)[0];
        userAgent = ctx.request.headers["user-agent"];
        url = ctx.request.url;
        method = ctx.request.method;
        oDate = new Date().getTime();
      }

      yield next();

      // 请求处理后
      if (isNotGetApi(ctx)) {
        try {
          status = ctx.status == 200 ? 1 : 0;
          consuming = new Date().getTime() - oDate;
          //获取具体操作内容-将参数转换成字符串
          let params = {};
          if (ctx.request.body) {
            params.body = JSON.stringify(ctx.request.body);
          }
          if (ctx.request.params) {
            params.params = JSON.stringify(ctx.request.params);
          }
          if (ctx.query) {
            params.query = JSON.stringify(ctx.query);
          }
          content = JSON.stringify(params);

          const { userId } = yield _plugins.utils.parseSess(ctx);

          //  保存
          const data = {
            method,
            url,
            userAgent,
            ip,
            oDate,
            content,
            consuming,
            status,
            userId
          };
          (0, _log2.default)(data);
        } catch (err) {
          console.log(err);
        }
      }
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();
};
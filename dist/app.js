"use strict";

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _koaCompress = require("koa-compress");

var _koaCompress2 = _interopRequireDefault(_koaCompress);

var _koaBody = require("koa-body");

var _koaBody2 = _interopRequireDefault(_koaBody);

var _cors = require("@koa/cors");

var _cors2 = _interopRequireDefault(_cors);

var _koaStatic = require("koa-static");

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _router = require("./router");

var _router2 = _interopRequireDefault(_router);

var _db = require("./db");

var _intercept = require("./middlewares/intercept");

var _intercept2 = _interopRequireDefault(_intercept);

var _koaSession = require("koa-session");

var _koaSession2 = _interopRequireDefault(_koaSession);

var _session = require("./config/session");

var _catcherror = require("./middlewares/catcherror");

var _catcherror2 = _interopRequireDefault(_catcherror);

var _log = require("./middlewares/log");

var _log2 = _interopRequireDefault(_log);

var _koa2ConnectHistoryApiFallback = require("koa2-connect-history-api-fallback");

var _koa2ConnectHistoryApiFallback2 = _interopRequireDefault(_koa2ConnectHistoryApiFallback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _koa2.default();

app.keys = _session.sessionSigned;

app.use((0, _koa2ConnectHistoryApiFallback2.default)({ whiteList: ["/api"] })).use((0, _log2.default)()).use((0, _catcherror2.default)()).use((0, _intercept2.default)()).use((0, _koaSession2.default)(_session.sessionConfig, app)).use((0, _cors2.default)({ credentials: true })).use((0, _koaCompress2.default)({ threshold: 2048 })).use((0, _koaStatic2.default)(_path2.default.join(__dirname, "../build"))).use((0, _koaBody2.default)({
  multipart: true, // 支持文件上传
  formidable: {
    maxFieldsSize: 2 * 1024 * 1024, // 最大为2兆
    multipart: true // 支持 multipart-formdate 的表单
  }
})).use(_router2.default.routes());

(0, _db.mongoClient)().then(() => console.log("mongodb connected successful"));

app.listen(_config2.default.port, () => console.log(`server started ${_config2.default.port}`));
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require("koa-router");

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _unAuth = require("./un-auth");

var _unAuth2 = _interopRequireDefault(_unAuth);

var _user = require("./user");

var _user2 = _interopRequireDefault(_user);

var _topic = require("./topic");

var _topic2 = _interopRequireDefault(_topic);

var _classes = require("./classes");

var _classes2 = _interopRequireDefault(_classes);

var _reply = require("./reply");

var _reply2 = _interopRequireDefault(_reply);

var _star = require("./star");

var _star2 = _interopRequireDefault(_star);

var _parise = require("./parise");

var _parise2 = _interopRequireDefault(_parise);

var _file = require("./file");

var _file2 = _interopRequireDefault(_file);

var _search = require("./search");

var _search2 = _interopRequireDefault(_search);

var _terminal = require("./terminal");

var _terminal2 = _interopRequireDefault(_terminal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _koaRouter2.default)();

router.use("/un_auth", _unAuth2.default.routes()).use("/user", _user2.default.routes()).use("/topic", _topic2.default.routes()).use("/classes", _classes2.default.routes()).use("/reply", _reply2.default.routes()).use("/star", _star2.default.routes()).use("/parise", _parise2.default.routes()).use("/file", _file2.default.routes()).use("/search", _search2.default.routes()).use("/terminal", _terminal2.default.routes());

exports.default = router;
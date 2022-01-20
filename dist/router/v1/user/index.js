"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require("koa-router");

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _controllers = require("../../../controllers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _koaRouter2.default)();

router.get("/", _controllers.user.getUserInfo).get("/logout", _controllers.user.logout).put("/", _controllers.user.update);

exports.default = router;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require("koa-router");

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _controllers = require("../../../controllers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _koaRouter2.default)();

router.post("/", _controllers.topic.add).get("/:id", _controllers.topic.detail).get("/", _controllers.topic.getList).delete("/:id", _controllers.topic.del).patch("/hide/:id", _controllers.topic.hide);

exports.default = router;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _baseController = require("../base-controller");

var _baseController2 = _interopRequireDefault(_baseController);

var _models = require("../../models");

var _plugins = require("../../plugins");

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Controller extends _baseController2.default {
  constructor() {
    var _this;

    _this = super(_models.Reply);

    this.add = (() => {
      var _ref = _asyncToGenerator(function* (ctx) {
        let result;
        const { topicId, content, pid } = ctx.request.body;
        const { userId: createBy } = yield _plugins.utils.parseSess(ctx);

        // 验证帖子是否存在
        const topicRecord = yield _models.Topic.findById(topicId);
        if (!topicRecord) {
          ctx.body = (0, _plugins.err)("帖子不存在");
          return;
        }

        // pid不存在：说明是一级回复
        if (!pid) {
          yield _models.Topic.findByIdAndUpdate(topicId, {
            repliedBy: createBy,
            repliedTime: new Date()
          });
          yield new _this._model({
            topicId,
            content,
            createBy,
            hasChild: true
          }).save();
        } else {
          // 二级回复：查找是否存在一级回复
          const replyRecord = yield _this._model.findById(pid);
          if (!replyRecord) {
            ctx.body = (0, _plugins.err)("回复不存在");
            return;
          }
          yield _this._model({ content, pid, createBy }).save(); // 二级回复不保存topicId
        }

        result = yield _this._model.find({ topicId }).populate({ path: "reply", populate: { path: "reply" } });

        ctx.body = (0, _plugins.res)(result);
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })();

    this.getList = (() => {
      var _ref2 = _asyncToGenerator(function* (ctx) {
        let { topicId } = ctx.request.params;

        const result = yield _this._model.find({ topicId }).populate({ path: "reply", populate: { path: "reply" } });
        ctx.body = (0, _plugins.res)(result);
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })();
  }

}

exports.default = new Controller();
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _baseController = require("../base-controller");

var _baseController2 = _interopRequireDefault(_baseController);

var _models = require("../../models");

var _plugins = require("../../plugins");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Controller extends _baseController2.default {
  constructor() {
    var _this;

    _this = super(_models.Parise);

    this.update = (() => {
      var _ref = _asyncToGenerator(function* (ctx) {
        let result;
        const { topicId, replyId } = ctx.request.body;
        const { userId: createBy } = yield _plugins.utils.parseSess(ctx);

        if (replyId) {
          // 对回复点赞
          result = yield _this.pariseReply(replyId, createBy);
        } else {
          // 对文章点赞
          result = yield _this.pariseTopic(topicId, createBy);
        }

        ctx.body = result;
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })();

    this.pariseReply = (() => {
      var _ref2 = _asyncToGenerator(function* (replyId, createBy) {
        const replyRecord = yield _models.Reply.findById(replyId);
        if (!replyRecord) {
          return (0, _plugins.err)("回复不存在");
        }

        const pariseRecord = yield _this._model.findOne({ createBy, replyId });
        if (!pariseRecord) {
          yield new _this._model({ createBy, replyId }).save();
        } else {
          yield _this._model.updateOne({ createBy, replyId }, { status: !pariseRecord.status });
        }

        let inc = !pariseRecord || !pariseRecord.status ? 1 : -1;
        let result = yield _models.Reply.findByIdAndUpdate(replyId, {
          $inc: { praiseCount: inc }
        }); // 帖子的点赞数+-1
        yield _models.Record.findOneAndUpdate({ createBy }, { $inc: { praiseCount: inc } }); // 用户的点赞数+-1
        yield _models.Record.findOneAndUpdate({ createBy: replyRecord.createBy }, { $inc: { bePraiseCount: inc } }); // 用户的被点赞数+-1
        return (0, _plugins.res)(result);
      });

      return function (_x2, _x3) {
        return _ref2.apply(this, arguments);
      };
    })();

    this.pariseTopic = (() => {
      var _ref3 = _asyncToGenerator(function* (topicId, createBy) {
        const topicRecord = yield _models.Topic.findById(topicId);
        if (!topicRecord) {
          return (0, _plugins.err)("文章不存在");
        }

        const pariseRecord = yield _this._model.findOne({ createBy, topicId });
        if (!pariseRecord) {
          yield new _this._model({ createBy, topicId }).save();
        } else {
          yield _this._model.updateOne({ createBy, topicId }, { status: !pariseRecord.status });
        }

        let inc = !pariseRecord || !pariseRecord.status ? 1 : -1;
        let result = yield _models.Topic.findByIdAndUpdate(topicId, { $inc: { praiseCount: inc } }, { new: true }).populate({
          path: "createBy",
          select: "_id username sex avator",
          populate: "record"
        }).populate("classFrom", "_id classname"); // 帖子的点赞数+-1
        yield _models.Record.findOneAndUpdate({ createBy }, { $inc: { praiseCount: inc } }); // 用户的点赞数+-1
        yield _models.Record.findOneAndUpdate({ createBy: topicRecord.createBy }, { $inc: { bePraiseCount: inc } }); // 用户的被点赞数+-1
        return (0, _plugins.res)(result);
      });

      return function (_x4, _x5) {
        return _ref3.apply(this, arguments);
      };
    })();
  }

}

exports.default = new Controller();
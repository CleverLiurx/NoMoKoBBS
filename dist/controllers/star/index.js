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

    _this = super(_models.Star);

    this.update = (() => {
      var _ref = _asyncToGenerator(function* (ctx) {
        const { topicId } = ctx.request.body;

        // 校验帖子存在
        const topicRecord = yield _models.Topic.findById(topicId);
        if (!topicRecord) {
          ctx.body = (0, _plugins.err)("帖子不存在");
          return;
        }

        const { userId: createBy } = yield _plugins.utils.parseSess(ctx);
        const starRecord = yield _this._model.findOne({ createBy, topicId });

        if (!starRecord) {
          yield new _this._model({ createBy, topicId }).save();
        } else {
          yield _this._model.updateOne({ createBy, topicId }, { status: !starRecord.status });
        }

        let inc = !starRecord || !starRecord.status ? 1 : -1;
        const topic = yield _models.Topic.findByIdAndUpdate(topicId, { $inc: { starCount: inc } }, { new: true }).populate("createBy", "_id username sex avator").populate("classFrom", "_id classname"); // 帖子的收藏数+-1
        yield _models.Record.findOneAndUpdate({ createBy }, { $inc: { starCount: inc } }); // 用户的收藏数+-1
        yield _models.Record.findOneAndUpdate({ createBy: topic.createBy }, { $inc: { beStarCount: inc } }); // 用户的被收藏数+-1

        ctx.body = (0, _plugins.res)(topic);
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })();

    this.getList = (() => {
      var _ref2 = _asyncToGenerator(function* (ctx) {
        const { userId } = ctx.query;
        const data = yield _this._model.find({ createBy: userId });
        ctx.body = (0, _plugins.res)(data);
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })();
  }

}

exports.default = new Controller();
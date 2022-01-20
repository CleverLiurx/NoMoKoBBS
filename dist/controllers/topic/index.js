"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _baseController = require("../base-controller");

var _baseController2 = _interopRequireDefault(_baseController);

var _models = require("../../models");

var _plugins = require("../../plugins");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Controller extends _baseController2.default {
  constructor() {
    var _this;

    _this = super(_models.Topic);

    this.add = (() => {
      var _ref = _asyncToGenerator(function* (ctx) {
        const { classFrom, title, content, topicImage, richContent } = ctx.request.body;

        // 校验板块存在
        const classRecord = yield _models.Classes.findById(classFrom);
        if (!classRecord) {
          ctx.body = (0, _plugins.err)("板块不存在");
          return;
        }

        const { userId: createBy } = yield _plugins.utils.parseSess(ctx);
        const option = richContent ? { richContent, title } : { topicImage };
        const result = yield new _this._model(_extends({
          classFrom,
          createBy,
          content
        }, option)).save();
        ctx.body = (0, _plugins.res)(result);
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })();

    this.detail = (() => {
      var _ref2 = _asyncToGenerator(function* (ctx) {
        const { id } = ctx.request.params;
        const result = yield _this._model.findById(id);
        ctx.body = (0, _plugins.res)(result);
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })();

    this.getList = (() => {
      var _ref3 = _asyncToGenerator(function* (ctx) {
        const { isFocus = false } = ctx.query;
        let result;

        if (isFocus) {
          result = yield _this.getFocus(ctx);
        } else {
          result = yield _this.getTopic(ctx);
        }

        ctx.body = (0, _plugins.res)(result);
      });

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    })();

    this.getTopic = (() => {
      var _ref4 = _asyncToGenerator(function* (ctx) {
        const {
          classFrom,
          createBy,
          sort = "createTime",
          page = 1,
          limit = 10,
          kw = ""
        } = ctx.query;

        let filter = {};

        if (kw) {
          // 生成keywords
          const regList = [];
          const keyList = kw.split(" ");
          keyList.forEach((() => {
            var _ref5 = _asyncToGenerator(function* (item) {
              const reg = new RegExp(item, "i");
              regList.push({ title: { $regex: reg } });
              yield _this.addKeywords(item);
              filter = { $or: regList };
            });

            return function (_x5) {
              return _ref5.apply(this, arguments);
            };
          })());
        }

        if (classFrom) {
          filter.classFrom = classFrom;
        }
        if (createBy) {
          filter.createBy = createBy;
        }
        filter.isFocus = { $ne: true };

        const result = yield _this._model.find(filter).sort({ [sort]: -1 }).skip((page - 1) * parseInt(limit)).limit(parseInt(limit));
        return result;
      });

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    })();

    this.getFocus = (() => {
      var _ref6 = _asyncToGenerator(function* (ctx) {
        const result = yield _this._model.find({ isFocus: true });
        return result;
      });

      return function (_x6) {
        return _ref6.apply(this, arguments);
      };
    })();

    this.addKeywords = (() => {
      var _ref7 = _asyncToGenerator(function* (kw) {
        if (!kw) {
          return;
        }
        yield _models.Search.findOneAndUpdate({ keywords: kw }, { $inc: { count: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true });
      });

      return function (_x7) {
        return _ref7.apply(this, arguments);
      };
    })();
  }

}

exports.default = new Controller();
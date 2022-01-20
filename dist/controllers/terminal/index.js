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

    _this = super(_models.Terminal);

    this.getList = (() => {
      var _ref = _asyncToGenerator(function* (ctx) {
        const { page = 1, limit = 20, kw = "" } = ctx.query;

        const regStr = kw.trim().replace(/\s+|\s+/g, "|");
        const reg = new RegExp(regStr, "i");
        let filter = {};
        if (kw) {
          filter = {
            keywords: { $elemMatch: { $regex: reg } }
          };
        }

        const result = yield _this._model.find(filter).sort({ starCount: -1 }).skip((page - 1) * parseInt(limit)).limit(parseInt(limit));

        ctx.body = (0, _plugins.res)(result);
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })();

    this.add = (() => {
      var _ref2 = _asyncToGenerator(function* (ctx) {
        const { command, keywords, description, example } = ctx.request.body;
        yield new _this._model({ command, keywords, description, example }).save();
        ctx.body = (0, _plugins.res)();
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })();
  }

}

exports.default = new Controller();
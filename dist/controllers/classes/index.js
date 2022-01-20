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

    _this = super(_models.Classes);

    this.add = (() => {
      var _ref = _asyncToGenerator(function* (ctx) {
        const {
          classname,
          master,
          canAnon = false,
          description,
          icon
        } = ctx.request.body;

        // 校验版主是否存在
        const userRecord = yield _models.User.findById(master);
        if (!userRecord) {
          ctx.body = (0, _plugins.err)("版主不存在");
          return;
        }

        const result = yield new _this._model({
          classname,
          master,
          canAnon,
          description,
          icon
        }).save();
        ctx.body = (0, _plugins.res)(result);
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })();

    this.getList = (() => {
      var _ref2 = _asyncToGenerator(function* (ctx) {
        const result = yield _this._model.find({});
        ctx.body = (0, _plugins.res)(result);
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })();

    this.detail = (() => {
      var _ref3 = _asyncToGenerator(function* (ctx) {
        const { id } = ctx.request.params;
        const result = yield _this._model.findById(id);
        ctx.body = (0, _plugins.res)(result);
      });

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    })();
  }

}

exports.default = new Controller();
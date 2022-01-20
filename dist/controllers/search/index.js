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

    _this = super(_models.Search);

    this.hotSearch = (() => {
      var _ref = _asyncToGenerator(function* (ctx) {
        const result = yield _this._model.find({}, "keywords").sort({ count: -1 }).limit(10);
        ctx.body = (0, _plugins.res)(result);
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })();
  }

}

exports.default = new Controller();
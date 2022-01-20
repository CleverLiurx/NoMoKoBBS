"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _plugins = require("../../plugins");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class BaseController {
  constructor(Model) {
    var _this = this;

    this.del = (() => {
      var _ref = _asyncToGenerator(function* (ctx) {
        let { id } = ctx.request.params;
        let result = yield _this._model.updateOne({ _id: id }, { delFlag: true });
        ctx.body = (0, _plugins.res)(result);
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })();

    this.hide = (() => {
      var _ref2 = _asyncToGenerator(function* (ctx) {
        let { id } = ctx.request.params;
        let result = yield _this._model.updateOne({ _id: id }, { status: false });
        ctx.body = (0, _plugins.res)(result);
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })();

    this._model = Model;
  }

  // 删除


  // 隐藏
}

exports.default = BaseController;
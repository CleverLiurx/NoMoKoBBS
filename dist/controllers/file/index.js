"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _baseController = require("../base-controller");

var _baseController2 = _interopRequireDefault(_baseController);

var _models = require("../../models");

var _plugins = require("../../plugins");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _qiniuyun = require("../../plugins/qiniuyun");

var _qiniuyun2 = _interopRequireDefault(_qiniuyun);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Controller extends _baseController2.default {
  constructor() {
    var _this;

    _this = super(_models.File);

    this.upload = (() => {
      var _ref = _asyncToGenerator(function* (ctx) {
        const { href = "", alt = "", slim = true } = ctx.request.body;
        // 获取文件
        const file = ctx.request.files && ctx.request.files.file;
        if (!file) {
          ctx.body = (0, _plugins.err)("请选择文件");
          return;
        }

        // 存储到本地
        const localPath = _path2.default.join(__dirname, `../../../temp/`);
        const fileName = file.path.split("/").pop();
        const localFile = `${localPath}${fileName}`;
        _fs2.default.renameSync(file.path, localFile);

        // 上传到七牛云
        const url = yield (0, _qiniuyun2.default)(localFile, fileName);

        // 数据库记录 
        const fileRecord = {
          url: slim ? url + "?imageslim" : url,
          href,
          alt,
          filename: file.name
        };
        const result = yield new _this._model(fileRecord).save();

        ctx.body = (0, _plugins.res)(result);
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })();
  }

}

exports.default = new Controller();
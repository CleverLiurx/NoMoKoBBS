"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = new _mongoose2.default.Schema({
  // 文件名
  filename: {
    type: String,
    required: true
  },
  // url
  url: {
    type: String,
    required: true
  },
  // href
  href: {
    type: String,
    default: ""
  },
  // alt
  alt: {
    type: String,
    default: ""
  },
  // 删除状态 true-删除
  delFlag: {
    type: Boolean,
    default: false
  }
}, { timestamps: { createdAt: "createTime", updatedAt: "updateTime" } });

const Model = _mongoose2.default.model("files", schema);

exports.default = Model;
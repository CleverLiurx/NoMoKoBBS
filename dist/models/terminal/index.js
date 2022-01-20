"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = new _mongoose2.default.Schema({
  // 命令
  command: {
    type: String,
    unique: true
  },
  // 关键词
  keywords: {
    type: [String],
    default: []
  },
  // 描述
  description: String,
  // 举例
  example: {
    type: String,
    default: "无"
  },
  // 收藏数
  starCount: {
    type: Number,
    default: 0
  },
  // 删除状态 true-删除
  delFlag: {
    type: Boolean,
    default: true
  }
}, { timestamps: { createdAt: "createTime", updatedAt: "updateTime" } });

schema.pre("find", function () {
  this.find({ delFlag: false });
});

const Model = _mongoose2.default.model("terminals", schema);

exports.default = Model;
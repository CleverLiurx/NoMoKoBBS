"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = new _mongoose2.default.Schema({
  // 板块名称
  classname: {
    type: String,
    unique: true,
    required: [true, "板块名不能为空"]
  },
  // 帖子数量
  topicCount: {
    type: Number,
    default: 0
  },
  // 版主
  master: {
    type: _mongoose2.default.Types.ObjectId,
    ref: "users"
  },
  // 允许匿名
  canAnon: {
    type: Boolean,
    default: false
  },
  // 板块描述
  description: String,
  // 板块图标
  icon: String
}, { timestamps: { createdAt: "createTime", updatedAt: "updateTime" } });

const Model = _mongoose2.default.model("class", schema);

exports.default = Model;
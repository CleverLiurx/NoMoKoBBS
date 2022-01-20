"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = new _mongoose2.default.Schema({
  // 搜索的关键词
  keywords: {
    type: String,
    unique: true,
    minlength: 1
  },
  count: {
    type: Number,
    default: 0
  },
  // 删除状态 true-删除
  delFlag: {
    type: Boolean,
    default: false
  }
}, { timestamps: { createdAt: "createTime", updatedAt: "updateTime" } });

const Model = _mongoose2.default.model("searchs", schema);

exports.default = Model;
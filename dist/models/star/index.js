"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = new _mongoose2.default.Schema({
  // 收藏人
  createBy: {
    type: _mongoose2.default.Types.ObjectId,
    ref: "users"
  },
  // 收藏的帖子
  topicId: {
    type: _mongoose2.default.Types.ObjectId,
    ref: "topics"
  },
  // 收藏状态：1-收藏 0-取消收藏
  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: { createdAt: "createTime", updatedAt: "updateTime" } });

schema.pre("find", function () {
  this.find({ status: 1 }).populate("topicId", "title content _id");
});

const Model = _mongoose2.default.model("stars", schema);

exports.default = Model;
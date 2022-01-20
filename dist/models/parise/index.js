"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = new _mongoose2.default.Schema({
  // 点赞人
  createBy: {
    type: _mongoose2.default.Types.ObjectId,
    ref: "users"
  },
  // 被点赞的帖子
  topicId: {
    type: _mongoose2.default.Types.ObjectId,
    ref: "topics"
  },
  // 被点赞的回复
  replyId: {
    type: _mongoose2.default.Types.ObjectId,
    ref: "replys"
  },
  // 点赞状态：1-点赞 0-取消点赞
  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: { createdAt: "createTime", updatedAt: "updateTime" } });

const Model = _mongoose2.default.model("parises", schema);

exports.default = Model;
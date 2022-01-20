"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = new _mongoose2.default.Schema({
  // 发帖数
  topicCount: {
    type: Number,
    default: 0
  },
  // 评论数
  commentCount: {
    type: Number,
    default: 0
  },
  // 被评论数
  beCommentCount: {
    type: Number,
    default: 0
  },
  // 点赞数
  praiseCount: {
    type: Number,
    default: 0
  },
  // 被点赞数
  bePraiseCount: {
    type: Number,
    default: 0
  },
  // 收藏数
  starCount: {
    type: Number,
    default: 0
  },
  // 被收藏数
  beStarCount: {
    type: Number,
    default: 0
  },
  // 积分
  pointCount: {
    type: Number,
    default: 0
  }
}, { timestamps: { createdAt: "createTime", updatedAt: "updateTime" } });

const Model = _mongoose2.default.model("records", schema);

exports.default = Model;
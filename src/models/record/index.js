import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    // 发帖数
    topicCount: {
      type: Number,
      default: 0,
    },
    // 评论数
    commentCount: {
      type: Number,
      default: 0,
    },
    // 被评论数
    beCommentCount: {
      type: Number,
      default: 0,
    },
    // 点赞数
    praiseCount: {
      type: Number,
      default: 0,
    },
    // 被点赞数
    bePraiseCount: {
      type: Number,
      default: 0,
    },
    // 收藏数
    starCount: {
      type: Number,
      default: 0,
    },
    // 被收藏数
    beStarCount: {
      type: Number,
      default: 0,
    },
    // 积分
    pointCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: { createdAt: "createTime", updatedAt: "updateTime" } }
);

const Model = mongoose.model("records", schema);

export default Model;

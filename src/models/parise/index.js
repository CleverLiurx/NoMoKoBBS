import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    // 点赞人
    createBy: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    // 被点赞的帖子
    topicId: {
      type: mongoose.Types.ObjectId,
      ref: "topics",
    },
    // 被点赞的回复
    replyId: {
      type: mongoose.Types.ObjectId,
      ref: "replys",
    },
    // 点赞状态：1-点赞 0-取消点赞
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "createTime", updatedAt: "updateTime" } }
);

const Model = mongoose.model("parises", schema);

export default Model;

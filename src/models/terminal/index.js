import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    // 命令
    command: {
      type: String,
      unique: true,
    },
    // 关键词
    keywords: {
      type: [String],
      default: [],
    },
    // 描述
    description: {
      type: [String],
      default: [],
    },
    // 举例
    example: {
      type: String,
      default: "无",
    },
    // 收藏数
    starCount: {
      type: Number,
      default: 0,
    },
    // 删除状态 true-删除
    delFlag: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "createTime", updatedAt: "updateTime" } }
);

schema.pre("find", function () {
  this.find({ delFlag: false });
});

const Model = mongoose.model("terminals", schema);

export default Model;

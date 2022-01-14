import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    // 搜索的关键词
    keywords: {
      type: String,
      unique: true,
      minlength: 1,
    },
    count: {
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

const Model = mongoose.model("searchs", schema);

export default Model;

import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    // 文件名
    filename: {
      type: String,
      required: true,
    },
    // url
    url: {
      type: String,
      required: true,
    },
    // href
    href: {
      type: String,
      default: "",
    },
    // alt
    alt: {
      type: String,
      default: "",
    },
    // 删除状态 true-删除
    delFlag: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "createTime", updatedAt: "updateTime" } }
);

const Model = mongoose.model("files", schema);

export default Model;

import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  // 板块名称
  classname: {
    type: String,
    unique: true,
    required: [true, '板块名不能为空']
  },
  // 帖子数量
  topicCount: {
    type: Number,
    default: 0
  },
  // 版主
  master: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
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
}, { timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } })

const Model = mongoose.model('class', schema)

export default Model
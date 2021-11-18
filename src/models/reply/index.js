import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  // 回复人
  createBy: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  },
  // 回复的帖子
  topic: {
    type: mongoose.Types.ObjectId,
    ref: 'topics'
  },
  // 回复的内容
  content: {
    type: String,
    required: true
  },
  // 回复总数
  replyCount: {
    type: Number,
    default: 0
  },
  // 是否有子节点
  hasChild: {
    type: Boolean,
    default: false
  },
  // 父节点id
  pid: {
    type: String,
    default: ''
  },
  // 点赞数
  praiseCount: {
    type: Number,
    default: 0
  },
  // 举报数
  informCount: {
    type: Number,
    default: 0
  },
  // 显示状态 true-正常 false-屏蔽内容
  status: {
    type: Boolean,
    default: true
  },
  // 删除状态
  delFlag: {
    type: Boolean,
    default: false
  }
}, { timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } })

const Model = mongoose.model('replys', schema)

export default Model
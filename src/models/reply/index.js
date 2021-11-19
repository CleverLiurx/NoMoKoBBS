import mongoose from 'mongoose'
import Topic from '../topic'

const schema = new mongoose.Schema({
  // 回复人
  createBy: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  },
  // 回复的帖子
  topicId: {
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
  pid: mongoose.Types.ObjectId,
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
}, { timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }, toJSON: { virtuals: true } })

schema.virtual('reply', {
  ref: 'replys',
  localField: '_id',
  foreignField: 'pid',
  justOne: false
})

schema.post('save', async function() {
  // 一级回复：topic的回复数量+1
  if (!this.pid) {
    await Topic.findByIdAndUpdate(this.topicId, { $inc: { replyCount: 1 } })
  } else {
    // 二级回复：一级reply的回复数量+1
    await Model.findByIdAndUpdate(this.pid, { $inc: { replyCount: 1 } })
  }
})

const Model = mongoose.model('replys', schema)

export default Model
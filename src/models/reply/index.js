import mongoose from 'mongoose'
import Topic from '../topic'
import Record from '../record'
import Parise from '../parise'

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
  },
  hadParise: Boolean
}, { timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }, toJSON: { virtuals: true } })

schema.pre('find', function() {
  this.find({ delFlag: false }).populate('createBy', '_id username sex avator')
})

schema.virtual('reply', {
  ref: 'replys',
  localField: '_id',
  foreignField: 'pid',
  justOne: false
})

schema.post('save', async function() {
  // 一级回复
  if (!this.pid) {
    const topic = await Topic.findByIdAndUpdate(this.topicId, { $inc: { replyCount: 1 } }) // 文章的回帖数+1
    await Record.findOneAndUpdate({ createBy: topic.createBy }, { $inc: { commentCount: 1 } }) // 被评论数+1
    await Record.findOneAndUpdate({ createBy: this.createBy }, { $inc: { beCommentCount: 1 } }) // 评论数+1
  } else {
    // 二级回复
    await Model.findByIdAndUpdate(this.pid, { $inc: { replyCount: 1 } }) // 一级reply的回复数量+1
  }
})

schema.post('find', async function(docs) {
  for (let doc of docs) {
    if (!doc.status) {
      // doc.content = doc.content.slice(0, 2) + '**********'
      doc.content = '**** 涉嫌违规 **** 已被屏蔽 ****'
    }

    // 看自己是否点赞
    const pariseRecord = await Parise.findOne({ createBy: doc.createBy, replyId: doc._id, status: true })
    if (pariseRecord) {
      doc.hadParise = true
    } else {
      doc.hadParise = false
    }
  }
})

const Model = mongoose.model('replys', schema)

export default Model
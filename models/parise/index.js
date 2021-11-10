import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  // 点赞人
  createBy: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  },
  // 被点赞的帖子
  topic: {
    type: mongoose.Types.ObjectId,
    ref: 'topics'
  },
  // 被点赞的回复
  reply: {
    type: mongoose.Types.ObjectId,
    ref: 'replys'
  }
}, { timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } })

const Model = mongoose.model('parises', schema)

export default Model
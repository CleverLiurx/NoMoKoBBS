import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  // 收藏人
  createBy: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  },
  // 回复的帖子
  topic: {
    type: mongoose.Types.ObjectId,
    ref: 'topics'
  }
}, { timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } })

const Model = mongoose.model('stars', schema)

export default Model
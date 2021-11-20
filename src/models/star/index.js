import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  // 收藏人
  createBy: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  },
  // 收藏的帖子
  topicId: {
    type: mongoose.Types.ObjectId,
    ref: 'topics'
  },
  // 收藏状态：true-收藏 false-取消收藏
  status: Number
}, { timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } })

const Model = mongoose.model('stars', schema)

export default Model
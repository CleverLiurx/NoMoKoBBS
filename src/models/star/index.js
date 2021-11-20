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
  // 收藏状态：1-收藏 0-取消收藏
  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } })

const Model = mongoose.model('stars', schema)

export default Model
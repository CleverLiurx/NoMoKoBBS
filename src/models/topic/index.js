import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  // 所属板块
  classId: {
    type: mongoose.Types.ObjectId,
    ref: 'class'
  },
  // 创建人
  createBy: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  },
  // 标题
  title: String,
  // 内容
  content: {
    type: String,
    required: [true, '内容不能为空']
  },
  // 图片
  topicImage: Array,
  // 点击数
  hitsCount: {
    type: Number,
    default: 0
  },
  // 回复数
  replyCount: {
    type: Number,
    default: 0
  },
  // 最后回复人
  repliedBy: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  },
  // 最后回复时间
  repliedTime: Date,
  // 显示状态 true-正常 false-屏蔽内容
  status: {
    type: Boolean,
    default: true
  },
  // 删除状态 1-删除
  delFlag: {
    type: Number,
    enum: [0, 1],
    default: 0
  },
  // 热门回复
  hotReply: {
    type: mongoose.Types.ObjectId,
    ref: 'replys'
  },
  // 点赞数
  praiseCount: {
    type: Number,
    default: 0
  },
  // 收藏数
  starCount: {
    type: Number,
    default: 0
  },
  // 举报数
  informCount: {
    type: Number,
    default: 0
  },
  // 是否匿名
  anon: {
    type: Boolean,
    default: false
  }
}, { timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }, toJSON: { virtuals: true } })

schema.virtual('reply', {
  ref: 'replys', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'topicId', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false
})

const Model = mongoose.model('topics', schema)

export default Model
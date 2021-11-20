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
    ref: 'users'
  },
  // 标题
  title: String,
  // 内容
  content: {
    type: String,
    required: [true, '内容不能为空']
  },
  // 图片
  topicImage: [
    {
      name: String,
      url: String
    }
  ],
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
    ref: 'users'
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
    type: Boolean,
    default: false
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

schema.pre('findOne', function() {
  this.findOne({ delFlag: false }).populate('createBy', '_id username sex')
})
schema.pre('find', function() {
  this.find({ delFlag: false }).populate('createBy', '_id username sex')
})

schema.virtual('reply', {
  ref: 'replys',
  localField: '_id',
  foreignField: 'topicId',
  justOne: false
})

schema.post('findOne', function (doc) {
  if (doc && !doc.status) {
    doc.content = doc.content.slice(0, 2) + '**********'
  }
})

const Model = mongoose.model('topics', schema)

export default Model
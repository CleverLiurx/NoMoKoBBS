import mongoose from 'mongoose'
import Record from '../record'
import Star from '../star'
import Parise from '../parise'

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
  // 举报数
  informCount: {
    type: Number,
    default: 0
  },
  // 是否匿名
  anon: {
    type: Boolean,
    default: false
  },
  hadStar: Boolean,
  hadParise: Boolean
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

schema.post('findOne', async function (doc) {
  if (doc) {
    // 如果被屏蔽
    if (!doc.status) {
      doc.content = doc.content.slice(0, 2) + '**********'
    }
  
    // 看自己是否收藏
    const starRecord = await Star.findOne({ createBy: doc.createBy._id, topicId: doc._id, status: 1 })
    if (starRecord) {
      doc.hadStar = true
    } else {
      doc.hadStar = false
    }
  
    // 看自己是否点赞
    const pariseRecord = await Parise.findOne({ createBy: doc.createBy._id, topicId: doc._id, status: true })
    if (pariseRecord) {
      doc.hadParise = true
    } else {
      doc.hadParise = false
    }
  }
})

schema.post('find', async function (docs) {
  for (let doc of docs) {
    // 看自己是否收藏
    const starRecord = await Star.findOne({ createBy: doc.createBy._id, topicId: doc._id, status: 1 })
    if (starRecord) {
      doc.hadStar = true
    } else {
      doc.hadStar = false
    }
  
    // 看自己是否点赞
    const pariseRecord = await Parise.findOne({ createBy: doc.createBy._id, topicId: doc._id, status: true })
    if (pariseRecord) {
      doc.hadParise = true
    } else {
      doc.hadParise = false
    }
  }
})

schema.post('save', async function () {
  await Record.findOneAndUpdate({ createBy: this.createBy }, { $inc: { topicCount: 1 } })
})

const Model = mongoose.model('topics', schema)

export default Model
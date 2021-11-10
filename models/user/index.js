import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  // 手机号：登录
  phone: {
    type: String,
    required: true
  },
  // 用户名：昵称
  username: {
    type: String,
    unique: true,
    required: [true, '用户名不能为空']
  },
  // 密码
  password: String,
  // 邮箱
  email: String,
  // 生日
  birthday: String,
  // 性别 1-男 0-女
  sex: {
    type: Number,
    enum: [0, 1],
    default: 1
  },
  // 头像
  avator: {
    type: String,
    default: 'xxxxx.jpg'
  },
  // 用户记录
  record: {
    type: mongoose.Types.ObjectId,
    ref: 'replys'
  },
  // 关联学校的学号
  studentId: {
    type: mongoose.Types.ObjectId,
    unique: true,
    ref: 'school'
  },
  // 是否为版主
  isSectioner: {
    type: Number,
    enum: [0, 1],
    default: 1
  },
  // 显示状态 true-正常 false-存在但不显示信息
  status: {
    type: Boolean,
    default: true
  },
  // 删除状态 1-删除
  delFlag: {
    type: Boolean,
    default: false
  }
}, { timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } })

const Model = mongoose.model('users', schema)

export default Model
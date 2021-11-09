import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  phone: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    default: '用户' + Date.now(),
    required: [true, '用户名不能为空']
  },
  password: String,
  email: String,
  birthday: String,
  sex: {
    type: Number,
    enum: [0, 1],
    default: 1
  },
  avator: {
    type: String,
    default: 'xxxxx.jpg'
  },
  status: {
    type: Number,
    enum: [0, 1],
    default: 1
  },
  delFlag: {
    type: Number,
    enum: [0, 1],
    default: 1
  },
  studentId: {
    type: mongoose.Types.ObjectId,
    unique: true,
    ref: 'school'
  },
  isSectioner: {
    type: Number,
    enum: [0, 1],
    default: 1
  }
}, { timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } })

const Model = mongoose.model('users', schema)

export default Model
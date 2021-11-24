import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  nameCh: {
    type: String,
    required: true
  },
  nameEn: {
    type: String,
    required: true
  },
  value: Number
}, { timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } })

const Model = mongoose.model('sys', schema)

export default Model
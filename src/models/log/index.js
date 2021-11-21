import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  // 用户id
  userId: String,
  // 请求方法
  method: String,
  // api接口
  url: String,
  // ip地址
  ip: String,
  // 客户端
  userAgent: String,
  // 请求时间
  oDate: String,
  // 处理用时
  consuming: String,
  // 请求数据
  content: String,
  // 状态
  status: String
})

const Model = mongoose.model('logs', schema)

const save = async data => await new Model(data).save()

export default save
import mongoose from 'mongoose'
// 全局异常处理
const catchError = () => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.body = {
        errno: '2001',
        errmsg: err.toString()
      }
      return false
    }
  }
}

export default catchError

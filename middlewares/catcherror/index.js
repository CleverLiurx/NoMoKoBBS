// 全局异常处理
const catchError = () => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      let result
      if (err.errorCode) { // 异步错误
        result = {
          errno: err.errorCode,
          errmsg: err.msg
        }
      } else { // 服务器错误
        result = {
          errno: '500',
          errmsg: err.toString()
        }
      }
      ctx.body = result
      return false
    }
  }
}

export default catchError

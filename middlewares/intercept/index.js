import { redis } from '../../db'
import { sessionKey, sessionTime } from '../../config/session'

const isUnAuth = ctx => {
  const url = ctx.request.url
  let flag = false
  // un_auth路由和非接口请求(静态资源)不验证session
  if (url.indexOf('/api/v1/un_auth') > -1 || url.indexOf('/api/v1/') === -1) {
    flag = true
  }
  return flag
}

export default () => {
  return async (ctx, next) => {
    const sessionId = ctx.cookies.get(sessionKey)
    // console.log(sessionId)
    // redis.expire(ctx.cookies.get('nomokobbs:sess'), sessionTime)
    if (isUnAuth(ctx)) {
      await next()
    } else {
      // TODO: 验证session
      await next()
    }
  }
}
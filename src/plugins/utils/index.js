import { redis } from '../../db'
import { sessionKey } from '../../config/session'

const utils = {
  // 6-18位数字字母特殊字符
  checkPass: pass => /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{6,18}$/.test(pass),
  parseSess: async ctx => {
    const sessionId = ctx.cookies.get(sessionKey) || 'no_session_id'
    const info = await redis.hgetall(sessionId)
    return { sessionId, ...info }
  }
}

export default utils

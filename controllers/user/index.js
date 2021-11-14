import BaseController from '../base-controller'
import { User } from '../../models'
import { redis, loginTimeKey, smsCodeKey } from '../../db'
import { sessionKey } from '../../config/session'
import { checkTicket, getLoginPack } from '../../plugins'

class Controller extends BaseController {
  constructor() {
    super(User)
  }

  register = async ctx => {
    let result
    const { phone, code, username } = ctx.request.body

    // 获取redis中的验证码
    const key = smsCodeKey(phone)
    const smsCode = await redis.get(key)
    
    if (code == smsCode) {
      redis.del(key)
      await new User({ phone, username }).save()
      result = '注册成功'
    } else {
      resule = '验证码错误'
    }

    ctx.body = result
  }

  login = async ctx => {
    let result
    const { phone } = ctx.request.body

    console.log(await checkTicket())

    // TODO: 测试接口，现在登录没有校验验证码或密码
    const user = await User.findOne({ phone }).select('_id')
    const userId = user._id.toString()
    const key = loginTimeKey(userId)

    // 判断是否存在登录
    const loginTime = await redis.get(key)
    if (loginTime) {
      result = '注意：该账号已在其他设备登录'
    } else {
      result = '登录成功'
    }

    // redis中存储登录时间
    const time = +new Date()
    redis.set(key, time)

    ctx.session.userId = userId
    ctx.session.loginTime = time

    ctx.body = result
  }

  logout = async ctx => {
    // 清除redis
    const sessionId = ctx.cookies.get(sessionKey) || 'no_session_id'
    const { userId } = await redis.hgetall(sessionId)
    const key = loginTimeKey(userId)
    redis.del(key)

    // 清空session
    ctx.session = {}

    // 清除cookies
    let cookieOption = {
      maxAge: -1,
      httpOnly: false
    }
    ctx.cookies.set(sessionKey, '', cookieOption)
    ctx.cookies.set(`${sessionKey}.sig`, '', cookieOption)

    ctx.body = '安全退出成功'
  }
}

export default new Controller
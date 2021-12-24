import koaRouter from 'koa-router'
import { creatCaptcha, sendSms, err, res } from '../../../plugins'
import { redis, imgCodeKey, smsCodeKey } from '../../../db'
import { user } from '../../../controllers'

const router = koaRouter()

// !!!此路由为不进行权限验证的api: 获取图片验证码 发送短信验证码 注册 登录

/**
 * 获取图片验证码
 */
router.get('/captcha', async ctx => {
  const { phone } = ctx.query
  const { code, svg } = creatCaptcha() // 生成验证码
  const key = imgCodeKey(phone)
  redis.set(key, code) // 存储图片验证码
  redis.expire(key, 60 * 5) // 有效期5分钟
  ctx.body = svg
})

/**
 * 发送短信
 */
router.post('/sms', async ctx => {
  let result
  const { phone } = ctx.request.body

  if (!/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(phone)) {
    ctx.body = err('请输入合法的手机号')
    return
  }
  // 获取短信验证码
  const smsKey = smsCodeKey(phone)
  const smsCode = await redis.get(smsKey)

  // smsCode存在即说明120s内发送过
  if (smsCode) {
    result = err('请勿频繁发送')
  } else {
    const random6num = Math.random().toString().slice(-5)
    await sendSms(phone, random6num) // 发送短信
    redis.set(smsKey, random6num) // 存储短信验证码：防止频繁调用或用户验证
    redis.expire(smsKey, 60 * 2) // 有效期120s
    result = res()
  }

  ctx.body = result
})

/**
 * 注册
 */
router.post('/register', user.register)

/**
 * 获取rsa包
 */
router.get('/loginPack', user.pack)

/**
 * 登录
 */
router.post('/login', user.login)

export default router
import koaRouter from 'koa-router'
import { creatCaptcha, sendSms } from '../../../plugins'
import { redis, imgCodeKey, smsCodeKey } from '../../../db'
import { user } from '../../../controllers'

const router = koaRouter()

// !!!此路由为不进行权限验证的api: 获取图片验证码 发送短信验证码 注册 登录

/**
 * 验证码验证流程：
 * 1、调用/captcha接口，获取图片验证码（query参数为手机号）
 * 2、调用/sms接口，发送短信（body参数为图片验证码和手机号），出现如下情况：
 *    a: 图片验证码验证验证通过，并且120s内没有发送过短信，则发送短信验证码
 *    b: 图片验证码验证通过或者120s内发送过短信，返回失败
 */

/**
 * 获取图片验证码
 */
router.get('/captcha', async ctx => {
  const { phone } = ctx.query
  const { code, svg } = creatCaptcha() // 生成验证码
  const key = imgCodeKey(phone)
  redis.set(key, code) // 存储图片验证码
  redis.expire(key, 60 * 15) // 有效期15分钟
  ctx.body = svg
})

/**
 * 发送短信
 */
router.post('/sms', async ctx => {
  let result
  const { phone, code } = ctx.request.body

  // 根据phone生成redis中短信验证码和图片验证码的key
  const smsKey = smsCodeKey(phone)
  const imgKey = imgCodeKey(phone)

  const imgCode = await redis.get(imgKey) // 获取图片验证码
  const smsCode = await redis.get(smsKey) // 获取短信验证码

  // smsCode存在即说明120s内发送过
  if (smsCode) {
    result = '请勿频繁发送'
  } else if (!imgCode || code != imgCode) {
    result = '验证码错误'
  } else {
    const random6num = Math.random().toString().slice(-5)
    redis.del(imgKey) // 删除图片验证码
    result = await sendSms(phone, random6num) // 发送短信
    redis.set(smsKey, random6num) // 存储短信验证码：防止频繁调用
    redis.expire(smsKey, 60 * 2) // 有效期120s
  }

  ctx.body = result
})

/**
 * 注册
 */
router.post('/register', user.register)

/**
 * 登录
 */
router.post('/login', user.login)

export default router
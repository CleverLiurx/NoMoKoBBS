import koaRouter from 'koa-router'
import { creatCaptcha, sendSms } from '../../../plugins'
import { redis } from '../../../db'

const router = koaRouter()

// !!!此路由为不进行权限验证的api

const imgCodeKey = phone => `img_code_${phone}` // 图片验证码存储的key
const smsCodeKey = phone => `sms_code_${phone}` // 短信验证码存储的key

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
  let result

  try {
    const { phone } = ctx.query
    const { code, svg } = creatCaptcha()
    const key = imgCodeKey(phone)
    await redis.set(key, code, 60 * 15) // 存储图片验证码，有效期15分钟
    result = svg
  } catch (e) {
    result = 'Error'
  }

  ctx.body = result
})

/**
 * 发送短信
 */
router.post('/sms', async ctx => {
  const { phone, code } = ctx.request.body
  const smsKey = smsCodeKey(phone)
  const imgKey = imgCodeKey(phone)
  let result
  
  try {
    const imgCode = await redis.get(imgKey) // 图片验证码
    const smsCode = await redis.get(smsKey) // 短信验证码
    if (smsCode) {
      result = '请勿频繁发送'
    } else if (!imgCode || code != imgCode) {
      result = '验证码错误'
    } else {
      const random6num = Math.random().toString().slice(-5)
      await redis.del(imgKey) // 删除原图片验证码
      result = await sendSms(phone, random6num) // 发送短信
      await redis.set(smsKey, random6num, 60 * 2) // 存储短信验证码，120秒
    }
  } catch (e) {
    result = e
  }

  ctx.body = result
})

export default router
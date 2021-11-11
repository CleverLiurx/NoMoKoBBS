import koaRouter from 'koa-router'
import { creatCaptcha } from '../../../plugins'
import { redis } from '../../../db'

const router = koaRouter()

// !!!此路由为不进行权限验证的api

/**
 * 获取图片验证码
 */
router.get('/captcha', ctx => {
  const { phone } = ctx.query
  const { code, svg } = creatCaptcha()
  // TODO:redis存储phone-code
  ctx.body = svg
})

/**
 * 发送短信
 */
router.post('/sms', async ctx => {
  await redis.set('key1', 'value1', 3)
  await redis.set('keys', 'values')
  await redis.del('key2')
  console.log(await redis.get('key2'))
  console.log(await redis.get('key1'))
  ctx.body = 'ok'
})

export default router
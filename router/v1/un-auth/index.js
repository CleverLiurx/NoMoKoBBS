import koaRouter from 'koa-router'
import { creatCaptcha } from '../../../plugins'

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

export default router
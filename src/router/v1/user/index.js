import koaRouter from 'koa-router'

import { user } from '../../../controllers'

const router = koaRouter()

router
  .get('/', user.getUserInfo)
  .get('/logout', user.logout)

export default router
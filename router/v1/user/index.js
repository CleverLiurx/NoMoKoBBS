import koaRouter from 'koa-router'

import { user } from '../../../controllers'

const router = koaRouter()

router
  .get('/test', user.test)

export default router
import koaRouter from 'koa-router'

import { reply } from '../../../controllers'

const router = koaRouter()

router
  .post('/add', reply.add)

export default router
import koaRouter from 'koa-router'

import { topic } from '../../../controllers'

const router = koaRouter()

router
  .post('/add', topic.add)

export default router
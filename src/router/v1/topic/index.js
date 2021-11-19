import koaRouter from 'koa-router'

import { topic } from '../../../controllers'

const router = koaRouter()

router
  .post('/add', topic.add)
  .get('/', topic.getList)

export default router
import koaRouter from 'koa-router'

import { star } from '../../../controllers'

const router = koaRouter()

router
  .put('/', star.update)

export default router
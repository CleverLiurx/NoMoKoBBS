import koaRouter from 'koa-router'

import { parise } from '../../../controllers'

const router = koaRouter()

router
  .put('/', parise.update)

export default router
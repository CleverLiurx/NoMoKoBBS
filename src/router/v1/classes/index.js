import koaRouter from 'koa-router'

import { classes } from '../../../controllers'

const router = koaRouter()

router
  .post('/add', classes.add)

export default router
import koaRouter from 'koa-router'

import { classes } from '../../../controllers'

const router = koaRouter()

router
  .post('/', classes.add)
  .get('/', classes.getList)

export default router
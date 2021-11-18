import koaRouter from 'koa-router'

import un_auth from './un-auth'
import user from './user'

const router = koaRouter()

router
  .use('/un_auth', un_auth.routes())
  .use('/user', user.routes())

export default router

import koaRouter from 'koa-router'

import un_auth from './un-auth'
import user from './user'
import topic from './topic'
import classes from './classes'

const router = koaRouter()

router
  .use('/un_auth', un_auth.routes())
  .use('/user', user.routes())
  .use('/topic', topic.routes())
  .use('/classes', classes.routes())

export default router

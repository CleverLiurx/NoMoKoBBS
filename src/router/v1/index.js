import koaRouter from 'koa-router'

import un_auth from './un-auth'
import user from './user'
import topic from './topic'
import classes from './classes'
import reply from './reply'

const router = koaRouter()

router
  .use('/un_auth', un_auth.routes())
  .use('/user', user.routes())
  .use('/topic', topic.routes())
  .use('/classes', classes.routes())
  .use('/reply', reply.routes())

export default router

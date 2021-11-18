import koaRouter from 'koa-router'
import v1 from './v1'

const router = koaRouter()

router
  .prefix('/api')
  .use('/v1', v1.routes())

export default router

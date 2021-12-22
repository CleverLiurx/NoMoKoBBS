import koaRouter from 'koa-router'

import { reply } from '../../../controllers'

const router = koaRouter()

router
  .post('/', reply.add)
  .get('/:topicId', reply.getList)
  .delete('/:id', reply.del)
  .patch('/hide/:id', reply.hide)

export default router
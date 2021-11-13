import Koa from 'koa'
import compress from 'koa-compress'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import servStatic from 'koa-static'
import config from './config'
import router from './router'
import { mongoConnect } from './db'
import intercept from './middlewares/intercept'
import session from 'koa-session'

// session配置
const session_signed_key = ['some secret hurr']
const session_config = {
  key: 'nomokobbs:sess',
  maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
  rolling: true, // 请求时自动刷新
  renew: false
}

const app = new Koa()

app.keys = session_signed_key

app
  .use(intercept())
  .use(session(session_config, app))
  .use(cors())
  .use(compress({ threshold: 2048 }))
  .use(servStatic('./build'))
  .use(bodyParser())
  .use(router.routes())

mongoConnect()
  .then(() => console.log('mongodb connected successful'))

app.listen(config.port, () => console.log(`server started ${config.port}`))

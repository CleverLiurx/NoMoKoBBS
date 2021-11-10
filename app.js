import Koa from 'koa'
import compress from 'koa-compress'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import servStatic from 'koa-static'
import config from './config'
import router from './router'
import './db/mongo'
import intercept from './middlewares/intercept'

const app = new Koa()

app
  .use(intercept())
  .use(cors())
  .use(compress({ threshold: 2048 }))
  .use(servStatic('./build'))
  .use(bodyParser())
  .use(router.routes())

app.listen(config.port, () => console.log(`server started ${config.port}`))
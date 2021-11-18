import Koa from 'koa'
import compress from 'koa-compress'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import servStatic from 'koa-static'
import config from './config'
import router from './router'
import { mongoClient } from './db'
import intercept from './middlewares/intercept'
import session from 'koa-session'
import { sessionConfig, sessionSigned } from './config/session'
import catchError from './middlewares/catcherror'
import logger from './middlewares/log'

const app = new Koa()

app.keys = sessionSigned

app
  .use(logger())
  .use(catchError())
  .use(intercept())
  .use(session(sessionConfig, app))
  .use(cors())
  .use(compress({ threshold: 2048 }))
  .use(servStatic('./build'))
  .use(bodyParser())
  .use(router.routes())

mongoClient()
  .then(() => console.log('mongodb connected successful'))

app.listen(config.port, () => console.log(`server started ${config.port}`))

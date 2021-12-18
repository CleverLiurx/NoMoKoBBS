import Koa from 'koa'
import compress from 'koa-compress'
import bodyParser from 'koa-bodyparser'
import koaBody from 'koa-body'
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
  .use(cors({ credentials: true }))
  .use(compress({ threshold: 2048 }))
  .use(servStatic('./build', {
    maxage: 1000 * 60 * 60 * 24 * 7
  }))
  .use(bodyParser())
  // .use(koaBody({
  //   multipart: true,
  //   formidable: { maxFileSize: 200*1024*1024 } 
  // }))
  .use(router.routes())

mongoClient()
  .then(() => console.log('mongodb connected successful'))

app.listen(config.port, () => console.log(`server started ${config.port}`))

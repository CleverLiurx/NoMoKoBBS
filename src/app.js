import Koa from "koa";
import compress from "koa-compress";
import koaBody from "koa-body";
import cors from "@koa/cors";
import servStatic from "koa-static";
import path from "path";
import config from "./config";
import router from "./router";
import { mongoClient } from "./db";
import intercept from "./middlewares/intercept";
import session from "koa-session";
import { sessionConfig, sessionSigned } from "./config/session";
import catchError from "./middlewares/catcherror";
import logger from "./middlewares/log";
import history from "koa2-connect-history-api-fallback";
import helmet from "koa-helmet"

const app = new Koa();

app.keys = sessionSigned;

app
  .use(helmet())
  .use(history({ whiteList: ["/api"] }))
  .use(logger())
  .use(catchError())
  .use(intercept())
  .use(session(sessionConfig, app))
  .use(cors({ credentials: true }))
  .use(compress({ threshold: 2048 }))
  .use(servStatic(path.join(__dirname, "../build")))
  .use(
    koaBody({
      multipart: true, // 支持文件上传
      formidable: {
        maxFieldsSize: 2 * 1024 * 1024, // 最大为2兆
        multipart: true, // 支持 multipart-formdate 的表单
      },
    })
  )
  .use(router.routes());

mongoClient().then(() => console.log("mongodb connected successful"));

app.listen(config.port, () => console.log(`server started ${config.port}`));

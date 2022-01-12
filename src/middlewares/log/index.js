import { utils } from "../../plugins";
import saveLog from "../../models/log";

// 判断是否走api接口, 并且非GET请求
const isNotGetApi = (ctx) => {
  return (
    ctx.request.url.indexOf("/api/v1/") > -1 && ctx.request.method != "GET"
  );
};

export default () => {
  return async (ctx, next) => {
    let method, url, userAgent, ip, oDate, content, consuming, status;

    // 请求处理前
    if (isNotGetApi(ctx)) {
      ip = ctx.request.ip.match(/(\d+.?)+/g)[0];
      userAgent = ctx.request.headers["user-agent"];
      url = ctx.request.url;
      method = ctx.request.method;
      oDate = new Date().getTime();
    }

    await next();

    // 请求处理后
    if (isNotGetApi(ctx)) {
      try {
        status = ctx.status == 200 ? 1 : 0;
        consuming = new Date().getTime() - oDate;
        //获取具体操作内容-将参数转换成字符串
        let params = {};
        if (ctx.request.body) {
          params.body = JSON.stringify(ctx.request.body);
        }
        if (ctx.request.params) {
          params.params = JSON.stringify(ctx.request.params);
        }
        if (ctx.query) {
          params.query = JSON.stringify(ctx.query);
        }
        content = JSON.stringify(params);

        const { userId } = await utils.parseSess(ctx);

        //  保存
        const data = {
          method,
          url,
          userAgent,
          ip,
          oDate,
          content,
          consuming,
          status,
          userId,
        };
        saveLog(data);
      } catch (err) {
        console.log(err);
      }
    }
  };
};

import { redis, loginTimeKey } from "../../db";
import { sessionKey, sessionTime } from "../../config/session";
import { utils } from "../../plugins";

// 路由为/api/v1/un_auth的接口
const isUnAuth = (ctx) => {
  return (
    ctx.request.url.indexOf("/api/v1/un_auth") > -1 ||
    (ctx.request.method == "GET" && ctx.request.url !== "/api/v1/user")
  );
};

// 接口请求(/api/v1, 非静态资源)
const isApi = (ctx) => {
  return ctx.request.url.indexOf("/api/v1/") > -1;
};

export default () => {
  return async (ctx, next) => {
    if (isUnAuth(ctx) || !isApi(ctx)) {
      // 放行不用验证的路由和静态资源
      await next();
    } else {
      // 获取session中的userId和loginTime
      const { userId, loginTime, sessionId } = await utils.parseSess(ctx);

      if (!userId || !loginTime) {
        const res = {
          errno: "1006",
          errmsg: "未登录",
        };
        ctx.status = 401;
        ctx.body = JSON.stringify(res);
        return false;
      }

      // session与redis中用户的loginTime对比，不一致则发生了多用户登录
      // TODO: 以后改为登录时消息推送，不在接口中拦截，提升效率
      const key = loginTimeKey(userId);
      const time = await redis.get(key);
      if (time != loginTime) {
        const res = {
          errno: "1007",
          errmsg: "该账号已在另一客户端登录",
          data: {
            loginTime,
          },
        };
        ctx.body = JSON.stringify(res);
        return false;
      }

      // 刷新session时间
      redis.expire(sessionId, sessionTime);

      await next();
    }
  };
};

import BaseController from "../base-controller";
import { User, Record } from "../../models";
import { redis, loginTimeKey, smsCodeKey } from "../../db";
import { sessionKey } from "../../config/session";
import { checkTicket, getLoginPack, utils, res, err } from "../../plugins";
import md5 from "md5";

const cleanUser = (data, config) => {
  const user = { ...data.toJSON(), ...config };
  delete user.password;
  delete user.salt;
  delete user.__v;
  return user;
};

class Controller extends BaseController {
  constructor() {
    super(User);
  }

  pack = (ctx) => (ctx.body = res(getLoginPack()));

  register = async (ctx) => {
    let result;
    const { phone, code, password } = ctx.request.body;

    if (!utils.checkPass(password)) {
      ctx.body = err("请输入符合要求的密码");
      return;
    }

    // 获取redis中的验证码
    const key = smsCodeKey(phone);
    const smsCode = await redis.get(key);

    if (smsCode == code) {
      redis.del(key); // 删除验证码120s限制
      const salt = Math.random().toString(36).slice(-8); // 生成8位密码盐值
      const hash = md5("liurx" + password + salt); // 生成数据库密码密文
      const { _id } = await new Record({}).save();
      const newUser = await new this._model({
        ...ctx.request.body,
        password: hash,
        salt,
        record: _id.toString()
      }).save(); // 保存
      const timeKey = loginTimeKey(newUser._id.toString());
      // redis中存储登录时间
      const time = +new Date();
      redis.set(timeKey, time);

      ctx.session.userId = newUser._id.toString();
      ctx.session.loginTime = time;

      result = res(cleanUser(newUser));
    } else {
      result = err("验证码错误");
    }

    ctx.body = result;
  };

  login = async (ctx) => {
    // rsa解析
    const { phone, password } = await checkTicket(ctx.request.body.text);
    // 模拟
    // const { phone, password } = ctx.request.body

    if (!phone) {
      ctx.body = err("非法登录");
      return;
    }

    // 查询用户
    let user = await this._model.findOne({ phone });
    if (!user) {
      ctx.body = err("用户不存在");
      return;
    }

    const userId = user._id.toString();

    // 验证密码
    let login = false;
    const hash = md5("liurx" + password + user.salt);
    if (hash === user.password) {
      login = true;
    }

    let result;
    if (login) {
      const key = loginTimeKey(userId);
      // 判断是否存在登录
      const loginTime = await redis.get(key);
      if (loginTime) {
        result = res(cleanUser(user, { tip: "该账号在已其他设备登录" }));
      } else {
        result = res(cleanUser(user));
      }

      // redis中存储登录时间
      const time = +new Date();
      redis.set(key, time);

      ctx.session.userId = userId;
      ctx.session.loginTime = time;
    } else {
      result = err("密码错误");
    }

    ctx.body = result;
  };

  logout = async (ctx) => {
    // 清除redis
    const { userId, sessionId } = await utils.parseSess(ctx);
    const key = loginTimeKey(userId);
    redis.del(key); // 清除登录标记
    redis.del(sessionId); // 清除session

    // 清除cookies
    let cookieOption = {
      maxAge: -1,
      httpOnly: false,
    };
    ctx.cookies.set(sessionKey, "", cookieOption);
    ctx.cookies.set(`${sessionKey}.sig`, "", cookieOption);

    ctx.body = res();
  };

  getUserInfo = async (ctx) => {
    let { _id } = ctx.query;
    if (!_id) {
      const { userId } = await utils.parseSess(ctx);
      _id = userId;
    }
    const user = await this._model
      .findById(_id)
      .populate("record")
      .select("-password -salt");
    ctx.body = res(user);
  };

  update = async (ctx) => {
    const { userId } = await utils.parseSess(ctx);
    const { username, sex, birthday, email, avator } = ctx.request.body;
    await this._model.findOneAndUpdate(
      { _id: userId },
      { username, sex, birthday, email, avator }
    );
    ctx.body = res();
  };
}

export default new Controller();

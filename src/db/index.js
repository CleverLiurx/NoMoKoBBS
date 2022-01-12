import mongoClient from "./mongo";
import { store } from "./redis";
import redis from "./redis";

// redis的统一key生成器
const imgCodeKey = (phone) => `img_code_${phone}`; // 图片验证码存储的key
const smsCodeKey = (phone) => `sms_code_${phone}`; // 短信验证码存储的key
const loginTimeKey = (userId) => `login_${userId}`; // 用户登录时间存储的key
const loginTicketKey = (phone) => `ticket_${phone}`; // 防登录接口重写存储的key

export {
  mongoClient,
  store,
  redis,
  imgCodeKey,
  smsCodeKey,
  loginTimeKey,
  loginTicketKey,
};

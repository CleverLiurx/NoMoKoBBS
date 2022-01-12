import NodeRSA from "node-rsa";
import fs from "fs";
import path from "path";
import md5 from "md5";
import { redis, loginTicketKey } from "../../db";

const ticketTime = 7000; // ticket有效期

const publicKey = fs.readFileSync(
  path.resolve(__dirname, "./key/rsa_public_key.txt")
);
const privateKey = fs.readFileSync(
  path.resolve(__dirname, "./key/rsa_private_key.txt")
);

/**
 * 生成ticket
 * 格式：时间戳.随机字符串.md5校验位
 */
function _createTicket() {
  const t = (+new Date()).toString();
  const r = Math.random().toString(36).substr(2);
  const m = md5(md5(t) + r);
  return `${t}.${r}.${m}`;
}

/**
 * 验证ticket
 *  a.格式是否正确
 *  b.md5校验位是否正确
 *  c.时间戳是否超时
 */
function _testTicket(ticket) {
  const data = ticket.split(".");
  // 非法的ticket
  if (data.length !== 3) {
    return false;
  }
  const m = md5(md5(data[0]) + data[1]);
  if (m !== data[2]) {
    return false;
  }

  // ticket超时
  const time = +new Date() - data[0];
  if (time < 0 || time > ticketTime) {
    return false;
  }

  return true;
}

/**
 * 重放请求校验
 */
async function _newTicket(phone, ticket) {
  const key = loginTicketKey(phone);
  const flag = await redis.get(key);
  if (!flag || flag !== ticket) {
    redis.set(key, ticket); // 未重复，存入redis
    redis.expire(key, ticketTime);
    return true;
  } else {
    return false;
  }
}

// 公钥加密: 服务端用不到 加密在客户端进行
function _encrypt(data, k) {
  const nodersa = new NodeRSA(k);
  const encrypted = nodersa.encrypt(data, "base64");
  return encrypted;
}

// 私钥解密
function _decrypt(data) {
  const nodersa = new NodeRSA(privateKey);
  const decrypted = nodersa.decrypt(data, "utf8");
  return decrypted;
}

const getLoginPack = () => ({
  ticket: _createTicket(),
  publicKey,
});

const checkTicket = async (body) => {
  let result;
  const { phone, password, ticket } = JSON.parse(_decrypt(body));
  const t1 = _testTicket(ticket);
  const t2 = await _newTicket(phone, ticket);

  if (t1 && t2) {
    result = { phone, password };
  } else {
    result = {};
  }

  return result;
};

export { getLoginPack, checkTicket };

import { store } from "../db";

const sessionKey = "nomokobbs:sess";
const sessionSigned = ["some secret hurr"];
const sessionTime = 1000 * 60 * 60 * 24 * 3; // 3 days
const sessionConfig = {
  key: sessionKey,
  maxAge: sessionTime,
  store, // session存储在redis中
};

export { sessionConfig, sessionSigned, sessionKey, sessionTime };

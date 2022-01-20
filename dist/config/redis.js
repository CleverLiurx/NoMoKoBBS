"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const isProduction = process.env.NODE_ENV === "production";

const password = isProduction ? "" : "123666";

const host = isProduction ? "" : "";
const port = isProduction ? 6666 : 6666;

exports.default = {
  host,
  port,
  family: 4,
  password,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
  reconnectOnError(err) {
    if (err.message.slice(0, 8) == "READONLY") {
      return true;
    }
  }
};
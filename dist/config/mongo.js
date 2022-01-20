"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const isProduction = process.env.NODE_ENV === "production";

const database = isProduction ? "" : "";

const user = isProduction ? "" : "";
const pass = isProduction ? "" : "";

const host = isProduction ? "" : "";
const port = isProduction ? 22222 : 22222;

// Details: https://segmentfault.com/q/1010000015330823?utm_source=tag-newest
const options = {
  autoIndex: !isProduction // 上线使用mongo shell简历索引
};

const connectionString = `mongodb://${user}:${pass}@${host}:${port}/${database}`;

exports.connectionString = connectionString;
exports.options = options;
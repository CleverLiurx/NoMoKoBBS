"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _qiniuyun = require("../../config/qiniuyun");

const qiniu = require("qiniu");

qiniu.conf.ACCESS_KEY = _qiniuyun.ACCESS_KEY;
qiniu.conf.SECRET_KEY = _qiniuyun.SECRET_KEY;

//构建Token
const uptoken = filename => {
  const putPolicy = new qiniu.rs.PutPolicy(_qiniuyun.bucket + ":" + filename);
  return putPolicy.token();
};

exports.default = (localFile, filename) => {
  return new Promise((resolve, reject) => {
    const extra = new qiniu.io.PutExtra();
    const token = uptoken(filename);
    qiniu.io.putFile(token, filename, localFile, extra, function (err, ret) {
      if (!err) {
        resolve(`${_qiniuyun.website}/${filename}`);
      } else {
        reject("上传失败");
      }
    });
  });
};
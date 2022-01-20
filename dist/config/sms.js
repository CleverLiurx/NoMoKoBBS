"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Details: https://cloud.tencent.com/document/product/382/43197
const clientConf = {
  credential: {
    secretId: "",
    secretKey: ""
  },
  region: "ap-guangzhou",
  profile: {
    signMethod: "HmacSHA256",
    httpProfile: {
      reqMethod: "POST",
      reqTimeout: 30,
      endpoint: "sms.tencentcloudapi.com"
    }
  }
};

// 模版id
const TemplateId = {
  register: "1081585", // 注册
  reset: "1081595", // 重置密码
  general: "1081865" // 默认：通用
};

// app id
const AppId = "";
// 签名
const SignName = "";

exports.clientConf = clientConf;
exports.TemplateId = TemplateId;
exports.AppId = AppId;
exports.SignName = SignName;
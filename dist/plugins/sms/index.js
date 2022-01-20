"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.send = undefined;

var _sms = require("../../config/sms");

const tencentcloud = require("tencentcloud-sdk-nodejs");

const smsClient = tencentcloud.sms.v20210111.Client;

const client = new smsClient(_sms.clientConf);

const createParams = (phone, code, TemplateId, SmsSdkAppId) => {
  // 手机号封装成 ['+8613131451002']
  // Details: https://cloud.tencent.com/document/product/382/43197
  let PhoneNumberSet;
  if (phone instanceof Array) {
    PhoneNumberSet = phone.map(item => `+86${item}`);
  } else {
    PhoneNumberSet = [`+86${phone}`];
  }

  return {
    PhoneNumberSet, // 手机号
    SignName: _sms.SignName, // 签名
    SmsSdkAppId: _sms.AppId,
    TemplateId, // 模版
    ExtendCode: "",
    SenderId: "",
    SessionContext: "",
    TemplateParamSet: [code] // 验证码
  };
};

/**
 *
 * @param {*} phone 手机号 字符串或多号码数组
 * @param {*} code 验证码
 * @param {*} TemplateId 非必需 模版id
 * @param {*} AppId 非必需 签名id
 * @returns Promise
 */
const defaultTempId = _sms.TemplateId.general;
const send = (phone, code, TemplateId = defaultTempId) => {
  const params = createParams(phone, code, TemplateId, _sms.AppId);

  return new Promise((resolve, reject) => {
    client.SendSms(params, err => {
      if (!err) {
        resolve("验证码发送成功");
      }
      reject(err);
    });
  });
};

exports.send = send;
import { clientConf, TemplateId, AppId, SignName } from "../../config/sms";
const tencentcloud = require("tencentcloud-sdk-nodejs");

const smsClient = tencentcloud.sms.v20210111.Client;

const client = new smsClient(clientConf);

const createParams = (phone, code, TemplateId, SmsSdkAppId) => {
  // 手机号封装成 ['+8613131451002']
  // Details: https://cloud.tencent.com/document/product/382/43197
  let PhoneNumberSet;
  if (phone instanceof Array) {
    PhoneNumberSet = phone.map((item) => `+86${item}`);
  } else {
    PhoneNumberSet = [`+86${phone}`];
  }

  return {
    PhoneNumberSet, // 手机号
    SignName, // 签名
    SmsSdkAppId: AppId,
    TemplateId, // 模版
    ExtendCode: "",
    SenderId: "",
    SessionContext: "",
    TemplateParamSet: [code], // 验证码
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
const defaultTempId = TemplateId.general;
const send = (phone, code, TemplateId = defaultTempId) => {
  const params = createParams(phone, code, TemplateId, AppId);

  return new Promise((resolve, reject) => {
    client.SendSms(params, (err) => {
      if (!err) {
        resolve("验证码发送成功");
      }
      reject(err);
    });
  });
};

export { send };

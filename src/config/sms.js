// Details: https://cloud.tencent.com/document/product/382/43197
const clientConf = {
  credential: {
    secretId: 'DUYULw76rO0eDFbgTV9cqqc9RUHpDMFsRTNM',
    secretKey: 'dFB7LNBk48xYtxsgT4xd3AxgRyFG5GGp'
  },
  region: 'ap-guangzhou',
  profile: {
    signMethod: 'HmacSHA256',
    httpProfile: {
      reqMethod: 'POST',
      reqTimeout: 30,
      endpoint: 'sms.tencentcloudapi.com'
    }
  }
}

// 模版id
const TemplateId = {
  register: '1081585', // 注册
  reset: '1081595', // 重置密码
  general: '1081865' // 默认：通用
}

// app id
const AppId = '1400266621'
// 签名
const SignName = '刘容新个人应用'

export { clientConf, TemplateId, AppId, SignName }
import { ACCESS_KEY, SECRET_KEY, bucket, website } from "../../config/qiniuyun";

const qiniu = require("qiniu");

qiniu.conf.ACCESS_KEY = ACCESS_KEY;
qiniu.conf.SECRET_KEY = SECRET_KEY;

//构建Token
const uptoken = (filename) => {
  const putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + filename);
  return putPolicy.token();
};

export default (localFile, filename) => {
  return new Promise((resolve, reject) => {
    const extra = new qiniu.io.PutExtra();
    const token = uptoken(filename);
    qiniu.io.putFile(token, filename, localFile, extra, function (err, ret) {
      if (!err) {
        resolve(`${website}/${filename}`);
      } else {
        reject("上传失败");
      }
    });
  });
};

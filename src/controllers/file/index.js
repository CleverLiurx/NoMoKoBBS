import BaseController from "../base-controller";
import { File } from "../../models";
import { utils, res, err } from "../../plugins";
import path from "path";
import fs from "fs";
import uploadFile from "../../plugins/qiniuyun";

class Controller extends BaseController {
  constructor() {
    super(File);
  }

  upload = async (ctx) => {
    const { href = "", alt = "", slim = true } = ctx.request.body;
    // 获取文件
    const file = ctx.request.files && ctx.request.files.file;
    if (!file) {
      ctx.body = err("请选择文件");
      return;
    }

    // 存储到本地
    const localPath = path.join(__dirname, `../../../temp/`);
    const fileName = file.path.split("/").pop();
    const localFile = `${localPath}${fileName}`;
    fs.renameSync(file.path, localFile);

    // 上传到七牛云
    const url = await uploadFile(localFile, fileName);

    // 数据库记录 
    const fileRecord = {
      url: slim ? url + "?imageslim" : url,
      href,
      alt,
      filename: file.name,
    };
    const result = await new this._model(fileRecord).save();

    ctx.body = res(result);
  };
}

export default new Controller();

import path from "path";
import fs from "fs";
import { err, res } from "../../../plugins";
import koaRouter from "koa-router";

const router = koaRouter();

router.post("/", async (ctx) => {
  // 获取文件类型
  const file = ctx.request.files && ctx.request.files.file;
  if (!file) {
    ctx.body = err("请选择文件");
    return;
  }

  const dirType = file.type.split("/")[0];
  if (dirType !== "image") {
    ctx.body = err("请选择正确的图片类型");
    return;
  }

  // 储存
  const filePath = path.join(__dirname, `../../../../public/image/`);
  const fileType = file.type.split("/")[1];
  const fileName = file.path.split("/").pop();
  fs.renameSync(file.path, `${filePath}${fileName}.${fileType}`);

  let result = { url: `/image/${fileName}.${fileType}`, alt: "", href: "" };
  if (ctx.request.body.returnArray) {
    result = [result];
  }
  ctx.body = res(result);
});

export default router;

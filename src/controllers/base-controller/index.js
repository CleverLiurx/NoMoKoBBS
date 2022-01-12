import { utils, res, err } from "../../plugins";

class BaseController {
  constructor(Model) {
    this._model = Model;
  }

  // 删除
  del = async (ctx) => {
    let { id } = ctx.request.params;
    let result = await this._model.updateOne({ _id: id }, { delFlag: true });
    ctx.body = res(result);
  };

  // 隐藏
  hide = async (ctx) => {
    let { id } = ctx.request.params;
    let result = await this._model.updateOne({ _id: id }, { status: false });
    ctx.body = res(result);
  };
}

export default BaseController;

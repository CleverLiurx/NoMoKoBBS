import BaseController from "../base-controller";
import { Classes, User } from "../../models";
import { utils, res, err } from "../../plugins";

class Controller extends BaseController {
  constructor() {
    super(Classes);
  }

  add = async (ctx) => {
    const {
      classname,
      master,
      canAnon = false,
      description,
      icon,
    } = ctx.request.body;

    // 校验版主是否存在
    const userRecord = await User.findById(master);
    if (!userRecord) {
      ctx.body = err("版主不存在");
      return;
    }

    const result = await new this._model({
      classname,
      master,
      canAnon,
      description,
      icon,
    }).save();
    ctx.body = res(result);
  };

  getList = async (ctx) => {
    const result = await this._model.find({});
    ctx.body = res(result);
  };

  detail = async (ctx) => {
    const { id } = ctx.request.params;
    const result = await this._model.findById(id);
    ctx.body = res(result);
  };
}

export default new Controller();

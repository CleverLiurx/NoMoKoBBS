import BaseController from "../base-controller";
import { Terminal } from "../../models";
import { utils, res, err } from "../../plugins";

class Controller extends BaseController {
  constructor() {
    super(Terminal);
  }

  getList = async (ctx) => {
    const { page = 1, limit = 20, kw = "" } = ctx.query;

    const regStr = kw.trim().replace(/\s+|\s+/g, "|");
    const reg = new RegExp(regStr, "i");
    let filter = {};
    if (kw) {
      filter = {
        keywords: { $elemMatch: { $regex: reg } },
      };
    }

    const result = await this._model
      .find(filter)
      .sort({ starCount: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));

    ctx.body = res(result);
  };

  add = async (ctx) => {
    const { command, keywords, description, example } = ctx.request.body;
    await new this._model({ command, keywords, description, example }).save();
    ctx.body = res();
  };
}

export default new Controller();

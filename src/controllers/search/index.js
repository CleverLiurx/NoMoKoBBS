import BaseController from "../base-controller";
import { Search } from "../../models";
import { utils, res, err } from "../../plugins";

class Controller extends BaseController {
  constructor() {
    super(Search);
  }

  hotSearch = async (ctx) => {
    const result = await this._model
      .find({}, "keywords")
      .sort({ count: -1 })
      .limit(10);
    ctx.body = res(result);
  };
}

export default new Controller();

import BaseController from "../base-controller";
import { Topic, Classes, Star } from "../../models";
import { utils, res, err } from "../../plugins";

class Controller extends BaseController {
  constructor() {
    super(Topic);
  }

  add = async (ctx) => {
    const { classFrom, title, content, topicImage, richContent } =
      ctx.request.body;

    // 校验板块存在
    const classRecord = await Classes.findById(classFrom);
    if (!classRecord) {
      ctx.body = err("板块不存在");
      return;
    }

    const { userId: createBy } = await utils.parseSess(ctx);
    const option = richContent ? { richContent, title } : { topicImage };
    const result = await new this._model({
      classFrom,
      createBy,
      content,
      ...option,
    }).save();
    ctx.body = res(result);
  };

  detail = async (ctx) => {
    const { id } = ctx.request.params;
    const result = await this._model.findById(id);
    ctx.body = res(result);
  };

  getList = async (ctx) => {
    const { isFocus = false } = ctx.query;
    let result;

    if (isFocus) {
      result = await this.getFocus(ctx);
    } else {
      result = await this.getTopic(ctx);
    }

    ctx.body = res(result);
  };

  getTopic = async (ctx) => {
    const {
      classFrom,
      createBy,
      sort = "createTime",
      page = 1,
      limit = 10,
      kw = ""
    } = ctx.query;

    // 生成keywords
    const regList = []
    const keyList = kw.split(' ')
    keyList.forEach(item => {
      const reg = new RegExp(item, 'i')
      regList.push({ title: { $regex: reg } })
    })

    let filter = { isFocus: { $ne: true }, $or: regList };
    if (classFrom) {
      filter.classFrom = classFrom;
    }
    if (createBy) {
      filter.createBy = createBy;
    }
    const result = await this._model
      .find(filter)
      .sort({ [sort]: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));
    return result;
  };

  getFocus = async (ctx) => {
    const result = await this._model.find({ isFocus: true });
    return result;
  };
}

export default new Controller();

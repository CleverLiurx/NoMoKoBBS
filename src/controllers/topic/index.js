import BaseController from '../base-controller'
import { Topic, Classes } from '../../models'
import { utils, res, err } from '../../plugins'

class Controller extends BaseController {
  constructor() {
    super(Topic)
  }

  add = async ctx => {
    const { classFrom, title, content, topicImage, anon } = ctx.request.body

    // 校验板块存在
    const classRecord = await Classes.findById(classFrom)
    if (!classRecord) {
      ctx.body = err('板块不存在')
      return
    }

    const { userId: createBy } = await utils.parseSess(ctx)
    const result = await new this._model({ classFrom, createBy, title, content, topicImage, anon }).save()
    ctx.body = res(result)
  }

  detail = async ctx => {
    const { id } = ctx.request.params
    const result = await this._model.findById(id).populate({ path: 'reply', populate: { path: 'reply' } })
    ctx.body = res(result)
  }

  getList = async ctx => {
    const { classFrom, createBy, sort = 'createTime', page = 1, limit = 20} = ctx.query
    // sort: repliedTime hitsCount replyCount praiseCount starCount
    let filter = {}
    if (classFrom) {
      filter.classFrom = classFrom
    }
    if (createBy) {
      filter.createBy = createBy
    }
    const result = await this._model
      .find(filter)
      .sort({ [sort]: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit))
    ctx.body = res(result)
  }
}

export default new Controller
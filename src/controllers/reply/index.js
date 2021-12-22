import BaseController from '../base-controller'
import { Reply, Topic } from '../../models'
import { utils, res, err } from '../../plugins'
import mongoose from 'mongoose'

class Controller extends BaseController {
  constructor() {
    super(Reply)
  }

  add = async ctx => {
    let result
    const { topicId, content, pid } = ctx.request.body
    const { userId: createBy } = await utils.parseSess(ctx)

    // 验证帖子是否存在
    const topicRecord = await Topic.findById(topicId)
    if (!topicRecord) {
      ctx.body = err('帖子不存在')
      return
    }

    // pid不存在：说明是一级回复
    if (!pid) {
      await Topic.findByIdAndUpdate(topicId, { repliedBy: createBy, repliedTime: new Date() })
      await new this._model({ topicId, content, createBy, hasChild: true }).save()
    } else {
      // 二级回复：查找是否存在一级回复
      const replyRecord = await this._model.findById(pid)
      if (!replyRecord) {
        ctx.body = err('回复不存在')
        return
      }
      await this._model({ content, pid, createBy }).save() // 二级回复不保存topicId
    }

    result = await this._model.find({ topicId }).populate({ path: 'reply', populate: { path: 'reply' } })

    ctx.body = res(result)
  }

  getList = async ctx => {
    let { topicId } = ctx.request.params

    const result = await this._model.find({ topicId }).populate({ path: 'reply', populate: { path: 'reply' } })
    ctx.body = res(result)
  }
}

export default new Controller
import BaseController from '../base-controller'
import { Topic, Star, Record } from '../../models'
import { utils, res, err } from '../../plugins'

class Controller extends BaseController {
  constructor() {
    super(Star)
  }

  update = async ctx => {
    let result
    const { topicId, status } = ctx.request.body

    // 校验帖子存在
    const topicRecord = await Topic.findById(topicId)
    if (!topicRecord) {
      ctx.body = err('帖子不存在')
      return
    }

    const { userId: createBy } = await utils.parseSess(ctx)
    const starRecord = await this._model.findOne({ createBy, topicId })
    if ((!starRecord && status != '1') || !['0', '1', 0, 1].includes(status)) {
      // 首次操作 但是 取消收藏
      result = err('错误的操作')
    } else if (starRecord && starRecord.status == status) {
      // 重复收藏 或 重读取消收藏
      result = err('重复的操作')
    } else {
      let inc = status == '1' ? 1 : -1
      await this._model.findOneAndUpdate({ createBy, topicId }, { createBy, topicId, status }, { upsert: true })
      const topic = await Topic.findByIdAndUpdate(topicId, { $inc: { starCount: inc } }) // 帖子的收藏数+-1
      await Record.findOneAndUpdate({ createBy }, { $inc: { starCount: inc } }) // 用户的收藏数+-1
      await Record.findOneAndUpdate({ createBy: topic.createBy }, { $inc: { beStarCount: inc } }) // 用户的被收藏数+-1
      result = res()
    }

    ctx.body = result
  }
}

export default new Controller
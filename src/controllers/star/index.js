import BaseController from '../base-controller'
import { Topic, Star, Record } from '../../models'
import { utils, res, err } from '../../plugins'

class Controller extends BaseController {
  constructor() {
    super(Star)
  }

  update = async ctx => {
    const { topicId } = ctx.request.body

    // 校验帖子存在
    const topicRecord = await Topic.findById(topicId)
    if (!topicRecord) {
      ctx.body = err('帖子不存在')
      return
    }

    const { userId: createBy } = await utils.parseSess(ctx)
    const starRecord = await this._model.findOne({ createBy, topicId })

    if (!starRecord) {
      await new this._model({ createBy, topicId }).save()
    } else {
      await this._model.updateOne({ createBy, topicId }, { status: !starRecord.status})
    }

    let inc = !starRecord || !starRecord.status ? 1 : -1
    const topic = await Topic.findByIdAndUpdate(topicId, { $inc: { starCount: inc } }) // 帖子的收藏数+-1
    await Record.findOneAndUpdate({ createBy }, { $inc: { starCount: inc } }) // 用户的收藏数+-1
    await Record.findOneAndUpdate({ createBy: topic.createBy }, { $inc: { beStarCount: inc } }) // 用户的被收藏数+-1

    ctx.body = res()
  }
}

export default new Controller
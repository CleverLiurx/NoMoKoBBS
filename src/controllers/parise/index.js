import BaseController from '../base-controller'
import { Topic, Parise, Record, Reply } from '../../models'
import { utils, res, err } from '../../plugins'

class Controller extends BaseController {
  constructor() {
    super(Parise)
  }

  update = async ctx => {
    const { topicId, replyId } = ctx.request.body
    const { userId: createBy } = await utils.parseSess(ctx)

    if (replyId) { // 对回复点赞
      await this.pariseReply(replyId, createBy)
    } else { // 对文章点赞
      await this.pariseTopic(topicId, createBy)
    }

    ctx.body = res()
  }

  pariseReply = async (replyId, createBy) => {
    const replyRecord = await Reply.findById(replyId)
    if (!replyRecord) {
      ctx.body = err('回复不存在')
      return
    }

    const pariseRecord = await this._model.findOne({ createBy, replyId })
    if (!pariseRecord) {
      await new this._model({ createBy, replyId }).save()
    } else {
      await this._model.updateOne({ createBy, replyId }, { status: !pariseRecord.status })
    }

    let inc = !pariseRecord || !pariseRecord.status ? 1 : -1
    await Reply.findByIdAndUpdate(replyId, { $inc: { praiseCount: inc } }) // 帖子的点赞数+-1
    await Record.findOneAndUpdate({ createBy }, { $inc: { praiseCount: inc } }) // 用户的点赞数+-1
    await Record.findOneAndUpdate({ createBy: replyRecord.createBy }, { $inc: { bePraiseCount: inc } }) // 用户的被点赞数+-1
  }

  pariseTopic = async (topicId, createBy) => {
    const topicRecord = await Topic.findById(topicId)
    if (!topicRecord) {
      ctx.body = err('文章不存在')
      return
    }

    const pariseRecord = await this._model.findOne({ createBy, topicId })
    if (!pariseRecord) {
      await new this._model({ createBy, topicId }).save()
    } else {
      await this._model.updateOne({ createBy, topicId }, { status: !pariseRecord.status })
    }

    let inc = !pariseRecord || !pariseRecord.status ? 1 : -1
    await Topic.findByIdAndUpdate(topicId, { $inc: { praiseCount: inc } }) // 帖子的点赞数+-1
    await Record.findOneAndUpdate({ createBy }, { $inc: { praiseCount: inc } }) // 用户的点赞数+-1
    await Record.findOneAndUpdate({ createBy: topicRecord.createBy }, { $inc: { bePraiseCount: inc } }) // 用户的被点赞数+-1
  }
}

export default new Controller
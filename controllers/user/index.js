import BaseController from '../base-controller'
import { User } from '../../models'

class Controller extends BaseController {
  constructor() {
    super(User)
  }

  test = ctx => {
    ctx.body = 'ok'
  }
}

export default new Controller
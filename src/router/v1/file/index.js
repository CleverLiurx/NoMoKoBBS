import path from 'path'
import fs from 'fs'
import { err, res } from '../../../plugins'
import koaRouter from 'koa-router'

const router = koaRouter()

const destPath = path.join(__dirname, '../../../../public')

router.post('/', async ctx => {
  // 获取文件类型
  const file = ctx.request.files && ctx.request.files.file
  if (!file) {
    ctx.body = err("请选择文件")
    return
  }
  const fileType = file.type.split('/')[1]
  // const fileName = file.name
  const fileName = file.path.split('/').pop()
  const dirType = file.type.split('/')[0]
  const filePath = path.join(__dirname, `../../../../public/${dirType}/`)
  // 创建文件夹
  const hasDir = fs.existsSync(filePath)
  if (!hasDir) {
    fs.mkdirSync(filePath)
  }
  // 储存
  fs.renameSync(file.path, `${filePath}${fileName}.${fileType}`)
  ctx.body = res()
})

export default router

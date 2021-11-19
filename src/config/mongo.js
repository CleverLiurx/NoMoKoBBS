const isProduction = process.env.NODE_ENV === 'production'

const database = isProduction ? 'basename' : 'bbs'

const user = isProduction ? 'root' : 'liurx'
const pass = isProduction ? 'password' : '123456'

const host = isProduction ? 'localhost' : '10.11.171.1'
const port = isProduction ? 27017 : 27017

// Details: https://segmentfault.com/q/1010000015330823?utm_source=tag-newest
const options = {
  autoIndex: !isProduction, // 上线使用mongo shell简历索引
}

const connectionString = `mongodb://${user}:${pass}@${host}:${port}/${database}`

export { connectionString, options }

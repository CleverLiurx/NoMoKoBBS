const isProduction = process.env.NODE_ENV === 'production'

const database = isProduction ? 'basename' : 'nomokobbs'

const user = isProduction ? 'root' : 'usernomokobbs'
const pass = isProduction ? 'password' : '201213nomokobbs'

const host = isProduction ? 'localhost' : '81.70.165.28'
const port = isProduction ? 27017 : 27017

// Details: https://segmentfault.com/q/1010000015330823?utm_source=tag-newest
const options = {
  autoIndex: !isProduction, // 上线使用mongo shell简历索引
}

const connectionString = `mongodb://${user}:${pass}@${host}:${port}/${database}`

export { connectionString, options }

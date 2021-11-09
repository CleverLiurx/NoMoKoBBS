const isProduction = process.env.NODE_ENV === 'production'

const database = isProduction ? 'basename' : 'basename'

const user = isProduction ? 'root' : 'root'
const pass = isProduction ? 'password' : 'pass_word'

const host = isProduction ? 'localhost' : 'localhost'
const port = isProduction ? 27017 : 27017

// Details: https://segmentfault.com/q/1010000015330823?utm_source=tag-newest
const options = {
  autoIndex: !isProduction, // 上线使用mongo shell简历索引
}

const connectionString = `mongodb://${user}:${pass}@${host}:${port}/${database}`

export { connectionString, options }

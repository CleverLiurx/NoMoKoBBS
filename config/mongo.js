const isProduction = process.env.NODE_ENV === 'production'

const database = isProduction ? 'basename' : 'base_name'

const user = isProduction ? 'root' : 'user_name'
const pass = isProduction ? 'password' : 'pass_word'

const host = isProduction ? 'localhost' : '10.10.4.99'
const port = isProduction ? 27017 : 21107

// Details: https://segmentfault.com/q/1010000015330823?utm_source=tag-newest
const options = {
  autoIndex: !isProduction, // 上线使用mongo shell简历索引
}

const connectionString = `mongodb://${user}:${pass}@${host}:${port}/${database}`

export { connectionString, options }

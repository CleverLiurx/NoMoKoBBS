const isProduction = process.env.NODE_ENV === 'production'

const pass = isProduction ? 'password' : 'pass_word'

const host = isProduction ? 'localhost' : '10.10.4.99'
const port = isProduction ? 6379 : 3317

const options = {}

const connectionString = `redis://${pass}@${host}:${port}`

export { connectionString, options }

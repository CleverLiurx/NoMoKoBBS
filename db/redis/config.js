const isProduction = process.env.NODE_ENV === 'production'

const pass = isProduction ? 'password' : 'pass'

const host = isProduction ? 'localhost' : 'localhost'
const port = isProduction ? 6379 : 6379

const options = {}

const connectionString = `redis://${pass}@${host}:${port}`

export { connectionString, options }

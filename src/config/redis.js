const isProduction = process.env.NODE_ENV === 'production'

const password = isProduction ? 'password' : '123456'

const host = isProduction ? 'localhost' : '10.11.171.1'
const port = isProduction ? 6379 : 6379

export default {
  host,
  port,
  family: 4,
  password,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
  reconnectOnError(err) {
    if (err.message.slice(0, 8) == 'READONLY') {
      return true;
    }
  }
}

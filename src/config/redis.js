const isProduction = process.env.NODE_ENV === 'production'

const password = isProduction ? 'password' : '201213redis'

const host = isProduction ? 'localhost' : '81.70.165.28'
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

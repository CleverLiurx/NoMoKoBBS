import Redis from 'ioredis'
import config from '../../config/redis'

const redis = new Redis(config)

redis.on('connect', () => console.log('redis connected successful'))

// store用于koa-session的存储
const store = {
  async get(key, maxAge, { rolling }) {
    // console.log('get', key, maxAge, rolling)
    let res = await redis.hgetall(key).then(r => r).catch(e => ({ error: e }))
    return res
  },
  async set(key, sess, maxAge, { rolling, changed }) {
    // console.log('set', key, sess, maxAge, rolling, changed)
    if (changed) {
      let seconds = Math.floor(maxAge / 1000) // koa-session默认时间单位时ms->s
      redis.hmset(key, sess)
      redis.expire(key, seconds)
    }
  },
  async destroy(key) {
    // console.log('destory', key)
    await redis.del(key)
  }
}

export { store }
export default redis

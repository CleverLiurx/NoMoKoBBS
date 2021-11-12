import { createClient } from 'redis'
import { connectionString, options } from '../../config/redis'

const client = createClient({ url: connectionString })

client.on('connect', () => console.log('redis connected successful'))
client.on('error', err => console.log(err))

const set = async (key, value, time) => {
  try {
    await client.set(key, value)
    if (time) {
      await client.expire(key, parseInt(time))
    }
    return 1
  } catch (e) {
    await client.del(key)
    return 0
  }
}

const get = async key => {
  return new Promise(resolve => {
    client.get(key, (err, value) => {
      if (!err) {
        resolve(value)
      }
      resolve(null)
    })
  })
}

const del = async key => {
  return await client.del(key)
}

export default { set, get, del }

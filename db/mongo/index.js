import mongoose from 'mongoose'
import { connectionString, options } from './config'

mongoose.connect(connectionString, { config: options })
  .then(() => console.log('database conntcted successful'))

const db = mongoose.connection

export default db

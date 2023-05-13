import { newConnection } from '@hellocacbantre/db-schemas'
import { Env } from './env'
import { createConnect, SimpleFalcon, SimpleRedlock } from '@hellocacbantre/redis'
import { type Redis } from 'ioredis'

export const RedisIoClient: Redis = createConnect(Env.REDIS_CONNECTION.URI)
export const falcol = new SimpleFalcon(RedisIoClient)
export const redlock = new SimpleRedlock([RedisIoClient])

const { URI, OPTIONS } = Env.MONGO_CONNECTION

export const platformDb = newConnection(URI, {
  ...OPTIONS,
  dbName: 'platform'
})

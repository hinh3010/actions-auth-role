import { createConnect, SimpleFalcon, SimpleRedlock } from '@hellocacbantre/redis'
import { Env } from '../../config'
import { type Redis } from 'ioredis'

export const RedisIoClient: Redis = createConnect(Env.REDIS_CONNECTION.URI)
export const falcol = new SimpleFalcon(RedisIoClient)
export const redlock = new SimpleRedlock([RedisIoClient])

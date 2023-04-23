import { createConnect, SimpleFalcon, SimpleRedlock } from '@hellocacbantre/redis'
import { type Redis } from 'ioredis'
import { Env } from '../env'

export const RedisIoClient: Redis = createConnect(Env.REDIS_CONNECTION.URI)
export const falcol = new SimpleFalcon(RedisIoClient)
export const redlock = new SimpleRedlock([RedisIoClient])

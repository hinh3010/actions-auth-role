import { createConnect, SimpleFalcon, SimpleRedlock } from '@hellocacbantre/redis'
import { Env } from '../config'

export const RedisIoClient = createConnect(Env.REDIS_CONNECTION.URI)
export const falcol = new SimpleFalcon(RedisIoClient)
export const redlock = new SimpleRedlock([RedisIoClient])

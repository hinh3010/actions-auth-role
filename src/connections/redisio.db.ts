import { SimpleFalcon, SimpleRedlock, createConnect } from '@hellocacbantre/redis'
import { type Redis } from 'ioredis'
import { type IContext } from '../@types'

export const getRedisIoClient = (uri: string): Redis => {
  return createConnect(uri)
}

export const getFalcol = (context: IContext): SimpleFalcon => {
  const { redisDb } = context
  const redisClient = getRedisIoClient(redisDb.uri)
  const falcol = new SimpleFalcon(redisClient)
  return falcol
}

export const getRedlock = (context: IContext): SimpleRedlock => {
  const { redisDb } = context
  const redisClient = getRedisIoClient(redisDb.uri)
  const redlock = new SimpleRedlock([redisClient])
  return redlock
}

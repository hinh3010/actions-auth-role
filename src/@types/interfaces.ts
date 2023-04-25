import { type Request } from 'express'
import type Redis from 'ioredis'
import { type Connection } from 'mongoose'

export interface IError {
  status: number
  message: string
}

export interface ICustomRequest extends Request {
  user?: Record<string, any>
}

export interface IContext {
  mongodb: Connection
  redisDb: Redis
}

import { ACCOUNT_ROLES_TYPE } from '@hellocacbantre/db-schemas'
import express from 'express'
import { AuthRole } from '..'
import { type IError } from '../@types'
import { RedisIoClient, platformDb } from './connect'

const app = express()
const authRole = new AuthRole({
  mongoDb: {
    instance: platformDb
  },
  redisDb: {
    instance: RedisIoClient
  }
})

const handlerError = (err: IError, _: any, res: any, __: any) => {
  return res.json({
    status: err.status ?? 500,
    message: err.message
  })
}

app.get('/', authRole.checkRole(ACCOUNT_ROLES_TYPE.User), authRole.isUser, (req, res) => {
  res.send('Xin chào, đây là trang chủ!')
})

app.use(handlerError)

app.listen(3001, () => {
  console.log('Server đang chạy trên cổng 3000...')
})

// ts-node-esm src/tests/index.ts

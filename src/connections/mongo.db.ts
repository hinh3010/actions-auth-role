import { type IStoreDB, createConnect, newConnection } from '@hellocacbantre/db-schemas'
import { type IContext } from '../@types'
import { type Connection } from 'mongoose'

export const getStoreDb = (context: IContext): IStoreDB => {
  const { mongoDb } = context
  const db: Connection = newConnection(mongoDb.uri, mongoDb.options)
  return createConnect(db)
}

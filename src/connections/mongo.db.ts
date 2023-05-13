import { type IContext } from '@hellocacbantre/context'
import { createConnect, type IStoreDB } from '@hellocacbantre/db-schemas'

export const getStoreDb = (context: IContext): IStoreDB => {
  const { mongoDb } = context
  return createConnect(mongoDb.instance)
}

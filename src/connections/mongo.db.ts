import { newConnection } from '@hellocacbantre/db-schemas'
import { Env } from '../config'

const { URI, OPTIONS } = Env.MONGO_CONNECTION

export const platformDb = newConnection(URI, {
  ...OPTIONS,
  dbName: 'platform'
})

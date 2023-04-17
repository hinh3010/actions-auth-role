import { createConnect } from '@hellocacbantre/db-schemas'
import { platformDb } from '../connections/mongo.db'

export const { getModel, getConnection } = createConnect(platformDb)

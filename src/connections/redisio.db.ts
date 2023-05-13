import { type IContext } from '@hellocacbantre/context'
import { SimpleFalcon, SimpleRedlock } from '@hellocacbantre/redis'

export const getFalcol = (context: IContext): SimpleFalcon => {
  const { redisDb } = context
  const falcol = new SimpleFalcon(redisDb.instance)
  return falcol
}

export const getRedlock = (context: IContext): SimpleRedlock => {
  const { redisDb } = context
  const redlock = new SimpleRedlock([redisDb.instance])
  return redlock
}

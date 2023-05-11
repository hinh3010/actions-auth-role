import { getFalcol } from '../connections/redisio.db'
import { type IContext } from '@hellocacbantre/context'

export const getJwtSetting = (context: IContext) => {
  const falcol = getFalcol(context)
  return async (key: string): Promise<string> => {
    return (await falcol.get(`global_setting:${key}`)) ?? ''
  }
}

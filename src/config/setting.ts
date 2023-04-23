import { type Context } from './../@types/interfaces'
import { SimpleFalcon } from '@hellocacbantre/redis'

export const getJwtSetting = (context: Context) => {
  const falcol = new SimpleFalcon(context.redisDb)
  return async (key: string): Promise<string> => {
    return (await falcol.get(`global_setting:${key}`)) ?? ''
  }
}

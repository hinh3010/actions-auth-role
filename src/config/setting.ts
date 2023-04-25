import { type IContext } from './../@types/interfaces'
import { SimpleFalcon } from '@hellocacbantre/redis'

export const getJwtSetting = (context: IContext) => {
  const falcol = new SimpleFalcon(context.redisDb)
  return async (key: string): Promise<string> => {
    return (await falcol.get(`global_setting:${key}`)) ?? ''
  }
}

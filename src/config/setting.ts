import Bluebird from 'bluebird'
import { falcol } from '../connections/redisio.db'

export const getJwtSetting = async () => {
  const [
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES,
    REFRESH_TOKEN_EXPIRES,
    REFRESH_TOKEN_SECRET
  ]: any = await Bluebird.all([
    falcol.get('global_setting:jwt_access_token_secret'),
    falcol.get('global_setting:jwt_access_token_expires'),
    falcol.get('global_setting:jwt_refresh_token_expires'),
    falcol.get('global_setting:jwt_refresh_token_secret')
  ])

  return {
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES,
    REFRESH_TOKEN_EXPIRES,
    REFRESH_TOKEN_SECRET
  }
}

import Bluebird from 'bluebird'
import Jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken'
import { type ObjectId } from 'mongoose'
import { getJwtSetting } from './../config'
import { type IContext } from '../@types'

// import CryptoJS from 'crypto-js'
// const privateKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex)
// const publicKey = CryptoJS.SHA256(privateKey).toString()
// console.log(publicKey)

export interface IPayload extends JwtPayload {
  _id: ObjectId
}

export class JwtService {
  private readonly context: IContext

  constructor(context: IContext) {
    this.context = context
  }

  public async generateAccessToken(payload: IPayload): Promise<string | unknown> {
    const [secret, expires] = await Bluebird.all([
      getJwtSetting(this.context)('jwt_access_token_secret'),
      getJwtSetting(this.context)('jwt_access_token_expires')
    ])

    const options: SignOptions = {
      expiresIn: expires,
      algorithm: 'HS256',
      subject: 'authentication'
    }

    try {
      return Jwt.sign(payload, secret, options)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  public async generateRefreshToken(payload: IPayload): Promise<string | unknown> {
    const [secret, expires] = await Bluebird.all([
      getJwtSetting(this.context)('jwt_refresh_token_secret'),
      getJwtSetting(this.context)('jwt_refresh_token_expires')
    ])

    const options: SignOptions = {
      expiresIn: expires,
      algorithm: 'HS256',
      subject: 'authentication'
    }

    try {
      return Jwt.sign(payload, secret, options)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  public async verifyAccessToken(token: string) {
    const secret = await getJwtSetting(this.context)('jwt_access_token_secret')
    return Jwt.verify(token, secret)
  }

  public async verifyRefreshToken(refreshToken: string) {
    const secret = await getJwtSetting(this.context)('jwt_refresh_token_secret')
    return Jwt.verify(refreshToken, secret)
  }
}

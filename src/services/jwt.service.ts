import { getJwtSetting } from './../config'
import CryptoJS from 'crypto-js'
import Jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken'
import { type ObjectId } from 'mongoose'

const privateKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex)
const publicKey = CryptoJS.SHA256(privateKey).toString()
console.log(publicKey)

export interface IPayload extends JwtPayload {
  _id: ObjectId
}

export class JwtService {
  async generateAccessToken(payload: IPayload): Promise<string | unknown> {
    const setting = await getJwtSetting()
    return new Promise((resolve, reject) => {
      const serret = setting.ACCESS_TOKEN_SECRET
      const options: SignOptions = {
        expiresIn: setting.ACCESS_TOKEN_EXPIRES,
        algorithm: 'HS256',
        subject: 'authentication'
      }
      Jwt.sign(payload, serret, options, (err, token) => {
        if (err) reject(err)
        resolve(token)
      })
    })
  }

  async generateRefreshToken(payload: IPayload): Promise<string | unknown> {
    const setting = await getJwtSetting()

    const serret = setting.REFRESH_TOKEN_SECRET
    const options: SignOptions = {
      expiresIn: setting.REFRESH_TOKEN_EXPIRES,
      algorithm: 'HS256',
      subject: 'authentication'
    }
    try {
      return Jwt.sign(payload, serret, options)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  async verifyAccessToken(token: string) {
    const setting = await getJwtSetting()
    return Jwt.verify(token, setting.ACCESS_TOKEN_SECRET)
  }

  async verifyRefreshToken(refreshToken: string) {
    const setting = await getJwtSetting()
    return Jwt.verify(refreshToken, setting.REFRESH_TOKEN_SECRET)
  }
}

import { type IContext } from '@hellocacbantre/context'
import { ACCOUNT_ROLES_TYPE, type IUser } from '@hellocacbantre/db-schemas'
import Bluebird from 'bluebird'
import { type NextFunction, type Response } from 'express'
import createError from 'http-errors'
import { type ICustomRequest } from '../@types'

import { getJwtSetting } from '../config'
import { getStoreDb } from '../connections/mongo.db'
import { getFalcol } from '../connections/redisio.db'
import { JwtService } from '../services/jwt.service'
import { convertToSeconds } from '../utils/convertToSeconds'

export class AuthRole {
  private readonly context: IContext
  private readonly jwtService: JwtService

  constructor(context: IContext) {
    this.context = context
    this.jwtService = new JwtService(context)
  }

  private readonly refetchToken = async (req: ICustomRequest, res: Response): Promise<boolean> => {
    try {
      const refreshToken = req.cookies.refreshToken

      const decodedRefreshToken: any = await this.jwtService.verifyRefreshToken(refreshToken)
      const { _id } = decodedRefreshToken

      const falcol = getFalcol(this.context)

      // Each refresh token can only be used once.
      const refreshTokenRedis = await falcol.get(`refreshToken:${_id}`)
      if (refreshTokenRedis !== refreshToken) return false

      // generate new token
      const [newToken, newRefreshToken] = await Bluebird.all([
        this.jwtService.generateAccessToken({ _id }),
        this.jwtService.generateRefreshToken({ _id })
      ])

      const refreshTokenExpiresString = await getJwtSetting(this.context)(
        'jwt_refresh_token_expires'
      )
      const refreshTokenExpiresSeconds = convertToSeconds(refreshTokenExpiresString)

      // add redis
      void falcol.set(`refreshToken:${_id}`, newRefreshToken as string)
      void falcol.expire(`refreshToken:${_id}`, refreshTokenExpiresSeconds)

      // add header
      res.set('Authorization', `Bearer ${newToken}`)

      // add cookies
      // res.cookie('token', newToken, { httpOnly: true, maxAge: 604800 * 1000 })
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        maxAge: refreshTokenExpiresSeconds * 1000
      })

      return true
    } catch (error) {
      return false
    }
  }

  public isUser = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (authorization) {
      const token = authorization.split(' ')[1]
      if (!token) {
        return next(createError.Unauthorized())
      }

      try {
        const decoded: any = await this.jwtService.verifyAccessToken(token)

        const { getModel } = getStoreDb(this.context)

        const User = getModel<IUser>('User')
        const user = await User.findById(decoded._id).lean()

        req.user = user

        return next()
      } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
          const isSuccess = await this.refetchToken(req, res)
          if (isSuccess) return next()
          return next(createError.Unauthorized())
        }
      }
    }
    return next(createError.Unauthorized())
  }

  public checkRole = (role: ACCOUNT_ROLES_TYPE) => {
    return async (req: ICustomRequest, res: Response, next: NextFunction) => {
      const { authorization } = req.headers
      if (authorization) {
        const token = authorization.split(' ')[1]
        if (!token) {
          return next(createError.Unauthorized())
        }

        try {
          const decoded: any = await this.jwtService.verifyAccessToken(token)

          const { getModel } = getStoreDb(this.context)

          const User = getModel<IUser>('User')
          const user = await User.findById(decoded._id).lean()
          const { roles = [] } = user

          if (user.status !== 'active') {
            return next(createError.Forbidden('Your account has not been activated'))
          }

          if (!roles.includes(role)) {
            return next(createError.Forbidden('You do not have permission'))
          }
          req.user = user

          return next()
        } catch (error: any) {
          if (error.name === 'TokenExpiredError') {
            const isSuccess = await this.refetchToken(req, res)
            if (isSuccess) return next()
            return next(createError.Unauthorized())
          }
        }
      }
      return next(createError.Unauthorized())
    }
  }

  public isUserActive = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (authorization) {
      const token = authorization.split(' ')[1]
      if (!token) {
        return next(createError.Unauthorized())
      }
      const decoded: any = await this.jwtService.verifyAccessToken(token)

      const { getModel } = getStoreDb(this.context)

      const User = getModel<IUser>('User')
      const user = await User.findById(decoded._id).lean()

      req.user = user

      return next()
    }
    return next(createError.Unauthorized())
  }

  public isAdmin = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (authorization) {
      const token = authorization.split(' ')[1]
      if (!token) {
        return next(createError.Unauthorized())
      }
      const decoded: any = await this.jwtService.verifyAccessToken(token)

      const { getModel } = getStoreDb(this.context)

      const User = getModel<IUser>('User')
      const user = await User.findById(decoded._id).lean()

      const { roles = [] } = user

      if (user.status !== 'active') {
        return next(createError.Forbidden('Your account has not been activated'))
      }

      if (!roles.includes(ACCOUNT_ROLES_TYPE.Admin)) {
        return next(createError.Forbidden('You do not have permission'))
      }

      req.user = user

      return next()
    }
    return next(createError.Unauthorized())
  }

  public isSuperAdmin = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (authorization) {
      const token = authorization.split(' ')[1]
      if (!token) {
        return next(createError.Unauthorized())
      }
      const decoded: any = await this.jwtService.verifyAccessToken(token)

      const { getModel } = getStoreDb(this.context)

      const User = getModel<IUser>('User')
      const user = await User.findById(decoded._id).lean()

      const { roles = [] } = user

      if (user.status !== 'active') {
        return next(createError.Forbidden('Your account has not been activated'))
      }

      if (!roles.includes(ACCOUNT_ROLES_TYPE.SuperAdmin)) {
        return next(createError.Forbidden('You do not have permission'))
      }

      req.user = user

      return next()
    }
    return next(createError.Unauthorized())
  }
}

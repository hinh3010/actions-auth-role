import { ACCOUNT_ROLES_TYPE, createConnect, type IUser } from '@hellocacbantre/db-schemas'
import { SimpleFalcon } from '@hellocacbantre/redis'
import Bluebird from 'bluebird'
import { type NextFunction, type Response } from 'express'
import createError from 'http-errors'
import { type Context, type CustomRequest } from './@types'
import { JwtService } from './services/jwt.service'

export class AuthRole {
  private readonly context: Context
  private readonly jwtService: JwtService

  constructor(context: Context) {
    this.context = context
    this.jwtService = new JwtService(context)
  }

  private async refetchToken(req: CustomRequest, res: Response): Promise<boolean> {
    try {
      const refreshToken = req.cookies.refreshToken

      const decodedRefreshToken: any = await this.jwtService.verifyRefreshToken(refreshToken)
      const { _id } = decodedRefreshToken

      const { redisDb } = this.context
      const falcol = new SimpleFalcon(redisDb)

      // Each refresh token can only be used once.
      const refreshTokenRedis = await falcol.get(`refreshToken:${_id}`)
      if (refreshTokenRedis !== refreshToken) return false

      // generate new token
      const [newToken, newRefreshToken] = await Bluebird.all([
        this.jwtService.generateAccessToken({ _id }),
        this.jwtService.generateRefreshToken({ _id })
      ])

      // add redis
      void falcol.set(`refreshToken:${_id}`, newRefreshToken as string)
      void falcol.expire(`refreshToken:${_id}`, 2592000)

      // add header
      res.set('Authorization', `Bearer ${newToken}`)

      // add cookies
      res.cookie('token', newToken, { httpOnly: true, maxAge: 604800 * 1000 })
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        maxAge: 2592000 * 1000
      })

      return true
    } catch (error) {
      return false
    }
  }

  public async isUser(req: CustomRequest, res: Response, next: NextFunction) {
    const { authorization } = req.headers
    if (authorization) {
      const token = authorization.split(' ')[1]
      if (!token) {
        return next(createError.Unauthorized())
      }

      try {
        const decoded: any = await this.jwtService.verifyAccessToken(token)

        const { mongodb } = this.context
        const { getModel } = createConnect(mongodb)

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

  checkRole = (role: ACCOUNT_ROLES_TYPE) => {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
      const { authorization } = req.headers
      if (authorization) {
        const token = authorization.split(' ')[1]
        if (!token) {
          return next(createError.Unauthorized())
        }
        const decoded: any = await this.jwtService.verifyAccessToken(token)

        const { mongodb } = this.context
        const { getModel } = createConnect(mongodb)

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
      }
      return next(createError.Unauthorized())
    }
  }

  public async isUserActive(req: CustomRequest, res: Response, next: NextFunction) {
    const { authorization } = req.headers
    if (authorization) {
      const token = authorization.split(' ')[1]
      if (!token) {
        return next(createError.Unauthorized())
      }
      const decoded: any = await this.jwtService.verifyAccessToken(token)

      const { mongodb } = this.context
      const { getModel } = createConnect(mongodb)

      const User = getModel<IUser>('User')
      const user = await User.findById(decoded._id).lean()

      req.user = user

      return next()
    }
    return next(createError.Unauthorized())
  }

  public async isAdmin(req: CustomRequest, res: Response, next: NextFunction) {
    const { authorization } = req.headers
    if (authorization) {
      const token = authorization.split(' ')[1]
      if (!token) {
        return next(createError.Unauthorized())
      }
      const decoded: any = await this.jwtService.verifyAccessToken(token)

      const { mongodb } = this.context
      const { getModel } = createConnect(mongodb)

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

  public async isSuperAdmin(req: CustomRequest, res: Response, next: NextFunction) {
    const { authorization } = req.headers
    if (authorization) {
      const token = authorization.split(' ')[1]
      if (!token) {
        return next(createError.Unauthorized())
      }
      const decoded: any = await this.jwtService.verifyAccessToken(token)

      const { mongodb } = this.context
      const { getModel } = createConnect(mongodb)

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

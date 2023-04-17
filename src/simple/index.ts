import { type NextFunction, type Request, type Response } from 'express'
import createError from 'http-errors'
import { JwtService } from '../services/jwt.service'
import { getModel } from '../models'
import { type IUser, ACCOUNT_ROLES_TYPE } from '@hellocacbantre/db-schemas'
import Bluebird from 'bluebird'
import { falcol } from '../connections/redisio.db'

interface CustomRequest extends Request {
  user?: Record<string, any>
}

export class AuthRole {
  constructor(private readonly jwtService: JwtService = new JwtService()) {}

  refetchToken = async (req: CustomRequest, res: Response): Promise<boolean> => {
    try {
      const refreshToken = req.cookies.refreshToken

      const decodedRefreshToken: any = await this.jwtService.verifyRefreshToken(refreshToken)
      const { _id } = decodedRefreshToken

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

  isUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (authorization) {
      const token = authorization.split(' ')[1]
      if (!token) {
        return next(createError.Unauthorized())
      }

      try {
        const decoded: any = await this.jwtService.verifyAccessToken(token)

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

  isUserActive = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (authorization) {
      const token = authorization.split(' ')[1]
      if (!token) {
        return next(createError.Unauthorized())
      }
      const decoded: any = await this.jwtService.verifyAccessToken(token)

      const User = getModel<IUser>('User')
      const user = await User.findById(decoded._id).lean()

      req.user = user

      return next()
    }
    return next(createError.Unauthorized())
  }

  isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (authorization) {
      const token = authorization.split(' ')[1]
      if (!token) {
        return next(createError.Unauthorized())
      }
      const decoded: any = await this.jwtService.verifyAccessToken(token)

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

  isSuperAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (authorization) {
      const token = authorization.split(' ')[1]
      if (!token) {
        return next(createError.Unauthorized())
      }
      const decoded: any = await this.jwtService.verifyAccessToken(token)

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

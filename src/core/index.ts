import { type IContext } from '@hellocacbantre/context'
import { ACCOUNT_ROLES_TYPE, type IUser } from '@hellocacbantre/db-schemas'
import { type NextFunction, type Response } from 'express'
import createError from 'http-errors'
import { type ICustomRequest } from '../@types'

import { getStoreDb } from '../connections/mongo.db'
import { JwtService } from '../services/jwt.service'

export class AuthRole {
  private readonly context: IContext
  private readonly jwtService: JwtService

  constructor(context: IContext) {
    this.context = context
    this.jwtService = new JwtService(context)
  }

  private readonly isAuthorized = async (req: ICustomRequest, _: Response, next: NextFunction) => {
    const { authorization } = req.headers

    if (!authorization) {
      return next(createError.Unauthorized())
    }

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
    } catch (error) {
      return next(createError.Unauthorized())
    }
  }

  public isUser = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    await this.isAuthorized(req, res, next)
  }

  public isUserActive = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    await this.isAuthorized(req, res, async (error) => {
      if (error) {
        return next(error)
      }

      const { status } = req.user as IUser

      if (status !== 'active') {
        return next(createError.Forbidden('Your account has not been activated'))
      }

      return next()
    })
  }

  public checkRole = (role: ACCOUNT_ROLES_TYPE) => {
    return async (req: ICustomRequest, res: Response, next: NextFunction) => {
      await this.isAuthorized(req, res, async (error) => {
        if (error) {
          return next(error)
        }

        const { status, roles = [] } = req.user as IUser

        if (status !== 'active') {
          return next(createError.Forbidden('Your account has not been activated'))
        }

        if (!roles.includes(role)) {
          return next(createError.Forbidden('You do not have permission'))
        }

        return next()
      })
    }
  }

  public isSuperAdmin = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    await this.isAuthorized(req, res, async (error) => {
      if (error) {
        return next(error)
      }

      const { status, roles = [] } = req.user as IUser

      if (status !== 'active') {
        return next(createError.Forbidden('Your account has not been activated'))
      }

      if (!roles.includes(ACCOUNT_ROLES_TYPE.SuperAdmin)) {
        return next(createError.Forbidden('You do not have permission'))
      }

      return next()
    })
  }

  public isAdmin = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    await this.isAuthorized(req, res, async (error) => {
      if (error) {
        return next(error)
      }

      const { status, roles = [] } = req.user as IUser

      if (status !== 'active') {
        return next(createError.Forbidden('Your account has not been activated'))
      }

      if (!roles.includes(ACCOUNT_ROLES_TYPE.Admin)) {
        return next(createError.Forbidden('You do not have permission'))
      }

      return next()
    })
  }
}

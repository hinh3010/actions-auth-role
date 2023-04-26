import { type IPayload } from './jwt.service'
import passport, { type PassportStatic } from 'passport'
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  type VerifiedCallback as JwtVerifiedCallback
} from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'

import {
  ACCOUNT_STATUS_TYPE,
  ACCOUNT_TYPE,
  createConnect,
  type IUser
} from '@hellocacbantre/db-schemas'

import { getJwtSetting } from '../config'
import { type IContext } from '../@types'
import { RedisIoClient } from '../tests/connections/redisio.db'
import { platformDb } from '../tests/connections/mongo.db'

export const { getModel, getConnection } = createConnect(platformDb)

export class PassportService {
  private readonly passport: PassportStatic
  private readonly context: IContext

  constructor(context: IContext) {
    this.passport = passport
    this.context = context
    this.configureLocalStrategy()
    void this.configureJwtStrategy()
    // this.configureGoogleStrategy()
    // this.configureFacebookStrategy()
  }

  private configureLocalStrategy(): void {
    const localOptions = {
      usernameField: 'email',
      passwordField: 'password'
    }

    this.passport.use(
      new LocalStrategy(
        localOptions,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (email: string, password: string, done) => {
          try {
            const User = getModel<IUser>('User')

            const user = await User.findOne({
              email,
              accountType: ACCOUNT_TYPE.Account
            })

            if (!user) {
              done(null, false, {
                message: 'Incorrect email or password.'
              })
              return
            }

            const isPasswordMatch = await user.isValidPassword(password)

            if (!isPasswordMatch) {
              done(null, false, {
                message: 'Incorrect email or password.'
              })
              return
            }

            if (user.status === ACCOUNT_STATUS_TYPE.Banned) {
              done(null, false, {
                message: 'Account banned'
              })
              return
            }

            done(null, user)
          } catch (error) {
            done(error, false)
          }
        }
      )
    )
  }

  private async configureJwtStrategy(): Promise<void> {
    const jwtOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: await getJwtSetting(this.context)('session_secret')
    }

    this.passport.use(
      new JwtStrategy(jwtOptions, async (payload: IPayload, done: JwtVerifiedCallback) => {
        try {
          const User = getModel<IUser>('User')

          const user = await User.findById(payload._id)

          if (!user) {
            done(null, false)
            return
          }

          done(null, user)
        } catch (error) {
          done(error, false)
        }
      })
    )
  }

  // private configureGoogleStrategy(): void {
  //   const googleOptions: StrategyOptions = {
  //     clientID: process.env.GOOGLE_CLIENT_ID ?? '',
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  //     callbackURL: process.env.GOOGLE_CALLBACK_URL
  //   }

  //   this.passport.use(
  //     new GoogleStrategy(
  //       googleOptions,
  //       // eslint-disable-next-line @typescript-eslint/no-misused-promises
  //       async (
  //         accessToken: string,
  //         refreshToken: string,
  //         profile: Profile,
  //         done
  //       ) => {
  //         try {
  //           let user = await User.findOne({ 'google.id': profile.id })

  //           if (!user && profile.emails) {
  //             user = new User({
  //               email: profile.emails[0].value,
  //               displayName: profile.displayName,
  //               google: {
  //                 id: profile.id,
  //                 token: accessToken
  //               }
  //             })
  //             await user.save()
  //           }

  //           done(null, user ?? {})
  //         } catch (error: any) {
  //           done(error, false)
  //         }
  //       }
  //     )
  //   )
  // }

  // private configureFacebookStrategy(): void {
  //   const facebookOptions: StrategyOption = {
  //     clientID: process.env.FACEBOOK_APP_ID ?? '',
  //     clientSecret: process.env.FACEBOOK_APP_SECRET ?? '',
  //     callbackURL: process.env.FACEBOOK_CALLBACK_URL ?? '',
  //     profileFields: ['id', 'displayName', 'photos', 'email']
  //   }

  //   this.passport.use(
  //     new FacebookStrategy(
  //       facebookOptions,
  //       // eslint-disable-next-line @typescript-eslint/no-misused-promises
  //       async (accessToken, refreshToken, profile, done) => {
  //         try {
  //           let user = await User.findOne({ 'facebook.id': profile.id })

  //           if (!user && profile.emails) {
  //             user = new User({
  //               email: profile.emails[0].value,
  //               displayName: profile.displayName,
  //               facebook: {
  //                 id: profile.id,
  //                 token: accessToken
  //               }
  //             })
  //             await user.save()
  //           }

  //           done(null, user)
  //         } catch (error: any) {
  //           done(error, false)
  //         }
  //       }
  //     )
  //   )
  // }

  authenticate(strategyName: string, options: object) {
    return passport.authenticate(strategyName, options)
  }
}

const context = {
  mongodb: platformDb,
  redisDb: RedisIoClient
}

export const passportService = new PassportService(context)

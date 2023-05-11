"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportService = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const passport_local_1 = require("passport-local");
const db_schemas_1 = require("@hellocacbantre/db-schemas");
const config_1 = require("../config");
const mongo_db_1 = require("../connections/mongo.db");
class PassportService {
    constructor(context) {
        this.passport = passport_1.default;
        this.context = context;
        this.configureLocalStrategy();
        void this.configureJwtStrategy();
        // this.configureGoogleStrategy()
        // this.configureFacebookStrategy()
    }
    configureLocalStrategy() {
        const localOptions = {
            usernameField: 'email',
            passwordField: 'password'
        };
        this.passport.use(new passport_local_1.Strategy(localOptions, 
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        (email, password, done) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { getModel } = (0, mongo_db_1.getStoreDb)(this.context);
                const User = getModel('User');
                const user = yield User.findOne({
                    email,
                    accountType: db_schemas_1.ACCOUNT_TYPE.Account
                });
                if (!user) {
                    done(null, false, {
                        message: 'Incorrect email or password.'
                    });
                    return;
                }
                const isPasswordMatch = yield user.isValidPassword(password);
                if (!isPasswordMatch) {
                    done(null, false, {
                        message: 'Incorrect email or password.'
                    });
                    return;
                }
                if (user.status === db_schemas_1.ACCOUNT_STATUS_TYPE.Banned) {
                    done(null, false, {
                        message: 'Account banned'
                    });
                    return;
                }
                done(null, user);
            }
            catch (error) {
                done(error, false);
            }
        })));
    }
    configureJwtStrategy() {
        return __awaiter(this, void 0, void 0, function* () {
            const jwtOptions = {
                jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: yield (0, config_1.getJwtSetting)(this.context)('session_secret')
            };
            this.passport.use(new passport_jwt_1.Strategy(jwtOptions, (payload, done) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { getModel } = (0, mongo_db_1.getStoreDb)(this.context);
                    const User = getModel('User');
                    const user = yield User.findById(payload._id);
                    if (!user) {
                        done(null, false);
                        return;
                    }
                    done(null, user);
                }
                catch (error) {
                    done(error, false);
                }
            })));
        });
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
    authenticate(strategyName, options) {
        return passport_1.default.authenticate(strategyName, options);
    }
}
exports.PassportService = PassportService;
// export const passportService = new PassportService(context)

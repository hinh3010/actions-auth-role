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
exports.AuthRole = void 0;
const db_schemas_1 = require("@hellocacbantre/db-schemas");
const redis_1 = require("@hellocacbantre/redis");
const bluebird_1 = __importDefault(require("bluebird"));
const http_errors_1 = __importDefault(require("http-errors"));
const jwt_service_1 = require("./services/jwt.service");
class AuthRole {
    constructor(context) {
        this.checkRole = (role) => {
            return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                const { authorization } = req.headers;
                if (authorization) {
                    const token = authorization.split(' ')[1];
                    if (!token) {
                        return next(http_errors_1.default.Unauthorized());
                    }
                    const decoded = yield this.jwtService.verifyAccessToken(token);
                    const { mongodb } = this.context;
                    const { getModel } = (0, db_schemas_1.createConnect)(mongodb);
                    const User = getModel('User');
                    const user = yield User.findById(decoded._id).lean();
                    const { roles = [] } = user;
                    if (user.status !== 'active') {
                        return next(http_errors_1.default.Forbidden('Your account has not been activated'));
                    }
                    if (!roles.includes(role)) {
                        return next(http_errors_1.default.Forbidden('You do not have permission'));
                    }
                    req.user = user;
                    return next();
                }
                return next(http_errors_1.default.Unauthorized());
            });
        };
        this.context = context;
        this.jwtService = new jwt_service_1.JwtService(context);
    }
    refetchToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refreshToken;
                const decodedRefreshToken = yield this.jwtService.verifyRefreshToken(refreshToken);
                const { _id } = decodedRefreshToken;
                const { redisDb } = this.context;
                const falcol = new redis_1.SimpleFalcon(redisDb);
                // Each refresh token can only be used once.
                const refreshTokenRedis = yield falcol.get(`refreshToken:${_id}`);
                if (refreshTokenRedis !== refreshToken)
                    return false;
                // generate new token
                const [newToken, newRefreshToken] = yield bluebird_1.default.all([
                    this.jwtService.generateAccessToken({ _id }),
                    this.jwtService.generateRefreshToken({ _id })
                ]);
                // add redis
                void falcol.set(`refreshToken:${_id}`, newRefreshToken);
                void falcol.expire(`refreshToken:${_id}`, 2592000);
                // add header
                res.set('Authorization', `Bearer ${newToken}`);
                // add cookies
                res.cookie('token', newToken, { httpOnly: true, maxAge: 604800 * 1000 });
                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    maxAge: 2592000 * 1000
                });
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    isUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { authorization } = req.headers;
            if (authorization) {
                const token = authorization.split(' ')[1];
                if (!token) {
                    return next(http_errors_1.default.Unauthorized());
                }
                try {
                    const decoded = yield this.jwtService.verifyAccessToken(token);
                    const { mongodb } = this.context;
                    const { getModel } = (0, db_schemas_1.createConnect)(mongodb);
                    const User = getModel('User');
                    const user = yield User.findById(decoded._id).lean();
                    req.user = user;
                    return next();
                }
                catch (error) {
                    if (error.name === 'TokenExpiredError') {
                        const isSuccess = yield this.refetchToken(req, res);
                        if (isSuccess)
                            return next();
                        return next(http_errors_1.default.Unauthorized());
                    }
                }
            }
            return next(http_errors_1.default.Unauthorized());
        });
    }
    isUserActive(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { authorization } = req.headers;
            if (authorization) {
                const token = authorization.split(' ')[1];
                if (!token) {
                    return next(http_errors_1.default.Unauthorized());
                }
                const decoded = yield this.jwtService.verifyAccessToken(token);
                const { mongodb } = this.context;
                const { getModel } = (0, db_schemas_1.createConnect)(mongodb);
                const User = getModel('User');
                const user = yield User.findById(decoded._id).lean();
                req.user = user;
                return next();
            }
            return next(http_errors_1.default.Unauthorized());
        });
    }
    isAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { authorization } = req.headers;
            if (authorization) {
                const token = authorization.split(' ')[1];
                if (!token) {
                    return next(http_errors_1.default.Unauthorized());
                }
                const decoded = yield this.jwtService.verifyAccessToken(token);
                const { mongodb } = this.context;
                const { getModel } = (0, db_schemas_1.createConnect)(mongodb);
                const User = getModel('User');
                const user = yield User.findById(decoded._id).lean();
                const { roles = [] } = user;
                if (user.status !== 'active') {
                    return next(http_errors_1.default.Forbidden('Your account has not been activated'));
                }
                if (!roles.includes(db_schemas_1.ACCOUNT_ROLES_TYPE.Admin)) {
                    return next(http_errors_1.default.Forbidden('You do not have permission'));
                }
                req.user = user;
                return next();
            }
            return next(http_errors_1.default.Unauthorized());
        });
    }
    isSuperAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { authorization } = req.headers;
            if (authorization) {
                const token = authorization.split(' ')[1];
                if (!token) {
                    return next(http_errors_1.default.Unauthorized());
                }
                const decoded = yield this.jwtService.verifyAccessToken(token);
                const { mongodb } = this.context;
                const { getModel } = (0, db_schemas_1.createConnect)(mongodb);
                const User = getModel('User');
                const user = yield User.findById(decoded._id).lean();
                const { roles = [] } = user;
                if (user.status !== 'active') {
                    return next(http_errors_1.default.Forbidden('Your account has not been activated'));
                }
                if (!roles.includes(db_schemas_1.ACCOUNT_ROLES_TYPE.SuperAdmin)) {
                    return next(http_errors_1.default.Forbidden('You do not have permission'));
                }
                req.user = user;
                return next();
            }
            return next(http_errors_1.default.Unauthorized());
        });
    }
}
exports.AuthRole = AuthRole;

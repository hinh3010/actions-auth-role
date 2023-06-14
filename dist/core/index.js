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
const http_errors_1 = __importDefault(require("http-errors"));
const mongo_db_1 = require("../connections/mongo.db");
const jwt_service_1 = require("../services/jwt.service");
class AuthRole {
    constructor(context) {
        this.isAuthorized = (req, _, next) => __awaiter(this, void 0, void 0, function* () {
            const { authorization } = req.headers;
            if (!authorization) {
                return next(http_errors_1.default.Unauthorized());
            }
            const token = authorization.split(' ')[1];
            if (!token) {
                return next(http_errors_1.default.Unauthorized());
            }
            try {
                const decoded = yield this.jwtService.verifyAccessToken(token);
                const { getModel } = (0, mongo_db_1.getStoreDb)(this.context);
                const User = getModel('User');
                const user = yield User.findById(decoded._id).lean();
                req.user = user;
                return next();
            }
            catch (error) {
                return next(http_errors_1.default.Unauthorized());
            }
        });
        this.isUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield this.isAuthorized(req, res, next);
        });
        this.isUserActive = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield this.isAuthorized(req, res, (error) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    return next(error);
                }
                const { status } = req.user;
                if (status !== 'active') {
                    return next(http_errors_1.default.Forbidden('Your account has not been activated'));
                }
                return next();
            }));
        });
        this.checkRole = (role) => {
            return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                yield this.isAuthorized(req, res, (error) => __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        return next(error);
                    }
                    const { status, roles = [] } = req.user;
                    if (status !== 'active') {
                        return next(http_errors_1.default.Forbidden('Your account has not been activated'));
                    }
                    if (!roles.includes(role)) {
                        return next(http_errors_1.default.Forbidden('You do not have permission'));
                    }
                    return next();
                }));
            });
        };
        this.isSuperAdmin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield this.isAuthorized(req, res, (error) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    return next(error);
                }
                const { status, roles = [] } = req.user;
                if (status !== 'active') {
                    return next(http_errors_1.default.Forbidden('Your account has not been activated'));
                }
                if (!roles.includes(db_schemas_1.ACCOUNT_ROLES_TYPE.SuperAdmin)) {
                    return next(http_errors_1.default.Forbidden('You do not have permission'));
                }
                return next();
            }));
        });
        this.isAdmin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield this.isAuthorized(req, res, (error) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    return next(error);
                }
                const { status, roles = [] } = req.user;
                if (status !== 'active') {
                    return next(http_errors_1.default.Forbidden('Your account has not been activated'));
                }
                if (!roles.includes(db_schemas_1.ACCOUNT_ROLES_TYPE.Admin)) {
                    return next(http_errors_1.default.Forbidden('You do not have permission'));
                }
                return next();
            }));
        });
        this.context = context;
        this.jwtService = new jwt_service_1.JwtService(context);
    }
}
exports.AuthRole = AuthRole;

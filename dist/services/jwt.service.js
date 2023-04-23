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
exports.JwtService = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./../config");
class JwtService {
    constructor(context) {
        this.context = context;
    }
    generateAccessToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const [serret, expires] = yield bluebird_1.default.all([
                (0, config_1.getJwtSetting)(this.context)('jwt_access_token_secret'),
                (0, config_1.getJwtSetting)(this.context)('jwt_access_token_expires')
            ]);
            const options = {
                expiresIn: expires,
                algorithm: 'HS256',
                subject: 'authentication'
            };
            try {
                return jsonwebtoken_1.default.sign(payload, serret, options);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    generateRefreshToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const [serret, expires] = yield bluebird_1.default.all([
                (0, config_1.getJwtSetting)(this.context)('jwt_refresh_token_secret'),
                (0, config_1.getJwtSetting)(this.context)('jwt_refresh_token_expires')
            ]);
            const options = {
                expiresIn: expires,
                algorithm: 'HS256',
                subject: 'authentication'
            };
            try {
                return jsonwebtoken_1.default.sign(payload, serret, options);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    verifyAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const serret = yield (0, config_1.getJwtSetting)(this.context)('jwt_access_token_secret');
            return jsonwebtoken_1.default.verify(token, serret);
        });
    }
    verifyRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const serret = yield (0, config_1.getJwtSetting)(this.context)('jwt_refresh_token_secret');
            return jsonwebtoken_1.default.verify(refreshToken, serret);
        });
    }
}
exports.JwtService = JwtService;

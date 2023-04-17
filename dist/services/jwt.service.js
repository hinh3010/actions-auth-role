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
const config_1 = require("./../config");
const crypto_js_1 = __importDefault(require("crypto-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const privateKey = crypto_js_1.default.lib.WordArray.random(32).toString(crypto_js_1.default.enc.Hex);
const publicKey = crypto_js_1.default.SHA256(privateKey).toString();
console.log(publicKey);
class JwtService {
    generateAccessToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = yield (0, config_1.getJwtSetting)();
            return new Promise((resolve, reject) => {
                const serret = setting.ACCESS_TOKEN_SECRET;
                const options = {
                    expiresIn: setting.ACCESS_TOKEN_EXPIRES,
                    algorithm: 'HS256',
                    subject: 'authentication'
                };
                jsonwebtoken_1.default.sign(payload, serret, options, (err, token) => {
                    if (err)
                        reject(err);
                    resolve(token);
                });
            });
        });
    }
    generateRefreshToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = yield (0, config_1.getJwtSetting)();
            const serret = setting.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: setting.REFRESH_TOKEN_EXPIRES,
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
            const setting = yield (0, config_1.getJwtSetting)();
            return jsonwebtoken_1.default.verify(token, setting.ACCESS_TOKEN_SECRET);
        });
    }
    verifyRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = yield (0, config_1.getJwtSetting)();
            return jsonwebtoken_1.default.verify(refreshToken, setting.REFRESH_TOKEN_SECRET);
        });
    }
}
exports.JwtService = JwtService;

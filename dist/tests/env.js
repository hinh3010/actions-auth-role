"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Env = void 0;
const dotenv = __importStar(require("dotenv"));
const NODE_ENV = process.env.NODE_ENV === 'production' ? 'production.env' : 'dev.env';
dotenv.config({ path: NODE_ENV });
exports.Env = {
    NODE_ENV,
    MONGO_CONNECTION: {
        URI: (_a = process.env.MONGO_URI) !== null && _a !== void 0 ? _a : '',
        OPTIONS: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
            sslValidate: true,
            socketTimeoutMS: 60000,
            connectTimeoutMS: 30000,
            serverSelectionTimeoutMS: 5000
        }
    },
    REDIS_CONNECTION: {
        URI: (_b = process.env.REDIS_URI) !== null && _b !== void 0 ? _b : ''
    }
};

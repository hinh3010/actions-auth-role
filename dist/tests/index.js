"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_schemas_1 = require("@hellocacbantre/db-schemas");
const express_1 = __importDefault(require("express"));
const __1 = require("..");
const connect_1 = require("./connect");
const app = (0, express_1.default)();
const authRole = new __1.AuthRole({
    mongoDb: {
        instance: connect_1.platformDb
    },
    redisDb: {
        instance: connect_1.RedisIoClient
    }
});
const handlerError = (err, _, res, __) => {
    var _a;
    return res.json({
        status: (_a = err.status) !== null && _a !== void 0 ? _a : 500,
        message: err.message
    });
};
app.get('/', authRole.checkRole(db_schemas_1.ACCOUNT_ROLES_TYPE.User), authRole.isUser, (req, res) => {
    res.send('Xin chào, đây là trang chủ!');
});
app.use(handlerError);
app.listen(3001, () => {
    console.log('Server đang chạy trên cổng 3000...');
});
// ts-node-esm src/tests/index.ts
